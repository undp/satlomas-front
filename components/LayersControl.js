import React from "react";
import PropTypes from "prop-types";
import LayersIcon from "@material-ui/icons/Layers";
import { withTranslation } from "../i18n";
import OpacitySlider from "./OpacitySlider";

import { withStyles } from '@material-ui/core/styles';

import { Fab, Menu, MenuItem, Checkbox, FormControlLabel } from '@material-ui/core';

const styles = theme => ({
  fabContainer: {
    display: "block",
  },
  fab: {
    margin: theme.spacing(1),
  }
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

  handleItemClick = id => {
    // const { onToggle } = this.props;
    // if (onToggle) onToggle(this._findLayer(id), event);
  };

  _findLayer(id) {
    const layer = this.props.layers.find(layer => layer.id === id);
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
          disabled={layers.length === 0}
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
              key={layer.id}
              onClick={this.handleItemClick(layer.id)}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={activeLayers.includes(layer.id)}
                    onChange={this.handleCheckboxChange}
                    value={layer.id}
                  />
                }
                label={layer.name}
              />
              <OpacitySlider
                value={layersOpacity[layer.id] || 100}
                onChange={(e, value) => onOpacityChange(layer.id, value)}
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
LayersControl = withTranslation()(LayersControl);

export default LayersControl;
