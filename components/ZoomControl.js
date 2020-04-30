import {
  Fab,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  fabContainer: {
    display: "block",
  },
  fab: {
    margin: theme.spacing(1),
  },
});

const ZoomControl = ({ classes, onZoomInClick, onZoomOutClick }) => (
  <div>
    <div className={classes.fabContainer}>
      <Fab
        color="primary"
        size="small"
        aria-label="Zoom in"
        className={classes.fab}
        onClick={onZoomInClick}
      >
        <AddIcon />
      </Fab>
    </div>
    <div className={classes.fabContainer}>
      <Fab
        color="primary"
        size="small"
        aria-label="Zoom out"
        className={classes.fab}
        onClick={onZoomOutClick}
      >
        <RemoveIcon />
      </Fab>
    </div>
  </div>
);

export default withStyles(styles)(ZoomControl);
