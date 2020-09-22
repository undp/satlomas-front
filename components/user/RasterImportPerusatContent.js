import axios from "axios";
import PropTypes from "prop-types";
import React from "react";
import { i18n, Link, withTranslation } from "../../i18n";
import { buildApiUrl } from "../../utils/api";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { withSnackbar } from "notistack";
import InputControl from "./forms/InputControl";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Checkbox,
  IconButton,
  CommentIcon,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function CheckboxList() {
  const classes = useStyles();
  const [checked, setChecked] = React.useState([0]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <List className={classes.root}>
      {[0, 1, 2, 3].map((value) => {
        const labelId = `checkbox-list-label-${value}`;

        return (
          <ListItem
            key={value}
            role={undefined}
            dense
            button
            onClick={handleToggle(value)}
          >
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={checked.indexOf(value) !== -1}
                tabIndex={-1}
                disableRipple
                inputProps={{ "aria-labelledby": labelId }}
              />
            </ListItemIcon>
            <ListItemText id={labelId} primary={`Line item ${value + 1}`} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="comments">
                <CommentIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
  );
}

import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Input,
  InputLabel,
  LinearProgress,
  Typography,
} from "@material-ui/core";

const styles = (theme) => ({
  main: {
    display: "block", // Fix IE 11 issue.
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "50%", // Fix IE 11 issue.
    marginTop: theme.spacing(2),
  },
  submit: {
    marginTop: theme.spacing(3),
    width: "20%",
  },
  passwordSubmit: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
    width: "40%",
  },
  passwordReset: {
    marginTop: theme.spacing(2),
  },
});

class RasterImportPerusatContent extends React.Component {
  state = {
    sftpUsername: "",
    sftpPassword: "",
    sftpHost: "",
    sftpPort: "",
    sftpPath: "",
    isSubmitting: false,
  };

  static async getInitialProps({ query }) {
    return {
      namespacesRequired: ["common"],
      query,
    };
  }

  // async fetchUserProfile() {
  //   const token = cookie.get("token");
  //   try {
  //     var response = await axios.get(buildApiUrl("/auth/user/"), {
  //       headers: {
  //         "Accept-Language": i18n.language,
  //         Authorization: token,
  //       },
  //     });
  //     console.log("/auth/user/", response.data);

  //     var profileResponse = await axios.get(
  //       buildApiUrl(`/alerts/user-profiles/${response.data.username}`),
  //       {
  //         headers: {
  //           "Accept-Language": i18n.language,
  //           Authorization: token,
  //         },
  //       }
  //     );
  //     console.log("/alerts/user-profile/", profileResponse.data);

  //     this.setState({
  //       email: response.data.email,
  //       username: response.data.username,
  //       emailAlerts: profileResponse.data.email_alerts,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     this.props.enqueueSnackbar(
  //       "Error al cargar los datos de perfil de usuario",
  //       {
  //         variant: "error",
  //       }
  //     );
  //   }
  // }

  componentDidMount() {
    // this.fetchUserProfile();
  }

  onInputChange = (e) => {
    console.log(e.target.name);
    this.setState({ [e.target.name]: e.target.value });
  };

  // onEmailAlertsClick = (e) => {
  //   this.setState({ emailAlerts: !this.state.emailAlerts });
  // };

  // onChangePasswordClick = () => {
  //   routerPush("/password/reset");
  // };

  // onSubmit = () => {
  //   const token = cookie.get("token");
  //   try {
  //     var response = axios.patch(
  //       buildApiUrl(`/alerts/user-profiles/${this.state.username}/`),
  //       { email_alerts: this.state.emailAlerts },
  //       {
  //         headers: {
  //           "Accept-Language": i18n.language,
  //           Authorization: token,
  //         },
  //       }
  //     );
  //     response = axios.patch(
  //       buildApiUrl(`/alerts/users/${this.state.username}/`),
  //       { email: this.state.email },
  //       {
  //         headers: {
  //           "Accept-Language": i18n.language,
  //           Authorization: token,
  //         },
  //       }
  //     );
  //     this.props.enqueueSnackbar("Perfil guardado", { variant: "success" });
  //   } catch (error) {
  //     this.props.enqueueSnackbar("Error al guardar perfil", {
  //       variant: "error",
  //     });
  //     console.error(error);
  //   }
  // };

  render() {
    const { classes } = this.props;
    const {
      isSubmitting,
      sftpHost,
      sftpPort,
      sftpUsername,
      sftpPassword,
      sftpPath,
    } = this.state;

    return (
      <main className={classes.main}>
        <Typography component="h1" variant="h5">
          Importar escenas de PeruSat-1
        </Typography>
        <Typography style={{ color: "red" }}>{this.state.errorMsg}</Typography>
        <form className={classes.form} autoComplete="on">
          <InputControl
            id="sftpHost"
            label="SFTP Host"
            value={sftpHost}
            placeholder="example.com"
            onChange={this.onInputChange}
          />
          <InputControl
            id="sftpPort"
            label="SFTP Port"
            value={sftpPort}
            placeholder="22"
            onChange={this.onInputChange}
          />
          <InputControl
            id="sftpUsername"
            label="SFTP Username"
            value={sftpUsername}
            onChange={this.onInputChange}
          />
          <InputControl
            id="sftpPassword"
            label="SFTP Password"
            value={sftpPassword}
            type="password"
            onChange={this.onInputChange}
          />
          <InputControl
            id="sftpPath"
            label="SFTP Path"
            value={sftpPath}
            onChange={this.onInputChange}
          />

          {/* <FormControl margin="normal" required fullWidth>
            <FormControlLabel
              control={
                <Checkbox
                  value="emailAlerts"
                  color="primary"
                  checked={emailAlerts}
                  onClick={this.onEmailAlertsClick}
                />
              }
              label={"Enviar notificaciones de alertas por email."}
            />
          </FormControl> */}

          <Button
            fullWidth
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            className={classes.submit}
            onClick={this.onSubmit}
          >
            Importar
          </Button>

          {isSubmitting && <LinearProgress />}
        </form>
      </main>
    );
  }
}

RasterImportPerusatContent.propTypes = {
  classes: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
};

RasterImportPerusatContent = withStyles(styles)(RasterImportPerusatContent);
RasterImportPerusatContent = withTranslation()(RasterImportPerusatContent);
RasterImportPerusatContent = withSnackbar(RasterImportPerusatContent);

export default RasterImportPerusatContent;
