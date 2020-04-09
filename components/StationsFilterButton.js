import React from "react";
import { Button, Popover, Tooltip } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { DevicesOtherIcon } from "@material-ui/icons";
import SelectControl from "./SelectControl";

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
          <SelectControl
            id="station"
            label="Estación"
            items={stations}
            value={value}
            onChange={onSelectChange}
          />
        </form>
      </div>
    </Popover>
  </>
);

StationsSelectorButton = withStyles(styles)(StationsSelectorButton);

export default StationsSelectorButton;
