import AppBar from "@material-ui/core/AppBar";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { withStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import LayersIcon from "@material-ui/icons/Layers";
import MapIcon from "@material-ui/icons/Map";
import MenuIcon from "@material-ui/icons/Menu";
import DashboardIcon from "@material-ui/icons/Dashboard";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import HomeIcon from "@material-ui/icons/Home";
import axios from "axios";
import classNames from "classnames";
import cookie from "js-cookie";
import Head from "next/head";
import PropTypes from "prop-types";
import React from "react";
import LayersContent from "../../components/home/LayersContent";
import MapsContent from "../../components/home/MapsContent";
import KeysContent from "../../components/home/KeysContent";
import HomeContent from "../../components/home/HomeContent";
import SelectProjectButton from "../../components/SelectProjectButton";
import { Link, withNamespaces, i18n } from "../../i18n";
import { buildApiUrl } from "../../utils/api";
import { withAuthSync, logout } from "../../utils/auth";
import { routerReplace } from "../../utils/router";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

const drawerWidth = 200;

const styles = theme => ({
  root: {
    display: "flex"
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36
  },
  menuButtonHidden: {
    display: "none"
  },
  title: {
    display: "flex",
    flexGrow: 1,
    alignItems: "center"
  },
  titleLogo: {
    marginRight: 5
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing.unit * 9
    }
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: "100vh",
    overflow: "auto"
  },
  chartContainer: {
    marginLeft: -22
  },
  tableContainer: {
    height: 320
  },
  h5: {
    marginBottom: theme.spacing.unit * 2
  },
  button: {
    color: "white"
  }
});

const sortedSections = ["stations", "maps", "layers", "keys"];
const sortedSectionsBeta = ["stations", "maps", "layers", "keys"];

const sections = {
  stations: {
    path: "/stations",
    icon: <DashboardIcon />,
    content: null
  },
  layers: {
    key: "layers",
    path: "/layers",
    icon: <LayersIcon />,
    content: <LayersContent />
  },
  maps: {
    key: "maps",
    path: "/maps",
    icon: <MapIcon />,
    content: <MapsContent />
  },
  keys: {
    key: "keys",
    path: "/keys",
    icon: <VpnKeyIcon />,
    content: <KeysContent />
  }
};

class Home extends React.Component {
  state = {
    open: true,
    section: null,
    beta: false,
    contextualMenuOpen: null,
    userEmail: ""
  };

  static async getInitialProps({ query }) {
    return {
      namespacesRequired: ["me", "common"],
      query: query
    };
  }

  constructor(props) {
    super(props);

    let { section } = props.query;

    // Set current section based on path
    if (section && sortedSections.includes(section)) {
      this.state.section = section;
    }
  }

  componentDidMount() {
    // If there is not selected project, go there
    const projectId = cookie.get("project");
    if (!projectId) {
      routerReplace("/select-project");
    }

    this._checkForBeta();
    this.getEmail();
  }

  async _checkForBeta() {
    const { token } = this.props;

    try {
      const response = await axios.get(buildApiUrl(`/auth/user/`), {
        headers: {
          "Accept-Language": i18n.language,
          Authorization: token
        }
      });
      const { profile } = response.data;
      const beta = profile.in_beta;
      this.setState({ beta });
      if (beta) {
        console.log("Beta mode enabled");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getEmail() {
    const { token } = this.props;
    try {
      const response = await axios.get(buildApiUrl("/auth/user/"), {
        headers: {
          "Accept-Language": i18n.language,
          Authorization: token
        }
      });
      const userData = response.data;
      this.setState({ userEmail: userData.email });
    } catch (error) {
      console.error(error);
    }
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleSectionChange = section => {
    this.setState({ section });
  };

  handleContextualMenuClick = event => {
    this.setState({ contextualMenuOpen: event.currentTarget });
  };

  handleContextualMenuClose = () => {
    this.setState({ contextualMenuOpen: null });
  };

  profileLogout = () => {
    logout();
  };

  render() {
    const { t, classes, token } = this.props;
    const { section, open, beta, contextualMenuOpen, userEmail } = this.state;

    const sectionList = beta ? sortedSectionsBeta : sortedSections;

    const originalContent = section && sections[section].content;
    const content =
      originalContent &&
      React.cloneElement(originalContent, {
        token: token
      });

    return (
      <div className={classes.root}>
        <Head>
          <title>{t("common:title")}</title>
        </Head>
        <AppBar
          position="absolute"
          className={classNames(classes.appBar, open && classes.appBarShift)}
        >
          <Toolbar disableGutters={!open} className={classes.toolbar}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(
                classes.menuButton,
                open && classes.menuButtonHidden
              )}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              GeoLomas Platform
            </Typography>
            <SelectProjectButton token={token} />
            {/* <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton> */}
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
              onClick={this.handleContextualMenuClick}
            >
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={contextualMenuOpen}
              keepMounted
              open={Boolean(contextualMenuOpen)}
              onClose={this.handleContextualMenuClose}
            >
              <MenuItem>{userEmail}</MenuItem>
              <MenuItem onClick={this.profileLogout}>
                {t("common:logout_title")}
                <ListItemSecondaryAction>
                  <ListItemIcon edge="end" aria-label="logout">
                    <PowerSettingsNewIcon />
                  </ListItemIcon>
                </ListItemSecondaryAction>
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(
              classes.drawerPaper,
              !open && classes.drawerPaperClose
            )
          }}
          open={open}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={this.handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List>
            <Link href="/home">
              <ListItem button>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary={t(`sidebar.home`)} />
              </ListItem>
            </Link>
          </List>
          <Divider />
          <List>
            <Link href="/stations_map">
              <ListItem button>
                <ListItemIcon>
                  <MapIcon />
                </ListItemIcon>
                <ListItemText primary={t(`sidebar.stations_map`)} />
              </ListItem>
            </Link>
          </List>
          <Divider />
          <List>
            {sectionList.map(key => (
              <Link
                key={key}
                href={`/home?section=${key}`}
                as={`/home${sections[key].path}`}
              >
                <ListItem
                  button
                  onClick={() => this.handleSectionChange(key)}
                  selected={section === key}
                >
                  <ListItemIcon>{sections[key].icon}</ListItemIcon>
                  <ListItemText primary={t(`sidebar.${key}`)} />
                </ListItem>
              </Link>
            ))}
          </List>
          <Divider />
          {/* <List>
            <Link
              href={`/home?section=requests`}
              as={`/home${sections["requests"].path}`}
            >
              <ListItem
                button
                onClick={() => this.handleSectionChange("requests")}
                selected={section === "requests"}
              >
                <ListItemIcon>{sections["requests"].icon}</ListItemIcon>
                <ListItemText primary={t(`sidebar.requests`)} />
              </ListItem>
            </Link>
          </List> */}
        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          {section == null ? <HomeContent token={token} /> : content}
        </main>
      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired
};

Home = withStyles(styles)(Home);
Home = withNamespaces(["me", "common"])(Home);
Home = withAuthSync(Home);

export default Home;
