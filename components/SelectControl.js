import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 290,
  },
});

let SelectControl = ({ classes, id, label, items, value, onChange }) => (
  <FormControl component="fieldset" className={classes.formControl}>
    <InputLabel htmlFor={id}>{label}</InputLabel>
    <Select
      value={value}
      onChange={onChange}
      inputProps={{
        name: id,
        id,
      }}
    >
      {(items || []).map(({ id, name }) => (
        <MenuItem key={id} value={id}>
          {name}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

SelectControl = withStyles(styles)(SelectControl);

export default SelectControl;
