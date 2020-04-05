import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import PropTypes from "prop-types";
import React from "react";
import { withNamespaces } from "../../i18n";
import { buildApiUrl } from "../../utils/api";

class ContactFormModalContent extends React.Component {
  state = {
    message: "",
    errorMsg: "",
    successMsg: "",
    submitting: false
  };

  handleMessageChange = event => {
    this.setState({ message: event.target.value });
  };

  handleEnter = () => {
    this.setState({
      errorMsg: "",
      successMsg: "",
      submitting: false
    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleSubmit = async () => {
    const { t, token, onClose } = this.props;
    const { message } = this.state;

    const errorMsg = t("new.consult.error_msg", {
      contactLink: "contact@dymaxionlabs.com"
    });

    this.setState({
      errorMsg: "",
      successMsg: "",
      submitting: true
    });

    if (message === "") {
      this.setState({
        errorMsg: errorMsg,
        successMsg: "",
        submitting: false
      });
      return;
    }

    try {
      const response = await axios.get(buildApiUrl("/auth/user/"), {
        headers: { Authorization: token }
      });
      const userData = response.data;

      await axios.post(buildApiUrl("/contact/"), {
        email: userData.email,
        username: userData.username,
        message: `Mensaje desde /models/new: ${message}`
      });

      this.setState({
        successMsg: t("new.consult.success_msg"),
        message: ""
      });

      setTimeout(() => {
        this.setState({
          successMsg: "",
          errorMsg: ""
        });
        if (onClose) onClose();
      }, 3000);
    } catch (error) {
      const response = error.response;
      console.error(response);
      this.setState({
        errorMsg: errorMsg,
        submitting: false,
        successMsg: ""
      });
    }
  };

  render() {
    const { t, open, onClose } = this.props;
    const { submitting } = this.state;

    return (
      <Dialog
        onEnter={this.handleEnter}
        onClose={onClose}
        open={open}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle>{t("new.consult.title")}</DialogTitle>
        <DialogContent>
          <Typography style={{ color: "red" }} variant="body1">
            {this.state.errorMsg}
          </Typography>
          <Typography style={{ color: "green" }} variant="body1">
            {this.state.successMsg}
          </Typography>
          <Typography variant="body1">
            {t("new.consult.explanation")}
          </Typography>
          <TextField
            label={t("new.consult.message_label")}
            multiline
            rows="4"
            autoFocus
            fullWidth
            margin="dense"
            onChange={this.handleMessageChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            {t("new.consult.cancel_btn")}
          </Button>
          <Button
            onClick={this.handleSubmit}
            color="primary"
            disabled={submitting}
          >
            {t("new.consult.send_btn")}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

ContactFormModalContent = withNamespaces("models")(ContactFormModalContent);

export default ContactFormModalContent;
