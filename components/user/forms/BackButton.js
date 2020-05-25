import { Button } from "@material-ui/core"
import { withStyles } from '@material-ui/core/styles';
import { routerPush } from "../../../utils/router";

const styles = theme => ({
  button: {
    marginRight: theme.spacing(1)
  }
});

let BackButton = ({ classes, url }) => (
  <Button variant="contained" value="delete" color="secondary" onClick={() => routerPush(url)} className={classes.button}>
    Cancelar
  </Button>
)

export default withStyles(styles)(BackButton);