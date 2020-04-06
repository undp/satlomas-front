import React from "react";
import { withStyles } from "@material-ui/core/styles";

import DevicesOtherIcon from "@material-ui/icons/DevicesOther";
import Button from "@material-ui/core/Button";
import Popover from "@material-ui/core/Popover";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";

const styles = (theme) => ({
  buttonIcon: {
    marginRight: theme.spacing.unit,
  },
  popover: {
    margin: theme.spacing.unit * 2,
  },
});

let StationsSelectorButton = ({
  classes,
  popoverOpen,
  onClick,
  anchorEl,
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
        <Typography>Station select popover</Typography>
      </div>
    </Popover>
  </>
);

StationsSelectorButton = withStyles(styles)(StationsSelectorButton);

export default StationsSelectorButton;
