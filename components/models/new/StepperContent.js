import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Stepper from "@material-ui/core/Stepper";
import { withStyles } from "@material-ui/core/styles";
import { withNamespaces } from "../../../i18n";
import PropTypes from "prop-types";
import React from "react";

const styles = theme => ({
  stepper: {
    backgroundColor: "none"
  }
});

class StepperContent extends React.Component {
  state = {
    activeStep: 0
  };

  steps = () => {
    return this.props.steps;
  };

  activeStep = step => {
    let steps = this.steps();
    return steps.indexOf(step);
  };

  render() {
    const { t, classes, activeStep } = this.props;

    const steps = this.steps();
    const activeStepName = this.activeStep(activeStep);

    return (
      <React.Fragment>
        <Stepper className={classes.stepper} activeStep={activeStepName}>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{t(`new.od.steps.${label}`)}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </React.Fragment>
    );
  }
}

StepperContent.propTypes = {
  classes: PropTypes.object
};

StepperContent = withStyles(styles)(StepperContent);
StepperContent = withNamespaces("models")(StepperContent);

export default StepperContent;
