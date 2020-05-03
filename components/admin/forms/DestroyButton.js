import { Button } from "@material-ui/core"
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  button: {
    marginRight: theme.spacing(1)
  }
});

let DestroyButton = ({ classes }) => (
  <Button variant="contained" disabled value="delete" color="secondary" type="submit" className={classes.button}>
    Eliminar
  </Button>
)

export default withStyles(styles)(DestroyButton);