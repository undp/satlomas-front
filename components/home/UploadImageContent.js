import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import cookie from "js-cookie";
import React from "react";
import { i18n, withNamespaces } from "../../i18n";
import { buildApiUrl } from "../../utils/api";
import DropzoneArea from "../upload/DropzoneArea";
import DialogContent from '@material-ui/core/DialogContent';
import { DialogActions } from "@material-ui/core";



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
  },


});

class UploadImagenContent extends React.Component {
  state = {
    files: [],
    uploading: false,
    currentProgress: 0,
    totalProgress: 0
  };

  handleSubmit = async () => {
    const project = cookie.get("project");
    const { files } = this.state;
    const { handleComplete } = this.props;

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
        this.setState({ uploading: false });
        handleComplete();
      }
      if (!this.state.uploading) return;
    }
  };

  handleDropzoneChange = files => {
    this.setState({ files: files });
  };

  render() {
    const { classes, t, onClose } = this.props;
    const { uploading, currentProgress, totalProgress } = this.state;

    return (
      <div>
       <DialogContent>
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
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={this.handleSubmit}
            disabled={uploading}
          >
            {t("upload_step.submit_btn")}
          </Button>
          <Button
            color="primary"
            onClick={this.props.handleCancel}
            disabled={uploading}
          >
            Cancel
          </Button>        
        </DialogActions>
        {uploading && (
          <div>
            <LinearProgress variant="determinate" value={currentProgress} />
            <LinearProgress variant="determinate" value={totalProgress} />
          </div>
        )}
        </div>
    );
  }
}

UploadImagenContent = withStyles(styles)(UploadImagenContent);
UploadImagenContent = withNamespaces("models")(UploadImagenContent);

export default UploadImagenContent;
