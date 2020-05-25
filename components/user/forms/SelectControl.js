import { withStyles } from '@material-ui/core/styles';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core"

const styles = _theme => ({
});

let SelectControl = ({ classes, id, label, items, value, disabled, onChange, required }) => (
  <FormControl required className={classes.formControl} fullWidth>
    <InputLabel htmlFor={id}>{label}</InputLabel>
    <Select
      value={value || ""}
      onChange={onChange}
      inputProps={{
        name: id,
        id,
      }}
      className={classes.selectEmpty}
      disabled={disabled}
    >
      {!required && <MenuItem value="">[Cualquiera]</MenuItem>}
      {(items || []).map(item =>
        (<MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)
      )}
    </Select>
  </FormControl>
)

SelectControl = withStyles(styles)(SelectControl);

export default SelectControl;