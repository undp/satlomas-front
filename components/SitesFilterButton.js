import React from "react";
import { Button, Popover, Tooltip } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import DevicesOtherIcon from "@material-ui/icons/DevicesOther";
import SelectControl from "./SelectControl";

const styles = (theme) => ({
  buttonIcon: {
    marginRight: theme.spacing(1),
  },
  popover: {
    margin: theme.spacing(2),
  },
  form: {
    display: "flex",
    flexWrap: "wrap",
    width: 300,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 290,
  },
});

let SitesFilterButton = ({
  classes,
  sites,
  value,
  popoverOpen,
  onClick,
  anchorEl,
  onSelectChange,
  onPopoverClose,
}) => (
  <>
    <Tooltip
      title="Seleccionar sitio"
      aria-label="Seleccionar sitio"
      enterDelay={500}
    >
      <Button
        aria-owns={popoverOpen ? "simple-popper" : undefined}
        aria-haspopup="true"
        onClick={onClick}
        color="inherit"
      >
        <DevicesOtherIcon className={classes.buttonIcon} />
        Sitio
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
            id="site"
            label="Sitio"
            items={sites}
            value={value}
            onChange={onSelectChange}
          />
        </form>
      </div>
    </Popover>
  </>
);

SitesFilterButton = withStyles(styles)(SitesFilterButton);

export default SitesFilterButton;
