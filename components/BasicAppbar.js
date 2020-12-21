import PropTypes from "prop-types";
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar } from "@material-ui/core";
import AppBarLogoImage from "./AppBarLogoImage";

const styles = (theme) => ({
  appBar: {
    position: "relative",
  },
  logo: {
    height: 25,
    marginRight: theme.spacing(1),
    cursor: "pointer",
  },
  title: {
    cursor: "pointer",
  },
});

const BasicAppbar = withStyles(styles)(({ classes }) => (
  <AppBar position="absolute" color="default" className={classes.appBar}>
    <Toolbar>
      <AppBarLogoImage />
    </Toolbar>
  </AppBar>
));

BasicAppbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BasicAppbar);
