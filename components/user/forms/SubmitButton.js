import { Button } from "@material-ui/core"
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  button: {
    marginRight: theme.spacing(1)
  }
});

let SubmitButton = ({ classes, disabled, edit }) => (
  <Button variant="contained" value="create" color="primary" type="submit" className={classes.button} disabled={disabled}>
    {edit ? 'Guardar' : 'Crear'}
  </Button>
)

export default withStyles(styles)(SubmitButton);
