import axios from "axios";
import PropTypes from "prop-types";
import React from "react";
import { i18n, withTranslation } from "../../i18n";
import { buildApiUrl } from "../../utils/api";
import { withStyles } from "@material-ui/core/styles";
import { withSnackbar } from "notistack";
import InputControl from "./forms/InputControl";
import FileListTable from "./FileListTable";
import cookie from "js-cookie";
import {
  Button,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Backdrop,
} from "@material-ui/core";

const defaultHostname = process.env.NEXT_PUBLIC_DEFAULT_SFTP_HOSTNAME;
const defaultPort = process.env.NEXT_PUBLIC_DEFAULT_SFTP_PORT;
const defaultUsername = process.env.NEXT_PUBLIC_DEFAULT_SFTP_USERNAME;
const defaultPassword = process.env.NEXT_PUBLIC_DEFAULT_SFTP_PASSWORD;
const defaultPath = process.env.NEXT_PUBLIC_DEFAULT_SFTP_PATH;

const styles = (theme) => ({
  main: {
    display: "block",
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    marginTop: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
});

class RasterImportPerusatContent extends React.Component {
  state = {
    hostname: defaultHostname || "",
    port: defaultPort || "",
    username: defaultUsername || "",
    password: defaultPassword || "",
    path: defaultPath || "/",
    listing: false,
    submitting: false,
    connected: false,
    files: [],
    selectedFiles: [],
  };

  static async getInitialProps({ query }) {
    return {
      namespacesRequired: ["common"],
      query,
    };
  }

  async fetchFiles(path) {
    const token = cookie.get("token");
    const { hostname, port, username, password } = this.state;
    const data = { hostname, port, username, password, path };

    this.setState({ listing: true });

    let files;

    try {
      var response = await axios.post(
        buildApiUrl("/lomas/import/sftp/list/"),
        data,
        {
          headers: {
            "Accept-Language": i18n.language,
            Authorization: token,
          },
        }
      );
      files = response.data.values;
      console.log("/import/sftp/list/", files);
    } catch (err) {
      this.props.enqueueSnackbar(
        `Ocurrió un error: ${err.response.data["detail"]}`,
        {
          variant: "error",
        }
      );
    }

    this.setState({ listing: false });

    return files;
  }

  onConnectDisconnectClick = () => {
    this.setState(
      (prevState) => ({
        connected: !prevState.connected,
        files: [],
        selectedFiles: [],
        path: (defaultPath || "/"),
      }),
      async () => {
        if (this.state.connected) {
          const files = await this.fetchFiles(this.state.path);
          if (files) {
            this.setState({ files });
          } else {
            this.setState({ connected: false });
          }
        }
      }
    );
  };

  onInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onChangePath = async (dirname) => {
    const files = await this.fetchFiles(dirname);
    if (files) {
      // Only change path and update files if fetch response went OK
      this.setState({ path: dirname, files, selectedFiles: [] });
    }
  };

  onSelectFiles = (path, files) => {
    this.setState({ selectedFiles: files });
  };

  onSubmit = async () => {
    this.setState({ submitting: true });

    const token = cookie.get("token");
    const {
      hostname,
      port,
      username,
      password,
      path,
      selectedFiles,
    } = this.state;

    const data = {
      hostname,
      port,
      username,
      password,
      files: selectedFiles.map((file) => `${path}${file}`),
    };

    try {
      await axios.post(buildApiUrl("/lomas/import/sftp/"), data, {
        headers: {
          "Accept-Language": i18n.language,
          Authorization: token,
        },
      });
      this.props.enqueueSnackbar(
        "El trabajo de carga de imágenes se agregó con éxito.",
        { variant: "success" }
      );
    } catch (err) {
      this.props.enqueueSnackbar(
        `Ocurrió un error: ${JSON.stringify(err.response.data)}`,
        {
          variant: "error",
        }
      );
      console.error(err);
    }

    this.setState({ submitting: false });
  };

  render() {
    const { classes } = this.props;
    const {
      listing,
      connected,
      submitting,
      hostname,
      port,
      username,
      password,
      path,
      files,
      selectedFiles,
    } = this.state;

    return (
      <main className={classes.main}>
        <Backdrop className={classes.backdrop} open={submitting}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Typography component="h1" variant="h5">
          Importar escenas de PeruSat-1
        </Typography>
        <Typography style={{ color: "red" }}>{this.state.errorMsg}</Typography>
        <form className={classes.form} autoComplete="on">
          <Grid container spacing={3}>
            <Grid item xs>
              <Paper className={classes.paper}>
                <InputControl
                  id="hostname"
                  label="SFTP Hostname"
                  value={hostname}
                  placeholder="example.com"
                  onChange={this.onInputChange}
                  required
                  disabled={connected}
                />
                <InputControl
                  id="port"
                  label="SFTP Port"
                  value={port}
                  placeholder="22"
                  onChange={this.onInputChange}
                  required
                  disabled={connected}
                />
                <InputControl
                  id="username"
                  label="SFTP Username"
                  value={username}
                  onChange={this.onInputChange}
                  disabled={connected}
                />
                <InputControl
                  id="password"
                  label="SFTP Password"
                  value={password}
                  type="password"
                  onChange={this.onInputChange}
                  disabled={connected}
                />

                <Button
                  fullWidth
                  variant="contained"
                  disabled={listing}
                  className={classes.button}
                  onClick={this.onConnectDisconnectClick}
                >
                  {connected ? "Desconectar" : "Conectar"}
                </Button>

                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  disabled={submitting || selectedFiles.length === 0}
                  onClick={this.onSubmit}
                >
                  Importar
                </Button>
              </Paper>
            </Grid>
            <Grid item xs>
              <FileListTable
                disabled={!connected}
                path={path}
                rows={files}
                onChangePath={this.onChangePath}
                onSelectFiles={this.onSelectFiles}
                loading={listing}
              />
            </Grid>
          </Grid>
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
