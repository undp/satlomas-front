import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  progressContainer: {
    background: "#222",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  progress: {
    margin: theme.spacing(2),
    color: "#fff"
  }
});

const LoadingProgress = ({ classes }) => (
  <div className={classes.progressContainer}>
    <CircularProgress className={classes.progress} />
  </div>
);

export default withStyles(styles)(LoadingProgress);
