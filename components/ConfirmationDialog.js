import React from 'react';
import PropTypes from 'prop-types';


import { withNamespaces } from "../i18n";

import { Button, DialogTitle, DialogContent, DialogActions, Dialog, Typography } from '@material-ui/core';

class ConfirmationDialog extends React.Component{
    
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
            <Button onClick={this.handleOk} color="primary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
        
    );
    }
    
}

ConfirmationDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

ConfirmationDialog = withNamespaces("common")(ConfirmationDialog);

export default ConfirmationDialog;