import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Drawer } from "@material-ui/core";

export const drawerWidth = 360;

const styles = (theme) => ({
  // drawer: {
  //   width: drawerWidth,
  //   flexShrink: 0,
  // },
  drawerPaper: {
    width: drawerWidth,
  },
});

const MapDrawer = ({ classes, children, open, onClose }) => (
  <Drawer
    open={open}
    onClose={onClose}
    className={classes.drawer}
    classes={{
      paper: classes.drawerPaper,
    }}
    anchor="left"
  >
    {children}
  </Drawer>
);

MapDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onMenuClick: PropTypes.func,
};

MapDrawer.defaultProps = {
  open: true,
  onClose: () => {},
  onMenuClick: () => {},
};

export default withStyles(styles)(MapDrawer);
