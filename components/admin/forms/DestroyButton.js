import { Button } from "@material-ui/core"
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  button: {
    marginRight: theme.spacing(1)
  }
});

let DestroyButton = ({ classes, onClick }) => (
  <Button variant="contained" onClick={() => onClick()} value="delete" color="secondary" className={classes.button}>
    Eliminar
  </Button>
)

export default withStyles(styles)(DestroyButton);