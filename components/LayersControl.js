import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {
  Menu,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Fab,
} from "@material-ui/core";
import LayersIcon from "@material-ui/icons/Layers";
import { withNamespaces } from "../i18n";

import OpacitySlider from "./OpacitySlider";

const styles = theme => ({
  fabContainer: {
    display: "block",
  },
  fab: {
    margin: theme.spacing.unit,
  },
});

class LayersControl extends React.Component {
  state = {
    anchorEl: null
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleCheckboxChange = event => {
    const { onToggle } = this.props;
    if (onToggle) onToggle(this._findLayer(event.target.value), event);
  };

  handleItemClick = uuid => {
    // const { onToggle } = this.props;
    // if (onToggle) onToggle(this._findLayer(uuid), event);
  };

  _findLayer(uuid) {
    const layer = this.props.layers.find(layer => layer.uuid === uuid);
    return layer;
  }

  render() {
    const { t, classes, layers, activeLayers, onOpacityChange } = this.props;
    const layersOpacity = this.props.layersOpacity || {};

    const { anchorEl } = this.state;

    return (
      <div className={classes.fabContainer}>
        <Fab
          className={classes.fab}
          aria-label={t("toggle_layers")}
          aria-owns={anchorEl ? "layers-menu" : undefined}
          aria-haspopup="true"
          onClick={this.handleClick}
          color="primary"
          size="small"
        >
          <LayersIcon />
        </Fab>
        <Menu
          id="layers-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          disableAutoFocusItem={true}
        >
          {layers.map(layer => (
            <MenuItem
              key={layer.uuid}
              onClick={this.handleItemClick(layer.uuid)}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={activeLayers.includes(layer.uuid)}
                    onChange={this.handleCheckboxChange}
                    value={layer.uuid}
                  />
                }
                label={layer.name}
              />
              <OpacitySlider
                value={layersOpacity[layer.uuid] || 100}
                onChange={(e, value) => onOpacityChange(layer.uuid, value)}
              />
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  }
}

LayersControl.propTypes = {
  classes: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  layers: PropTypes.array.isRequired,
  activeLayers: PropTypes.array.isRequired,
  layersOpacity: PropTypes.object,
  onToggle: PropTypes.func,
  onOpacityChange: PropTypes.func
};

LayersControl = withStyles(styles)(LayersControl);
LayersControl = withNamespaces()(LayersControl);

export default LayersControl;
