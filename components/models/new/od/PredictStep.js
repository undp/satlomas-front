import { LinearProgress } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import React from "react";
import { i18n, Link, withNamespaces } from "../../../../i18n";
import { buildApiUrl } from "../../../../utils/api";
import StepContentContainer from "../StepContentContainer";
import { routerPush } from "../../../../utils/router";

const styles = theme => ({
  header: {
    marginBottom: theme.spacing.unit * 3,
    textAlign: "center"
  },
  progress: {
    flexGrow: 1,
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  }
});

const BorderLinearProgress = withStyles({
  root: {
    height: 10,
    backgroundColor: 'rgb(255, 181, 173)',
  },
  bar: {
    borderRadius: 20,
    backgroundColor: '#ff6c5c',
  },
})(LinearProgress);

class PredictStep extends React.Component {
  state = {
    finished: false,
    percentage : 0,
  };

  async checkFinishedPredictingJob(){
    const { token, estimatorId } = this.props;
    const response = await axios.get(
      buildApiUrl(`/estimators/${estimatorId}/predicted/`),
      {
        headers: {
          Authorization: token,
          "Accept-Language": i18n.language
        }
    });
    if(response.data.detail){
      this.setState({finished: true});
      clearInterval(this.interval);
    }
    else{
      if (this.state.percentage < 100){
        if (!typeof this.offInterval === 'undefined')
          clearInterval(this.offInterval);
        this.setState({percentage: response.data.percentage});
        this.offInterval = setInterval(() => {
          this.setState({percentage: this.state.percentage + 1});;
        }, 1000*60);
      }
    }
  }

  handleClickView(){
    routerPush('/home/layers');
  }

  async componentDidMount() {
    if (this.state.percentage == 0){
      this.checkFinishedPredictingJob();
    }
    this.interval = setInterval(() => this.checkFinishedPredictingJob(), 1000*60*5);
  }

  render() {
    const { classes, t } = this.props;
    const { finished, percentage } = this.state;

    return (
      <StepContentContainer>
        <Typography className={classes.header} component="h1" variant="h5">
          {t("predict_step.title")}
        </Typography>
        <Typography>{t("predict_step.explanation")}</Typography>
        { finished 
          ? 
          <Link>
            <Button color="primary" variant="contained" onClick={this.handleClickView}>
              {t("predict_step.view")}
            </Button>
          </Link>
          :
          <div>
          <div className={classes.progress}>
          { percentage <= 100 ? (
            <BorderLinearProgress
              className={classes.margin}
              variant="determinate"
              color="secondary"
              value={percentage}
            />
            ) : (
              <Typography>{t("predict_step.undefined_explanation")}</Typography>
            ) }
          </div>
          <Link href="/home/models">
            <Button color="primary" fullWidth="true" variant="contained" >
              {t("predict_step.back")}
            </Button>
          </Link>
          </div>
        }
      </StepContentContainer>
    );
  }
}

PredictStep = withStyles(styles)(PredictStep);
PredictStep = withNamespaces("models")(PredictStep);

export default PredictStep;
