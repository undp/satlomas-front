import { withStyles } from "@material-ui/core/styles";
import { Fab } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

const styles = (theme) => ({
  fabContainer: {
    display: "block",
  },
  fab: {
    margin: theme.spacing.unit,
  },
});

let SearchFab = ({ classes, ...props }) => (
  <div className={classes.fabContainer}>
    <Fab
      color="primary"
      size="small"
      aria-label="Search"
      className={classes.fab}
      {...props}
    >
      <SearchIcon />
    </Fab>
  </div>
);

SearchFab = withStyles(styles)(SearchFab);

export default SearchFab;
