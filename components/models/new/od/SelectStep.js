import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import cookie from "js-cookie";
import React from "react";
import FileGallery from "../../../FileGallery.js";
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
  },
});

class SelectStep extends React.Component {
  state = {
    files: [],
    previousFiles: [],
    filesLoaded: false,
    uploading: false,
    currentProgress: 0,
    totalProgress: 0,
    disabledSubmitBtn: true,
  };

  selectedOrUploadFiles(files){
    if(files.length != 0) return true; 
    else{
      let selected = false
      this.state.previousFiles.map((item, key) =>{
        if(item['selected']){
          selected = true;
        }
      });
      return selected;
    }
  }

  async setPredictingJob(newNameFiles = []){
    const { estimatorId, token } = this.props;
    let selectedFiles = [];
    this.state.previousFiles.map((item, key) =>{
      if(item['selected']){
        selectedFiles.push(item['name']);
      }
    });

    const response = await axios.post(
      buildApiUrl(`/estimators/${estimatorId}/predict/`),
      { files: selectedFiles.concat(newNameFiles), },
      {
        headers: {
          Authorization: token,
          "Accept-Language": i18n.language
        }
      }
    );
    console.log(response);
    routerPush(`/models/new/od/predict?id=${estimatorId}`);
  }

  handleSubmit = async () => {
    const project = cookie.get("project");
    const { token } = this.props;
    const { files } = this.state;
    let newNameFiles = [];

    if (!this.selectedOrUploadFiles(files)) return;

    this.setState({ uploading: true, currentProgress: 0, totalProgress: 0 });

    let count = 0;
    if (files.length > 0){
      for (const file of files) {
        try {
          await axios.post(
            buildApiUrl(`/files/upload/${file.name}?project_uuid=${project}`),
            file,
            {
              headers: {
                Authorization: token,
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
          ).then(res => {
            newNameFiles.push(res.data.detail['name']);
          });
        } catch (err) {
          console.error(err);
          this.setState({ uploading: false });
          return;
        }

        count += 1;
        this.setState({ totalProgress: (count / files.length) * 100 });
        if (count === files.length) {
          this.setPredictingJob(newNameFiles);
        }
        if (!this.state.uploading) return;
      } 
    }
    else{
      this.setPredictingJob();
    }
  };

  handleDropzoneChange = files => {
    this.setState({ 
      files: files,
      disabledSubmitBtn: !this.selectedOrUploadFiles(files)
    });
  };

  handleFileClick = file => {
    this.state.previousFiles.map((item, key) =>{
        if(item['name'] == file){
          item['selected'] = !item['selected'];
        }
    });
    this.setState(
      this.state
    );
    this.setState({
      disabledSubmitBtn: !this.selectedOrUploadFiles(this.state.files)
    });
  };

  async checkPendingJob(){
    const { token, estimatorId } = this.props;
    const response = await axios.get(
      buildApiUrl(`/estimators/${estimatorId}/predicted/`),
      {
        headers: {
          Authorization: token,
          "Accept-Language": i18n.language
        }
    });
    /* detail will be true is doesn't exist any predictionjob with finished = False */
    let detail = response.data.detail;
    if (!detail){
      routerPush(`/models/new/od/predict?id=${estimatorId}`);
    }
  }

  async componentDidMount(){
    const project = cookie.get("project");
    const { token } = this.props;

    this.checkPendingJob();

    const response = await axios.get(
      buildApiUrl(`/files/?project_uuid=${project}`),
      {
          headers: {
          Authorization: token,
          "Accept-Language": i18n.language
          }
      }
    );
    let files = response.data.results;
    for(let i=0; i<files.length; i++){
      this.state.previousFiles.push({
          src: files[i]['file'],
          width: 2,
          height: 2,
          name: files[i]['name'],
          selected: false,
      });
      this.setState(
        this.state
      );
    }
    this.setState({
      filesLoaded:true,
      disabledSubmitBtn: !this.selectedOrUploadFiles(this.state.files)
    });
  }

  render() {
    const { classes, t } = this.props;
    const { previousFiles, filesLoaded, uploading, 
            currentProgress, totalProgress, disabledSubmitBtn } = this.state;

    return (
      <StepContentContainer>
        <Typography className={classes.header} component="h1" variant="h5">
          {t("select_step.title")}
        </Typography>
        <Typography variant="body2">
          {t("select_step.explanation")}
        </Typography>
        <DropzoneArea
          dropzoneText={t("select_step.dropzone")}
          filesLimit={10}
          showPreviews={false}
          maxFileSize={2000000000} /* 2gb */
          onChange={this.handleDropzoneChange}
          showFileNamesInPreview={true}
        /> 
        <FileGallery 
          loaded={filesLoaded}
          onFileClick={this.handleFileClick}
          files={previousFiles}
        />
        <Button
          color="primary"
          variant="contained"
          onClick={this.handleSubmit}
          disabled={disabledSubmitBtn}
        >
          {t("select_step.submit_btn")}
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

SelectStep = withStyles(styles)(SelectStep);
SelectStep = withNamespaces("models")(SelectStep);

export default SelectStep;
