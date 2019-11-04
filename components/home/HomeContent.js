import React from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from "@material-ui/core/Typography";
import TextField from '@material-ui/core/TextField';
import Paper from "@material-ui/core/Paper";
import FileCopyIcon from '@material-ui/icons/FileCopy';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import { withNamespaces } from "../../i18n";
import cookie from "js-cookie";

const styles = theme => ({
  root: {
    width: "100%",
    overflowX: "auto",
    padding: "20px",
  },
  table: {
    minWidth: 700
  },
  title: {
    marginBottom: "10px"
  },
  paragraph: {
    marginBottom: "20px"
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
                {t(`home.models_title`)}
            </Typography>
            <Typography component="p" className={classes.paragraph}>
                {t(`home.models_descrip`)} <a href="/models">link</a>.
            </Typography>
            <Typography variant="h5" component="h3" className={classes.title}>
                {t(`home.api_title`)}
            </Typography>
            <Typography component="p" className={classes.paragraph}>
                {t(`home.api_descrip1`)} <a href="/home/keys">link</a> {t(`home.api_descrip2`)}
            </Typography>
            <Typography variant="h5" component="h3" className={classes.title}>
                {t(`home.project_title`)}
            </Typography>
            <Typography component="p" className={classes.paragraph}>
            {t(`home.project_descrip`)} <br/>
                <TextField
                    id="projectId"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    defaultValue={projectId}
                    InputProps={{
                        readOnly: true,
                        endAdornment: (
                            <InputAdornment position="end">
                            <IconButton
                                edge="end"
                            >
                                <CopyToClipboard text={projectId}>
                                    <FileCopyIcon />
                                </CopyToClipboard>
                            </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Typography>
        </Paper>
      </div>
    );
  }
}

HomeContent.propTypes = {
  classes: PropTypes.object.isRequired
};

HomeContent = withStyles(styles)(HomeContent);
HomeContent = withNamespaces("me")(HomeContent);

export default HomeContent;
