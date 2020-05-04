import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Slider } from "@material-ui/core";

const styles = {
  root: {
    width: 40
  },
};

class OpacitySlider extends React.Component {
  render() {
    const { classes, value, onChange } = this.props;

    return (
      <div className={classes.root}>
        <Slider
          value={value}
          onChange={onChange}
        />
      </div>
    );
  }
}

OpacitySlider.propTypes = {
  classes: PropTypes.object.isRequired,
  value: PropTypes.number,
  onChange: PropTypes.func
};

export default withStyles(styles)(OpacitySlider);
