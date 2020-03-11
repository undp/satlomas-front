import AppBar from "@material-ui/core/AppBar";
import withStyles from "@material-ui/core/styles/withStyles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import React from "react";
import { Link } from "../i18n";

const styles = theme => ({
  appBar: {
    position: "relative"
  },
  logo: {
    height: 25,
    marginRight: theme.spacing.unit,
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
          GeoLomas Platform
        </Typography>
      </Link>
    </Toolbar>
  </AppBar>
));

BasicAppbar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(BasicAppbar);
