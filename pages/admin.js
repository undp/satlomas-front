import { withStyles } from "@material-ui/core/styles";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import LayersIcon from "@material-ui/icons/Layers";
import MapIcon from "@material-ui/icons/Map";
import MenuIcon from "@material-ui/icons/Menu";
import DashboardIcon from "@material-ui/icons/Dashboard";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import HomeIcon from "@material-ui/icons/Home";
import classNames from "classnames";
import Head from "next/head";
import PropTypes from "prop-types";
import React from "react";
import LayersContent from "../components/admin/LayersContent";
import MapsContent from "../components/admin/MapsContent";
import KeysContent from "../components/admin/KeysContent";
import HomeContent from "../components/admin/HomeContent";
import ButtonsContent from "../components/ButtonsContent";
import { Link, withTranslation, i18n } from "../i18n";
import { buildApiUrl } from "../utils/api";
import { withAuthSync } from "../utils/auth";
import AccountCircle from "@material-ui/icons/AccountCircle";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";

import {
  AppBar,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  ListItemSecondaryAction,
} from '@material-ui/core';

const drawerWidth = 200;

const styles = (theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    display: "flex",
    flexGrow: 1,
    alignItems: "center",
  },
  titleLogo: {
    marginRight: 5,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    height: "100vh",
    overflow: "auto",
  },
  chartContainer: {
    marginLeft: -22,
  },
  tableContainer: {
    height: 320,
  },
  h5: {
    marginBottom: theme.spacing(2),
  },
  button: {
    color: "white",
  },
});

const sortedSections = ["stations", "maps", "layers", "keys"];
const sortedSectionsBeta = ["stations", "maps", "layers", "keys"];

const sections = {
  stations: {
    path: "/stations",
    icon: <DashboardIcon />,
    content: null,
  },
  layers: {
    key: "layers",
    path: "/layers",
    icon: <LayersIcon />,
    content: <LayersContent />,
  },
  maps: {
    key: "maps",
    path: "/maps",
    icon: <MapIcon />,
    content: <MapsContent />,
  },
  keys: {
    key: "keys",
    path: "/keys",
    icon: <VpnKeyIcon />,
    content: <KeysContent />,
  },
};

class Admin extends React.Component {
  state = {
    open: true,
    section: null,
    beta: false,
    contextualMenuOpen: null,
    username: "",
  };

  static async getInitialProps({ query }) {
    return {
      namespacesRequired: ["me", "common"],
      query: query,
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

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleSectionChange = (section) => {
    this.setState({ section });
  };


  render() {
    const { t, classes, token } = this.props;
    const { section, open, beta } = this.state;

    const sectionList = beta ? sortedSectionsBeta : sortedSections;

    const originalContent = section && sections[section].content;
    const content =
      originalContent &&
      React.cloneElement(originalContent, {
        token: token,
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
            {/* <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton> */}
            <ButtonsContent/>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(
              classes.drawerPaper,
              !open && classes.drawerPaperClose
            ),
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
            <Link href="/admin">
              <ListItem button selected={!sectionList.includes(section)}>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary={t(`sidebar.home`)} />
              </ListItem>
            </Link>
          </List>
          <Divider />
          <List>
            <Link href="/stations-map">
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
            {sectionList.map((key) => (
              <Link
                key={key}
                href={`/admin?section=${key}`}
                as={`/admin${sections[key].path}`}
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
              href={`/admin?section=requests`}
              as={`/admin${sections["requests"].path}`}
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

Admin.propTypes = {
  classes: PropTypes.object.isRequired,
};

Admin = withStyles(styles)(Admin);
Admin = withTranslation(["me", "common"])(Admin);
Admin = withAuthSync(Admin);

export default Admin;
