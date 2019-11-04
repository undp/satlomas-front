import Paper from "@material-ui/core/Paper";
import React from "react";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  main: {
    width: "auto",
    display: "block", // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    [theme.breakpoints.up(500 + theme.spacing.unit * 2 * 2)]: {
      width: 500,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 4,
    display: "flex",
    flexDirection: "column",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  }
});

const StepContentContainer = ({ classes, children, width }) => (
  <main className={classes.main} style={{ width: width }}>
    <Paper className={classes.paper}>{children}</Paper>
  </main>
);

export default withStyles(styles)(StepContentContainer);
