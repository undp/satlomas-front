import { LinearProgress } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import React from "react";
import { i18n, Link, withNamespaces } from "../../../../i18n";
import { buildApiUrl } from "../../../../utils/api";
import { routerPush } from "../../../../utils/router";
import StepContentContainer from "../StepContentContainer";

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

class TrainStep extends React.Component {
  state = {
    finished: false,
    percentage : 0,
  };

  async checkFinishedTrainingJob(){
    const { token, estimatorId } = this.props;
    const response = await axios.get(
      buildApiUrl(`/estimators/${estimatorId}/finished/`),
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
          this.setState({percentage: this.state.percentage + 1});
        }, 1000*60);
      }
    }
  }
  
  handleClickContinue(){
    const { estimatorId } = this.props;
    routerPush(`/models/new/od/select?id=${estimatorId}`);
  }

  async componentDidMount() {
    const { token, estimatorId } = this.props;

    await axios.post(
      buildApiUrl(`/estimators/${estimatorId}/train/`),
      {},
      {
        headers: {
          Authorization: token,
          "Accept-Language": i18n.language
        }
      }
    );
    if (this.state.percentage == 0){
      this.checkFinishedTrainingJob();
    }
    this.interval = setInterval(() => this.checkFinishedTrainingJob(), 1000*60*5);
  }

  render() {
    const { classes, t } = this.props;
    const { finished, percentage } = this.state;

    return (
      <StepContentContainer>
        <Typography className={classes.header} component="h1" variant="h5">
          {t("train_step.title")}
        </Typography>
        <Typography>{ 
          finished ? t("train_step.finished_explanation") : t("train_step.explanation")}
        </Typography>
        { finished 
          ? 
          <Link>
            <Button color="primary" variant="contained" onClick={ () => this.handleClickContinue()}>
              {t("train_step.continue")}
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
            <Typography>{t("train_step.undefined_explanation")}</Typography>
          ) }
          </div>
          <Link href="/home/models">
            <Button color="primary" variant="contained" fullWidth='true'>
              {t("train_step.back")}
            </Button>
          </Link>
          </div>
        }
      </StepContentContainer>
    );
  }
}

TrainStep = withStyles(styles)(TrainStep);
TrainStep = withNamespaces("models")(TrainStep);

export default TrainStep;
