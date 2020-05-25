import React from "react";
import PropTypes from "prop-types";
import { Typography, Button } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Menu from "@material-ui/core/Menu";
import PowerSettingsNewRoundedIcon from '@material-ui/icons/PowerSettingsNewRounded';
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import { withStyles } from "@material-ui/core/styles";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { withSnackbar } from 'notistack';
import { withTranslation, i18n } from "../i18n";
import { logout } from "../utils/auth";
import { buildApiUrl } from "../utils/api";
import Router from "next/router";
import axios from "axios";
import cookie from "js-cookie";
import NotificationsIcon from '@material-ui/icons/Notifications';
import Badge from '@material-ui/core/Badge';
import Moment from 'react-moment';

const MAX_NOTIFICATIONS_FIRST = 5;

const styles = (_theme) => ({
  menuItem: {
    minWidth: 150,
  },
  listItemIcon: {
    minWidth: 0,
  },
  momentFont: {
    fontSize: 9,
    marginLeft: 'auto',
  },
  notificationText: {
    marginRight: 20,
  },
  notifButton: {
    justifyContent: 'center',
  }
});

class AlertsMenuButton extends React.Component {
  state = {
    anchorEl: null,
    alerts: [],
    badgeShow: false,
    count: 0,
    hasMoreAlerts: false
  }

  componentDidMount() {
    this.fetchAlerts();
    this.intervalId = setInterval(() => {
      if (!this.intervalId) return;
      this.fetchAlerts();
    }, 5000);
  }

  componentWillUnmount() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = null;
  }

  async fetchAlerts() {
    const token = cookie.get("token");

    try {
      const response = await axios.get(buildApiUrl("/alerts/latest/"), {
        headers: {
          "Accept-Language": i18n.language,
          Authorization: token,
        },
      });

      const allAlerts = response.data['alerts'];
      const hasMoreAlerts = allAlerts.count > MAX_NOTIFICATIONS_FIRST;
      const alerts = allAlerts.slice(0, MAX_NOTIFICATIONS_FIRST);

      this.setState({
        alerts,
        hasMoreAlerts,
        count: response.data['news'],
        badgeShow: response.data['news'] == 0,
      });
    } catch (error) {
      console.error(error);
      this.props.enqueueSnackbar(`Failed to sync alerts`, {
        variant: "error",
      });
    }
  }

  expandMenu(e) {
    const token = cookie.get("token");
    this.setState({ anchorEl: e.currentTarget });
    axios.put(buildApiUrl("/alerts/mark-as-seen/"), null, {
      headers: { Authorization: token }
    });
  }

  render() {
    const { classes } = this.props;
    const { badgeShow, count, anchorEl, alerts, hasMoreAlerts } = this.state

    return (
      <>
        <IconButton
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          color="inherit"
          onClick={e => this.expandMenu(e)}
        >
          <Badge
            badgeContent={count}
            invisible={badgeShow}
            color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={() => this.setState({ anchorEl: null })}
        >
          <MenuItem>Alertas</MenuItem>
          {alerts.map(alert => (
            alert.last_seen_at ?
              <MenuItem key={alert.id}>
                <Typography className={classes.notificationText}>Alerta {alert.id}</Typography>
                <Moment className={classes.momentFont} fromNow>{alert.last_seen_at}</Moment>
              </MenuItem>
              :
              <MenuItem key={alert.id} style={{ backgroundColor: 'lightblue' }}>
                <Typography className={classes.notificationText}>Alerta {alert.id}</Typography>
              </MenuItem>


          ))}
          {!hasMoreAlerts && (
            <MenuItem className={classes.notifButton}>
              <Button onClick={() => Router.push("/user/alerts")}>
                Ver más...
              </Button>
            </MenuItem>
          )}
        </Menu>
      </>
    );
  }
}

AlertsMenuButton = withStyles(styles)(AlertsMenuButton);
AlertsMenuButton = withSnackbar(AlertsMenuButton);

class ProfileMenuButton extends React.Component {
  state = {
    anchorEl: null
  }

  render() {
    const { t, classes, username } = this.props;
    const { anchorEl } = this.state;

    return (
      <>
        <IconButton
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          color="inherit"
          onClick={e => this.setState({ anchorEl: e.currentTarget })}
        >
          <AccountCircle />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={() => this.setState({ anchorEl: null })}
        >
          <MenuItem className={classes.menuItem} onClick={() => Router.push("/user/profile")}>
            {username}
          </MenuItem>
          <MenuItem className={classes.menuItem} onClick={() => Router.push("/user")}>
            Panel de Usuario
        </MenuItem>
          <MenuItem className={classes.menuItem} onClick={() => logout()}
          >
            {t("common:logout_btn")}
            <ListItemSecondaryAction>
              <ListItemIcon edge="end" aria-label="logout" className={classes.listItemIcon}>
                <PowerSettingsNewRoundedIcon />
              </ListItemIcon>
            </ListItemSecondaryAction>
          </MenuItem>
        </Menu>
      </>
    );
  }
}

ProfileMenuButton = withStyles(styles)(ProfileMenuButton);
ProfileMenuButton = withTranslation(["me", "common"])(ProfileMenuButton);

class AppbarButtons extends React.Component {
  state = {
    loading: true,
    username: null,
  }

  static async getInitialProps({ query }) {
    return {
      namespacesRequired: ["me", "common"],
      query: query,
    };
  }

  componentDidMount() {
    this.fetchUsername();
  }

  async fetchUsername() {
    const token = cookie.get("token");

    if (token) {
      try {
        const response = await axios.get(buildApiUrl("/auth/user/"), {
          headers: {
            "Accept-Language": i18n.language,
            Authorization: token,
          },
        });
        const { username } = response.data;
        this.setState({ username, loading: false });
      } catch (error) {
        console.error(error);
        this.setState({ username: "", loading: false })
        this.props.enqueueSnackbar(`Failed to get user data`, {
          variant: "error",
        });
      }
    }

    this.setState({ loading: false })
  }

  render() {
    const { classes, t } = this.props;
    const {
      username,
      loading,
    } = this.state;

    return !loading && (
      <div className={classes.toolbarButtons}>
        {username ? (
          <>
            <AlertsMenuButton />
            <ProfileMenuButton username={username} />
          </>
        ) : (
            <Button color="inherit" onClick={() => Router.push("/login")}>Iniciar sesión</Button>
          )}
      </div>
    )
  }
}

AppbarButtons.propTypes = {
  classes: PropTypes.object.isRequired,
};

AppbarButtons = withStyles(styles)(AppbarButtons);
AppbarButtons = withSnackbar(AppbarButtons);

export default AppbarButtons;
