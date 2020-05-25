import axios from "axios";
import PropTypes from "prop-types";
import React from "react";
import { i18n, Link, withTranslation } from "../../i18n";
import { buildApiUrl } from "../../utils/api";
import { withStyles } from '@material-ui/core/styles';
import cookie from "js-cookie";
import { routerPush } from "../../utils/router";
import { withSnackbar } from 'notistack';

import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Input,
  InputLabel,
  LinearProgress,
  Typography,
} from '@material-ui/core';

const styles = theme => ({
  main: {

    display: "block", // Fix IE 11 issue.
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),

  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "50%", // Fix IE 11 issue.
    marginTop: theme.spacing(2),

  },
  submit: {
    marginTop: theme.spacing(3),
    width: "20%"

  },
  passwordSubmit: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
    width: "40%"
  },
  passwordReset: {
    marginTop: theme.spacing(2)
  }
});

class UserProfileContent extends React.Component {
  state = {
    username: "",
    email: "",
    emailAlerts: false,
    isSubmitting: false
  };

  static async getInitialProps({ query }) {
    return {
      namespacesRequired: ["common"],
      query
    };
  }

  constructor(props) {
    super(props);
  }

  async fetchUserProfile() {
    const token = cookie.get("token");
    try {
      var response = await axios.get(buildApiUrl("/auth/user/"), {
        headers: {
          "Accept-Language": i18n.language,
          Authorization: token,
        },
      });
      console.log("/auth/user/", response.data);

      var profileResponse = await axios.get(buildApiUrl(`/alerts/user-profiles/${response.data.username}`), {
        headers: {
          "Accept-Language": i18n.language,
          Authorization: token,
        }
      });
      console.log("/alerts/user-profile/", profileResponse.data);

      this.setState({
        email: response.data.email,
        username: response.data.username,
        emailAlerts: profileResponse.data.email_alerts
      });
    } catch (error) {
      console.error(error);
      this.props.enqueueSnackbar("Error al cargar los datos de perfil de usuario", {
        variant: 'error'
      });
    }
  }

  componentDidMount() {
    this.fetchUserProfile();
  }

  onEmailAlertsClick = e => {
    this.setState({ emailAlerts: !this.state.emailAlerts });
  };

  onEmailChange = e => {
    this.setState({ email: e.target.value });
  };

  onChangePasswordClick = () => {
    routerPush("/password/reset");
  }

  onSubmit = () => {
    const token = cookie.get("token");
    try {
      var response = axios.patch(
        buildApiUrl(`/alerts/user-profiles/${this.state.username}/`),
        { email_alerts: this.state.emailAlerts },
        {
          headers: {
            "Accept-Language": i18n.language,
            Authorization: token,
          }
        }
      );
      response = axios.patch(
        buildApiUrl(`/alerts/users/${this.state.username}/`),
        { email: this.state.email },
        {
          headers: {
            "Accept-Language": i18n.language,
            Authorization: token,
          }
        }
      );
      this.props.enqueueSnackbar("Perfil guardado", { variant: 'success' });
    } catch (error) {
      this.props.enqueueSnackbar("Error al guardar perfil", { variant: 'error' });
      console.error(error);
    }
  };

  render() {
    const { classes } = this.props;
    const { isSubmitting, email, emailAlerts } = this.state;

    return (
      <main className={classes.main}>

        <Typography component="h1" variant="h5">
          {"Perfil"}
        </Typography>
        <Typography style={{ color: "red" }}>
          {this.state.errorMsg}
        </Typography>
        <form className={classes.form}>
          <FormControl margin="normal" fullWidth className={classes.input}>
            <InputLabel htmlFor="email">{"email"}</InputLabel>
            <Input
              id="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={this.onEmailChange}
            />
          </FormControl>

          <FormControl margin="normal" required fullWidth>
            <FormControlLabel
              control={<Checkbox value="emailAlerts" color="primary"
                checked={emailAlerts}
                onClick={this.onEmailAlertsClick} />}
              label={"Enviar notificaciones de alertas por email."}
            />
          </FormControl>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            className={classes.submit}
            onClick={this.onSubmit}
          >
            {"Guardar"}
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.passwordSubmit}
            onClick={this.onChangePasswordClick}
          >
            {"Reestablecer contraseña"}
          </Button>
          {isSubmitting && <LinearProgress />}
        </form>
      </main>
    );
  }
}

UserProfileContent.propTypes = {
  classes: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

UserProfileContent = withStyles(styles)(UserProfileContent);
UserProfileContent = withTranslation()(UserProfileContent);
UserProfileContent = withSnackbar(UserProfileContent);

export default UserProfileContent;
