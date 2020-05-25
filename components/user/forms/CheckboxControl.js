import { withStyles } from '@material-ui/core/styles';
import {
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core"

const styles = _theme => ({
});

let CheckboxControl = ({ classes, label, checked, onChange, disabled }) => (
  <FormControl component="fieldset" className={classes.formControl} fullWidth>
    <FormLabel component="legend">{label}</FormLabel>
    <FormGroup>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={onChange}
            disabled={disabled}
          />
        }
      />
    </FormGroup>
  </FormControl>
)

CheckboxControl = withStyles(styles)(CheckboxControl);

export default CheckboxControl;