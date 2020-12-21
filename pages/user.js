import { withStyles } from "@material-ui/core/styles";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import NotificationsIcon from "@material-ui/icons/Notifications";
import ListIcon from "@material-ui/icons/List";
import PersonIcon from "@material-ui/icons/Person";
import MenuIcon from "@material-ui/icons/Menu";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import AllInboxIcon from "@material-ui/icons/AllInbox";
import classNames from "classnames";
import Head from "next/head";
import PropTypes from "prop-types";
import React from "react";
import HomeContent from "../components/user/HomeContent";
import { Link, withTranslation } from "../i18n";
import { routerReplace } from "../utils/router";
import { withAuthSync } from "../utils/auth";
import RasterListContent from "../components/user/RasterListContent";
import ParameterRulesListContent from "../components/user/ParameterRulesListContent";
import ScopeTypeRulesListContent from "../components/user/ScopeTypeRulesListContent";
import ScopeRulesListContent from "../components/user/ScopeRulesListContent";
import CreateParameterRuleContent from "../components/user/CreateParameterRuleContent";
import CreateScopeTypeRuleContent from "../components/user/CreateScopeTypeRuleContent";
import CreateScopeRuleContent from "../components/user/CreateScopeRuleContent";
import AlertsTableContent from "../components/user/AlertsTableContent";
import UserProfileContent from "../components/user/UserProfileContent";
import RasterImportPerusatContent from "../components/user/RasterImportPerusatContent";
import JobsContent from "../components/user/JobsContent";
import AppBarButtons from "../components/AppBarButtons";
import config from "../config";

const { appName } = config;

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
} from "@material-ui/core";

const drawerWidth = 300;

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
    cursor: "pointer",
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

const allSections = [
  "alerts",
  "jobs",
  "rasters",
  "rules",
  "profile",
  "parameter-rules",
  "scope-type-rules",
  "scope-rules",
  "create-parameter-rule",
  "create-scope-type-rule",
  "create-scope-rule",
  "rasters-import-perusat",
];

const sidebarSections = [
  "alerts",
  "jobs",
  "rasters",
  "parameter-rules",
  "scope-type-rules",
  "scope-rules",
];

const sections = {
  alerts: {
    key: "alerts",
    path: "/alerts",
    icon: <NotificationsIcon />,
    content: <AlertsTableContent />,
  },
  jobs: {
    key: "jobs",
    path: "/jobs",
    icon: <AllInboxIcon />,
    content: <JobsContent />,
  },
  rasters: {
    key: "rasters",
    path: "/rasters",
    icon: <PhotoLibraryIcon />,
    content: <RasterListContent />,
  },
  "parameter-rules": {
    key: "parameter-rules",
    path: "/parameter-rules",
    icon: <ListIcon />,
    content: <ParameterRulesListContent />,
  },
  "scope-type-rules": {
    key: "scope-type-rules",
    path: "/scope-type-rules",
    icon: <ListIcon />,
    content: <ScopeTypeRulesListContent />,
  },
  "scope-rules": {
    key: "scope-rules",
    path: "/scope-rules",
    icon: <ListIcon />,
    content: <ScopeRulesListContent />,
  },
  "create-parameter-rule": {
    key: "create-parameter-rule",
    path: "/parameter-rules/new",
    content: <CreateParameterRuleContent />,
  },
  "create-scope-type-rule": {
    key: "create-scope-type-rule",
    path: "/scope-type-rules/new",
    content: <CreateScopeTypeRuleContent />,
  },
  "create-scope-rule": {
    key: "create-scope-rule",
    path: "/scope-rules/new",
    content: <CreateScopeRuleContent />,
  },
  profile: {
    key: "profile",
    path: "/profile",
    icon: <PersonIcon />,
    content: <UserProfileContent />,
  },
  "rasters-import-perusat": {
    key: "rasters-import-perusat",
    path: "/rasters/import-perusat",
    content: <RasterImportPerusatContent />,
  },
};

class UserPanel extends React.Component {
  state = {
    open: true,
    section: null,
    contextualMenuOpen: null,
    username: "",
  };

  static async getInitialProps({ query }) {
    return {
      namespacesRequired: ["me", "common"],
      query,
    };
  }

  constructor(props) {
    super(props);

    // console.log("Query param", props.query);
    let { section } = props.query;

    // Set current section based on path
    if (section && allSections.includes(section)) {
      // console.log("Set section from query param:", section);
      this.state.section = section;
    }
  }

  componentDidMount() {
    // By default, go to /alerts
    const { section } = this.props.query;
    if (!section) {
      routerReplace("/user/alerts");
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
    const { t, classes, token, query } = this.props;
    const { section, open } = this.state;

    console.log("Rendering content of:", section);
    const originalContent = section && sections[section].content;
    const content =
      originalContent &&
      React.cloneElement(originalContent, {
        ...query,
        token,
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
            <Link href="/">
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                className={classes.title}
              >
                {appName} - Panel de Usuario
              </Typography>
            </Link>
            <AppBarButtons />
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
            {sidebarSections.map((key) => (
              <Link
                key={key}
                href={`/user?section=${key}`}
                as={`/user${sections[key].path}`}
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
          <List>
            <Link
              href={`/user?section=profile`}
              as={`/user${sections["profile"].path}`}
            >
              <ListItem
                button
                onClick={() => this.handleSectionChange("profile")}
                selected={section === "profile"}
              >
                <ListItemIcon>{sections["profile"].icon}</ListItemIcon>
                <ListItemText primary={t(`sidebar.profile`)} />
              </ListItem>
            </Link>
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          {section == null ? <HomeContent token={token} /> : content}
        </main>
      </div>
    );
  }
}

UserPanel.propTypes = {
  classes: PropTypes.object.isRequired,
};

UserPanel = withStyles(styles)(UserPanel);
UserPanel = withTranslation(["me", "common"])(UserPanel);
UserPanel = withAuthSync(UserPanel);

export default UserPanel;
