import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";

const styles = {
  root: {
    padding: "2px 4px",
    margin: "10px",
    display: "flex",
    alignItems: "center",
    width: 340
  },
  input: {
    marginLeft: 8,
    flex: 1
  },
  iconButton: {
    padding: 10
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4
  }
};

const StationSearchField = ({ classes, onMenuClick }) => (
  <Paper className={classes.root} elevation={1}>
    <IconButton
      className={classes.iconButton}
      aria-label="Menu"
      onClick={onMenuClick}
    >
      <MenuIcon />
    </IconButton>
    <InputBase className={classes.input} placeholder="Search for a Station" />
    <IconButton className={classes.iconButton} aria-label="Search">
      <SearchIcon />
    </IconButton>
  </Paper>
);

StationSearchField.propTypes = {
  classes: PropTypes.object.isRequired,
  onMenuClick: PropTypes.func
};

StationSearchField.defaultProps = {
  onMenuClick: () => {}
};

export default withStyles(styles)(StationSearchField);
