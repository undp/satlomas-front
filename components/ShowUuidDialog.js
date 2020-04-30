import React from 'react';
import PropTypes from 'prop-types';

import {CopyToClipboard} from 'react-copy-to-clipboard';

import { withTranslation } from "../i18n";
import { Typography, Button, DialogTitle, DialogContent, DialogActions, Dialog } from '@material-ui/core';

class ShowUuidDialog extends React.Component{
    
    handleCancel = () => {
        this.props.onClose(false);
    };

    handleOk = () => {
        this.props.onClose(true);
    };

    render() {
        const { open, title, content, t } = this.props;
        return (<Dialog
          disableBackdropClick
          disableEscapeKeyDown
          maxWidth="xs"
          aria-labelledby="confirmation-dialog-title"
          open={open}
        >
          <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
          <DialogContent dividers><Typography variant="body1">{content}</Typography></DialogContent>
          <DialogActions>
            <Button onClick={this.handleCancel} color="primary">
              {t("confirmation.cancel")}
            </Button>
            <CopyToClipboard text={content}>
              <Button color="primary" onClick={this.handleOk}>
                {t(`confirmation.copy`)}
              </Button>
            </CopyToClipboard>
          </DialogActions>
        </Dialog>
        
    );
    }
    
}

ShowUuidDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

ShowUuidDialog = withTranslation("common")(ShowUuidDialog);

export default ShowUuidDialog;
