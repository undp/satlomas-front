import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import axios from "axios";
import Head from "next/head";
import PropTypes from "prop-types";
import React from "react";
import { i18n, Link, withTranslation } from "../i18n";
import { buildApiUrl } from "../utils/api";
import { login } from "../utils/auth";
import { withStyles } from '@material-ui/core/styles';

import {
  Avatar,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Input,
  InputLabel,
  LinearProgress,
  Paper,
  Typography,
} from '@material-ui/core';

const styles = theme => ({
  main: {
    width: "auto",
    display: "block", // Fix IE 11 issue.
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(400 + theme.spacing(3) * 2)]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    marginTop: theme.spacing(3)
  },
  passwordReset: {
    marginTop: theme.spacing(2)
  }
});

class Login extends React.Component {
  state = {
    username: "",
    password: "",
    remember: false,
    isSubmitting: false
  };

  static async getInitialProps({ query }) {
    return {
      namespacesRequired: ["common"],
      query
    };
  }

  onUsernameChange = e => {
    this.setState({ username: e.target.value });
  };

  onPasswordChange = e => {
    this.setState({ password: e.target.value });
  };

  onRememberClick = e => {
    this.setState({ remember: !this.state.remember });
  };

  onSubmit = async event => {
    event.preventDefault();

    const { t } = this.props;
    const { username, password } = this.state;

    const dataSend = {
      username: username,
      password: password
    };

    // Reset messages
    this.setState({
      errorMsg: "",
      successMsg: "",
      isSubmitting: true
    });

    try {
      const response = await axios.post(buildApiUrl("/auth/login/"), dataSend);
      const token = response.data.key;

      const expires = this.state.remember ? 30 : null;
      if (token) {
        const { redirect } = this.props.query;
        login({ token, expires, redirectTo: redirect });
      }
    } catch (error) {
      console.error(error);

      this.setState({
        errorMsg: t("login.error_msg"),
        isSubmitting: false,
        successMsg: ""
      });
    }
  };

  render() {
    const { t, classes } = this.props;
    const { redirect, email } = this.props.query;
    const { isSubmitting } = this.state;

    return (
      <main className={classes.main}>
        <Head>
          <title>{t("title")}</title>
        </Head>
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {t("login.title")}
          </Typography>
          <Typography style={{ color: "red" }}>
            {this.state.errorMsg}
          </Typography>
          <form className={classes.form} method="post" onSubmit={this.onSubmit}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="username">{t("username")}</InputLabel>
              <Input
                id="username"
                name="username"
                autoComplete="username"
                autoFocus
                onInput={this.onUsernameChange}
                onChange={this.onUsernameChange}
                value={this.state.username}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">{t("password")}</InputLabel>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="password"
                onInput={this.onPasswordChange}
                onChange={this.onPasswordChange}
                value={this.state.password}
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label={t("login.remember")}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              className={classes.submit}
            >
              {t("login.submit")}
            </Button>
            {isSubmitting && <LinearProgress />}
          </form>
          <Typography className={classes.passwordReset}>
            {t("login.cant_remember")}{" "}
            <Link href="/password/reset">
              <a>{t("login.request_new_password")}</a>
            </Link>
          </Typography>
        </Paper>
      </main>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

Login = withStyles(styles)(Login);
Login = withTranslation()(Login);

export default Login;
