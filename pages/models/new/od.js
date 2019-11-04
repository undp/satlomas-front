import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import Head from "next/head";
import React from "react";
import BasicAppbar from "../../../components/BasicAppbar";
import AnnotateStep from "../../../components/models/new/od/AnnotateStep";
import CreateStep from "../../../components/models/new/od/CreateStep";
import InitialStep from "../../../components/models/new/od/InitialStep";
import TrainStep from "../../../components/models/new/od/TrainStep";
import UploadStep from "../../../components/models/new/od/UploadStep";
import SelectStep from "../../../components/models/new/od/SelectStep";
import PredictStep from "../../../components/models/new/od/PredictStep";
import StepperContent from "../../../components/models/new/StepperContent";
// import StepperAppbar from "../../../components/models/new/StepperAppbar";
import { i18n, withNamespaces } from "../../../i18n";
import { buildApiUrl } from "../../../utils/api";
import { withAuthSync } from "../../../utils/auth";
import { routerReplace } from "../../../utils/router";

const styles = theme => ({
  stepperContent: {
    width: "auto",
    display: "block", // Fix IE 11 issue.
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    [theme.breakpoints.up(700 + theme.spacing.unit * 2 * 2)]: {
      width: 700,
      marginLeft: "auto",
      marginRight: "auto"
    }
  }
});

const steps = ["initial", "create", "upload", "annotate", "train", "select", "predict"];

class NewODModel extends React.Component {
  state = {
    step: steps[0]
  };

  static async getInitialProps({ query }) {
    return {
      namespacesRequired: ["models"],
      query: query
    };
  }

  constructor(props) {
    super(props);

    const { step } = props.query;

    // Set current step based on path
    if (step && steps.includes(step)) {
      this.state.step = step;
    }
  }

  componentDidMount() {
    const { token, query } = this.props;

    if (query.id) {
      axios
        .head(buildApiUrl(`/estimators/${query.id}/`), {
          headers: {
            Authorization: token,
            "Accept-Language": i18n.language
          }
        })
        .catch(() => {
          console.log("Invalid estimator id. Redirecting...");
          routerReplace(`/models/new/od`);
        });
    }
  }

  stepContent() {
    const { token, query } = this.props;
    const { step } = this.state;

    switch (step) {
      case "initial": {
        return <InitialStep token={token} />;
      }
      case "create": {
        return <CreateStep token={token} />;
      }
      case "upload": {
        return <UploadStep token={token} estimatorId={query.id} />;
      }
      case "annotate": {
        return <AnnotateStep token={token} estimatorId={query.id} />;
      }
      case "train": {
        return <TrainStep token={token} estimatorId={query.id} />;
      }
      case "select": {
        return <SelectStep token={token} estimatorId={query.id} />;
      }
      case "predict": {
        return <PredictStep token={token} estimatorId={query.id} />
      }
    }
  }

  render() {
    const { t, classes, ...props } = this.props;

    return (
      <React.Fragment>
        <Head>
          <title>{t("new.od.header")}</title>
        </Head>
        <BasicAppbar />
        {/* <StepperAppbar activeStep={this.state.step} steps={steps} /> */}
        {this.stepContent()}
        <div className={classes.stepperContent}>
          <StepperContent
            activeStep={this.state.step}
            steps={steps}
            {...props}
          />
        </div>
      </React.Fragment>
    );
  }
}

NewODModel = withStyles(styles)(NewODModel);
NewODModel = withNamespaces("models")(NewODModel);
NewODModel = withAuthSync(NewODModel);

export default NewODModel;
