import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import { withNamespaces } from "../i18n";
import { Typography } from '@material-ui/core';

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

ShowUuidDialog = withNamespaces("common")(ShowUuidDialog);

export default ShowUuidDialog;