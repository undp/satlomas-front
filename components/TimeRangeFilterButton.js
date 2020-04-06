import React from "react";
import { withStyles } from "@material-ui/core/styles";

import AccessTimeIcon from "@material-ui/icons/AccessTime";
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

let TimeRangeSelectorButton = ({
  classes,
  popoverOpen,
  onClick,
  anchorEl,
  onPopoverClose,
}) => (
  <>
    <Tooltip
      title="Configurar filtro de tiempo"
      aria-label="Configurar filtro de tiempo"
      enterDelay={500}
    >
      <Button
        aria-owns={popoverOpen ? "simple-popper" : undefined}
        aria-haspopup="true"
        onClick={onClick}
        color="inherit"
      >
        <AccessTimeIcon className={classes.buttonIcon} />
        Tiempo real - última hora
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
        <Typography>Time range popover here...</Typography>
      </div>
    </Popover>
  </>
);

TimeRangeSelectorButton = withStyles(styles)(TimeRangeSelectorButton);

export default TimeRangeSelectorButton;
