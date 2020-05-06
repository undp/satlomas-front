import PropTypes from "prop-types";
import React from "react";
import { Link } from "../i18n";
import { withStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import config from "../config";

const { appName } = config;

const styles = theme => ({
  appBar: {
    position: "relative"
  },
  logo: {
    height: 25,
    marginRight: theme.spacing(1),
    cursor: "pointer"
  },
  title: {
    cursor: "pointer"
  }
});

const BasicAppbar = withStyles(styles)(({ classes }) => (
  <AppBar position="absolute" color="default" className={classes.appBar}>
    <Toolbar>
      <Link href="/">
        <Typography
          variant="h6"
          color="inherit"
          noWrap
          className={classes.title}
        >
          {appName}
        </Typography>
      </Link>
    </Toolbar>
  </AppBar>
));

BasicAppbar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(BasicAppbar);
