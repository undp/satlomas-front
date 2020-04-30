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
import { withTranslation, i18n } from "../i18n";
import { logout } from "../utils/auth";
import { buildApiUrl } from "../utils/api";
import Router from "next/router";
import axios from "axios";
import cookie from "js-cookie";
import Snackbar from "@material-ui/core/Snackbar";
import NotificationsIcon from '@material-ui/icons/Notifications';
import Badge from '@material-ui/core/Badge';
import Moment from 'react-moment';

const MAX_NOTIFICATIONS_FIRST = 5;

const styles = (theme) => ({


  menuItem: {
    minWidth: 150,
  },
  listItemIcon:{
    minWidth: 0,
  },
  toolbarButtons: {
    marginLeft: 'auto',
  },

  momentFont: {
    fontSize: 9,
    marginLeft: 'auto',
  },

  notificationText:{
    marginRight: 20,

  },
  notifButton:{
    justifyContent: 'center',
  }
});


class LoadingSnackbar extends React.Component {
render() {
    const { open } = this.props;
    return (
    <Snackbar
        anchorOrigin={{
        vertical: "bottom",
        horizontal: "left"
        }}
        open={open}
        ContentProps={{
        "aria-describedby": "message-id"
        }}
        message={<span id="message-id">Loading...</span>}
    />
    );
}
}
  
LoadingSnackbar = withStyles(styles)(LoadingSnackbar);

class ButtonsContent extends React.Component {
  state = {
    loading: true,
    beta: false,
    contextualMenuOpen: null,
    username: undefined,
    notificationsCount: 0,
    notificationsFirst: [],
    notificationsLast: [],
    notificationsMenuOpen: null,
    showLastNotifications: false
  }

  static async getInitialProps({ query }) {
    return {
      namespacesRequired: ["me", "common"],
      query: query,
    };
  }

  componentDidMount() {
    this.getUserName();
    setInterval(() => {this.getNotifications() }, 1000);
  }

  async getUserName() {
    const token = cookie.get("token");
    try {
      const response = await axios.get(buildApiUrl("/auth/user/"), {
        headers: {
          "Accept-Language": i18n.language,
          Authorization: token,
        },
      });
      const {
        username
      } = response.data;
      this.setState({ username, loading: false });
    } catch (error) {
      this.setState({ username: "", loading: false})
      console.error(error);
    }
  }

  async getNotifications() {
    var notificationsFirst = [];
    var notificationsLast = [];
    var notificationsCount = 0;
    const token = cookie.get("token");

    try {
      const response = await axios.get(buildApiUrl("/alerts"), {
        headers: {
          "Accept-Language": i18n.language,
          Authorization: token,
        },
        data: {
            user: this.state.username
        },
      });
      notificationsCount = response.data.length;
      if (notificationsCount > MAX_NOTIFICATIONS_FIRST) {
          notificationsFirst = response.data.slice(0, MAX_NOTIFICATIONS_FIRST);
          notificationsLast = response.data.slice(MAX_NOTIFICATIONS_FIRST, response.data.length);
      } else {
        notificationsFirst = response.data;
      }
    } catch (error) {
      console.error(error);
    }
    this.setState({notificationsFirst, notificationsLast, notificationsCount});
   }

  handleContextualMenuClose = () => {
    this.setState({ contextualMenuOpen: null });
  }

  handleContextualMenuClick = (event) => {
    this.setState({ contextualMenuOpen: event.currentTarget });
  }

  profileLogout = () => {
    logout();
  }

  menuDashboardClick = () => {
    routerPush("/admin");
  }
  handleNotifMenuClick = (event) => {
    this.setState({ notificationsMenuOpen: event.currentTarget});
  }

  handleNotifMenuClose = () => {
    this.setState({ notificationsMenuOpen: null, showLastNotifications: false });
  }

  handleMoreNotif = () => {
    this.setState({ showLastNotifications: true});
  }

  render(){
    const { classes, t } = this.props;
    const { 
        contextualMenuOpen, 
        username, 
        loading, 
        notificationsFirst,
        notificationsLast,
        notificationsCount,
        notificationsMenuOpen,
        showLastNotifications  } = this.state;

    return(
     
            <div className={classes.toolbarButtons}>
            { username == undefined ?
            <div></div> 
            : username != "" ? 
             <div><IconButton 
             aria-label="account of current user"
             aria-controls="menu-appbar"
             aria-haspopup="true"
             color="inherit"
             onClick={this.handleNotifMenuClick}
             >
                <Badge badgeContent={notificationsCount} color="secondary">
                <NotificationsIcon />
                </Badge>
            </IconButton>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                onClick={this.handleContextualMenuClick}
              >
                <AccountCircle />
              </IconButton></div>
              :
              <Button variant="inherit"
              onClick={() => Router.push("/login")}>
                Login
            </Button>
            }
            <Menu anchorEl={notificationsMenuOpen}
                keepMounted
                open={Boolean(notificationsMenuOpen)}
                onClose={this.handleNotifMenuClose}
                >
              <MenuItem>Alertas</MenuItem>
              {notificationsFirst.map((not) => (
                 <MenuItem>
                    <Typography className={classes.notificationText}>Alerta {not.id}</Typography>  
                    <Moment className={classes.momentFont} fromNow>{not.last_seen_at}</Moment>
                 </MenuItem>
              ))}{ showLastNotifications &&  notificationsLast.map((not) => (
                <MenuItem>
                <Typography className={classes.notificationText}>Alerta {not.id}</Typography>  
                <Moment className={classes.momentFont} fromNow>{not.last_seen_at}</Moment>
             </MenuItem>
              ))
              }
              { !showLastNotifications &&
              <MenuItem className={classes.notifButton}>
              <Button onClick={this.handleMoreNotif}>
                Ver más...
            </Button></MenuItem>
            }
            </Menu>
              <Menu
                anchorEl={contextualMenuOpen}
                keepMounted
                open={Boolean(contextualMenuOpen)}
                onClose={this.handleContextualMenuClose}
              >
                <MenuItem className={classes.menuItem}>
                  {username}
                </MenuItem>
                <MenuItem className={classes.menuItem}
                onClick={() => Router.push("/admin")}>
                Admin
                </MenuItem>
                <MenuItem className={classes.menuItem} 
                onClick={this.profileLogout} 
                >
                    {t("common:logout_btn")}
                  <ListItemSecondaryAction>
                    <ListItemIcon edge="end" aria-label="logout" className={classes.listItemIcon}>
                      <PowerSettingsNewRoundedIcon />
                    </ListItemIcon>
                  </ListItemSecondaryAction>
                </MenuItem>
              </Menu>
              <LoadingSnackbar open={loading} />
            </div>         
        
    );
  }
}


ButtonsContent.propTypes = {
  classes: PropTypes.object.isRequired,
};

ButtonsContent = withTranslation(["me", "common"])(ButtonsContent);
ButtonsContent = withStyles(styles)(ButtonsContent);

export default ButtonsContent;
