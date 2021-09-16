import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {
  Paper,
  Button,
  Typography,
  Table,
  TableBody,
  Tooltip,
  TableHead,
  TableRow,
  TableContainer,
  TableCell,
  IconButton,
} from "@material-ui/core";
import { i18n, withTranslation } from "../../i18n";
import Moment from "react-moment";
import { CopyToClipboard } from "react-copy-to-clipboard";
import GetAppIcon from "@material-ui/icons/GetApp";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import { withSnackbar } from "notistack";
import axios from "axios";
import { buildApiUrl } from "../../utils/api";
import FileDownload from "../../utils/file-download";
import Link from "next/link";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  importBtn: {
    float: "right",
  },
});

let RasterTable = (props) => {
  const { classes, rows, downloadHandler } = props;
  const locale = i18n.language;

  const getFilename = (row) => {
    const parts = row["file"].split("/");
    const filename = parts[parts.length - 1];
    const [name, ext] = filename.split(".").slice(0, 2);
    return `${row["source"]}_${name}_${row["date"]}.${ext}`;
  };

  return (
    <Paper className={classes.root}>
      <TableContainer>
        <Table className={classes.table} size="small">
          <TableHead>
            <TableRow>
              <TableCell>Tipo</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Archivo</TableCell>
              <TableCell>Creado</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id + row.type}>
                <TableCell>{row.slug}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>
                  <Moment locale={locale} fromNow>
                    {row.created_at}
                  </Moment>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Copy URL">
                    <CopyToClipboard text={row.tiles_url}>
                      <IconButton>
                        <FileCopyIcon />
                      </IconButton>
                    </CopyToClipboard>
                  </Tooltip>
                  <Tooltip title="Download">
                    <IconButton
                      onClick={() => downloadHandler(row.id, getFilename(row))}
                      aria-label="Editar regla"
                    >
                      <GetAppIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

RasterTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

RasterTable = withStyles(styles)(RasterTable);
RasterTable = withTranslation(["me", "common"])(RasterTable);

const typeBasePaths = {
  eoSensors: "/eo-sensors",
};

class RasterListContent extends React.Component {
  state = {
    rows: [],
  };
  constructor(props) {
    super(props);
    this.downloadRaster = this.downloadRaster.bind(this);
  }

  async componentDidMount() {
    this.fetchData();
  }

  async fetchData() {
    const { token } = this.props;

    const response = await axios.get(buildApiUrl("/eo-sensors/rasters"), {
      headers: { "Accept-Language": i18n.language, Authorization: token },
    });
    const rows = response.data;

    this.setState({ rows });
  }

  downloadRaster(id, filename) {
    this.props.enqueueSnackbar(
      `Downloading will begin shortly. Please wait a few seconds.`
    );

    axios
      .get(buildApiUrl(`/eo-sensors/download-raster/${id}`), {
        headers: { Authorization: this.props.token },
        responseType: "blob",
      })
      .then((response) => {
        FileDownload(response.data, filename);
      });
  }

  render() {
    const { classes } = this.props;
    const { rows } = this.state;

    return (
      <div className={classes.root}>
        <Typography variant="h6" className={classes.title} gutterBottom>
          Imágenes
          <Link href="/user/rasters/import-perusat">
            <Button className={classes.importBtn}>Importar PeruSat-1</Button>
          </Link>
        </Typography>

        <RasterTable rows={rows} downloadHandler={this.downloadRaster} />
      </div>
    );
  }
}

RasterListContent = withSnackbar(RasterListContent);
RasterListContent = withStyles(styles)(RasterListContent);

export default RasterListContent;
