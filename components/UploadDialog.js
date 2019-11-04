import React from 'react';
import PropTypes from 'prop-types';
import UploadImageContent from "./home/UploadImageContent";
import Dialog from '@material-ui/core/Dialog';

import { withNamespaces } from "../i18n";

class UploadDialog extends React.Component{
  
  
  handleCancel = () => {
    this.props.onClose(false);
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



    render() {
        const { open, title, content, t, token, handleComplete } = this.props;
        return (<Dialog
          disableBackdropClick
          disableEscapeKeyDown
          maxWidth="xs"
          aria-labelledby="confirmation-dialog-title"
          open={open}
        >
         
            <UploadImageContent 
              token={token} 
              handleComplete={() => {handleComplete()}}
              handleCancel={() => {this.handleCancel()}} />
            
        </Dialog>
        
    );
    }
    
}

UploadDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

UploadDialog = withNamespaces("common")(UploadDialog);

export default UploadDialog;