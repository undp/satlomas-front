import React from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";

import BlockIcon from "@material-ui/icons/Block";
import CloseIcon from "@material-ui/icons/Close";

import NewKeyDialogForm from "../NewKeyDialog";
import ConfirmationDialog from "../ConfirmationDialog";
import { i18n, withNamespaces } from "../../i18n";
import axios from "axios";
import { buildApiUrl } from "../../utils/api";

import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Snackbar,
  Tooltip,
} from '@material-ui/core';

const styles = theme => ({
  root: {
    width: "100%",
    overflowX: "auto"
  },
  table: {
    minWidth: 700
  },
  title: {
    marginBottom: theme.spacing.units * 10
  },
  btnRight: {
      float: "right",
  }
});

class NotImplementedSnackbar extends React.Component {
  render() {
    const { classes, open, onClose } = this.props;

    return (
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        open={open}
        autoHideDuration={2000}
        onClose={onClose}
        ContentProps={{
          "aria-describedby": "message-id"
        }}
        message={<span id="message-id">Disponible pronto</span>}
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            className={classes.close}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        ]}
      />
    );
  }
}

NotImplementedSnackbar = withStyles(styles)(NotImplementedSnackbar);

class KeysContent extends React.Component {
  state = {
    keys : [],
    openConfirmationDialog : false,
    keyToRevoke : null
  };

  componentDidMount(){
    this.getApiKeys();
  }

  getApiKeys = async () => {
    await axios.get(
        buildApiUrl(`/api_keys/`), { headers: { Authorization: this.props.token } }
    ).then(response => {
        this.setState({keys:response.data});
    });
  }

  revoke = async (id) => {
    this.setState({
      keyToRevoke: id,
      openConfirmationDialog: true,
    });
  }

  onDialogResult = async (action) => {
    if (action) {
      const prefix = this.state.keyToRevoke.split(".")[0]
      await axios.patch(
        buildApiUrl(`/api_keys/${prefix}`), 
        { "prefix": prefix, revoked : true },
        { headers: { Authorization: this.props.token } }
      ).then(() => {
          this.getApiKeys();
      });
    }
    this.setState({
      keyToRevoke: null,
      openConfirmationDialog: false,
    })
  }

  render() {
    const { t, classes, token } = this.props;
    const { keys, openConfirmationDialog } = this.state;

    return (
      <div>
        <Typography
          className={classes.title}
          variant="h4"
          gutterBottom
          component="h2"
        >
            <NewKeyDialogForm token={token} created={this.getApiKeys}></NewKeyDialogForm>
            {t("keys.title")}
        </Typography>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>{t("keys.name")}</TableCell>
                <TableCell>{t("keys.prefix")}</TableCell>
                <TableCell>{t("keys.state")}</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
            {keys.map((key, i) => (
                <TableRow key={i}>
                  <TableCell component="th" scope="row">
                    {key.name}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {key.prefix}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    { ! key.revoked && t("keys.active")}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title={t('keys.revoke')}>
                      <IconButton 
                        onClick={() => {this.revoke(key.id)}}
                        className={classes.button}
                        aria-label={t("keys.revoke")}
                      >
                        <BlockIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
        <ConfirmationDialog 
          onClose={this.onDialogResult} 
          open={openConfirmationDialog}
          title={t("keys.confirmTitle")}
          content={t("keys.confirmContent")}
        />

      </div>
    );
  }
}

KeysContent.propTypes = {
  classes: PropTypes.object.isRequired
};

KeysContent = withStyles(styles)(KeysContent);
KeysContent = withNamespaces("me")(KeysContent);

export default KeysContent;
