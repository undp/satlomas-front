import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import cookie from "js-cookie";
import React from "react";
import { i18n, withNamespaces } from "../../../../i18n";
import { buildApiUrl } from "../../../../utils/api";
import { routerPush } from "../../../../utils/router";
import DropzoneArea from "../../../upload/DropzoneArea";
import StepContentContainer from "../StepContentContainer";

const styles = theme => ({
  header: {
    marginBottom: theme.spacing.unit * 3,
    textAlign: "center"
  },
  classesLabel: {
    paddingBottom: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  },
  errorMsg: {
    color: "red"
  }
});

class UploadStep extends React.Component {
  state = {
    files: [],
    uploading: false,
    currentProgress: 0,
    totalProgress: 0
  };

  handleSubmit = async () => {
    const project = cookie.get("project");
    const { estimatorId } = this.props;
    const { files } = this.state;

    if (files.length == 0) return;

    this.setState({ uploading: true, currentProgress: 0, totalProgress: 0 });

    let count = 0;
    for (const file of files) {
      try {
        await axios.post(
          buildApiUrl(`/files/upload/${file.name}?project_uuid=${project}`),
          file,
          {
            headers: {
              Authorization: this.props.token,
              "Accept-Language": i18n.language
            },
            onUploadProgress: progressEvent => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              this.setState({ currentProgress: percentCompleted });
              console.log(percentCompleted);
            }
          }
        );
      } catch (err) {
        console.error(err);
        this.setState({ uploading: false });
        return;
      }

      count += 1;
      this.setState({ totalProgress: (count / files.length) * 100 });
      if (count === files.length) {
        this._setFilesOnEstimator(files, estimatorId);
      }
      if (!this.state.uploading) return;
    }
  };

  _setFilesOnEstimator = (files, estimatorId) => {
    console.log(`Associate ${files} to estimator ${estimatorId}`);

    axios
      .get(buildApiUrl(`/estimators/${estimatorId}/`), {
        headers: {
          Authorization: this.props.token,
          "Accept-Language": i18n.language
        }
      })
      .then(res => {
        const { project, name, classes, image_files } = res.data;
        const newFiles = files.map(file => file.name);
        const uniqueImageFiles = [...new Set(image_files.concat(newFiles))];

        const dataSend = {
          project: project,
          name: name,
          classes: classes,
          image_files: uniqueImageFiles
        };

        axios
          .put(buildApiUrl(`/estimators/${estimatorId}/`), dataSend, {
            headers: {
              Authorization: this.props.token,
              "Accept-Language": i18n.language
            }
          })
          .then(() => {
            this.setState({ uploading: false });
            routerPush(`/models/new/od/annotate?id=${estimatorId}`);
          })
          .catch(error => {
            console.error(error);
            this.setState({
              //errorMsg: t("upload_step.error_msg", { message: error }),
              errorMsg: JSON.stringify(
                error.response && error.response.data.detail
              ),
              uploading: false
            });
          });
      });
  };

  handleDropzoneChange = files => {
    this.setState({ files: files });
  };

  render() {
    const { classes, t } = this.props;
    const { uploading, currentProgress, totalProgress } = this.state;

    return (
      <StepContentContainer>
        <Typography className={classes.header} component="h1" variant="h5">
          {t("upload_step.title")}
        </Typography>
        <Typography variant="body2">{t("upload_step.explanation")}</Typography>
        <DropzoneArea
          dropzoneText={t("upload_step.dropzone")}
          filesLimit={10}
          showPreviews={false}
          maxFileSize={2000000000} /* 2gb */
          onChange={this.handleDropzoneChange}
          showFileNamesInPreview={true}
        />
        <Button
          color="primary"
          variant="contained"
          onClick={this.handleSubmit}
          disabled={uploading}
        >
          {t("upload_step.submit_btn")}
        </Button>
        {uploading && (
          <div>
            <LinearProgress variant="determinate" value={currentProgress} />
            <LinearProgress variant="determinate" value={totalProgress} />
          </div>
        )}
      </StepContentContainer>
    );
  }
}

UploadStep = withStyles(styles)(UploadStep);
UploadStep = withNamespaces("models")(UploadStep);

export default UploadStep;
