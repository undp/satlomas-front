import React from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { withTranslation } from "../../i18n";
import cookie from "js-cookie";

import { IconButton, InputAdornment, Typography, TextField, Paper } from '@material-ui/core';

const styles = (theme) => ({
  root: {
    width: "100%",
    overflowX: "auto",
    padding: "20px",
  },
  table: {
    minWidth: 700,
  },
  title: {
    marginBottom: "10px",
  },
  paragraph: {
    marginBottom: "20px",
  },
});

class HomeContent extends React.Component {
  render() {
    const { t, classes } = this.props;
    const projectId = cookie.get("project");

    return (
      <div>
        <Paper className={classes.root}>
          <Typography variant="h5" component="h3" className={classes.title}>
            {t(`home.api_title`)}
          </Typography>
          <Typography component="p" className={classes.paragraph}>
            {t(`home.api_descrip1`)} <a href="/admin/keys">link</a>{" "}
            {t(`home.api_descrip2`)}
          </Typography>
        </Paper>
      </div>
    );
  }
}

HomeContent.propTypes = {
  classes: PropTypes.object.isRequired,
};

HomeContent = withStyles(styles)(HomeContent);
HomeContent = withTranslation("me")(HomeContent);

export default HomeContent;
