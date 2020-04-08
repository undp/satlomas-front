import React from "react";
import { withStyles } from "@material-ui/core/styles";

import DevicesOtherIcon from "@material-ui/icons/DevicesOther";
import Button from "@material-ui/core/Button";
import Popover from "@material-ui/core/Popover";
import Tooltip from "@material-ui/core/Tooltip";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

const styles = (theme) => ({
  buttonIcon: {
    marginRight: theme.spacing.unit,
  },
  popover: {
    margin: theme.spacing.unit * 2,
  },
  form: {
    display: "flex",
    flexWrap: "wrap",
    width: 300,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 290,
  },
});

let StationsSelectorButton = ({
  classes,
  stations,
  value,
  popoverOpen,
  onClick,
  anchorEl,
  onSelectChange,
  onPopoverClose,
}) => (
  <>
    <Tooltip
      title="Seleccionar estación"
      aria-label="Seleccionar estación"
      enterDelay={500}
    >
      <Button
        aria-owns={popoverOpen ? "simple-popper" : undefined}
        aria-haspopup="true"
        onClick={onClick}
        color="inherit"
      >
        <DevicesOtherIcon className={classes.buttonIcon} />
        Estación
      </Button>
    </Tooltip>
    <Popover
      open={popoverOpen}
      anchorEl={anchorEl}
      onClose={onPopoverClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      <div className={classes.popover}>
        <form className={classes.form} autoComplete="off">
          <FormControl component="fieldset" className={classes.formControl}>
            <InputLabel htmlFor="station">Estación</InputLabel>
            <Select
              value={value}
              onChange={onSelectChange}
              inputProps={{
                name: "station",
                id: "station",
              }}
            >
              {(stations || []).map((station) => (
                <MenuItem key={station.id} value={station.id}>
                  {station.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </form>
      </div>
    </Popover>
  </>
);

StationsSelectorButton = withStyles(styles)(StationsSelectorButton);

export default StationsSelectorButton;
