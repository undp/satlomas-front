import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  Tooltip,
  TableHead,
  TableRow,
  TableContainer,
  TableCell,
  IconButton,
} from '@material-ui/core';
import { i18n, withTranslation } from "../../i18n";
import Moment from "react-moment";
import { CopyToClipboard } from "react-copy-to-clipboard";
import GetAppIcon from '@material-ui/icons/GetApp';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { withSnackbar } from 'notistack';
import axios from "axios";
import { buildApiUrl } from "../../utils/api";
import FileDownload from "../../utils/file-download";


const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
});


let RasterTable = (props) => {
  const { t, classes, rows, downloadHandler } = props;
  const locale = i18n.language;

  return (
    <Paper className={classes.root}>
      <TableContainer>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Slug</TableCell>
              <TableCell>Periodo</TableCell>
              <TableCell>Archivo</TableCell>
              <TableCell>Descripcion</TableCell>
              <TableCell>Fecha de creación</TableCell>
              <TableCell>Fecha de modificación</TableCell>
              <TableCell />
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id + row.type}>
                <TableCell>{row.slug}</TableCell>
                <TableCell>{row.period_readeable}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell><Moment locale={locale} fromNow>{row.created_at}</Moment></TableCell>
                <TableCell><Moment locale={locale} fromNow>{row.updated_at}</Moment></TableCell>
                <TableCell align="right">
                  <Tooltip title="Copy URL">
                    <CopyToClipboard text={row.tiles_url}>
                      <IconButton>
                        <FileCopyIcon />
                      </IconButton>
                    </CopyToClipboard>
                  </Tooltip>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Download">
                    <IconButton
                      onClick={() => downloadHandler(row.id, row.name, row.type)}
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
}

RasterTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

RasterTable = withStyles(styles)(RasterTable);
RasterTable = withTranslation(["me", "common"])(RasterTable);

const typeBasePaths = {
  "lomas": "/lomas",
  "vi-lomas": "/vi-lomas"
}

class RasterListContent extends React.Component {
  state = {
    rows: [],
  }
  constructor(props) {
    super(props);
    this.downloadRaster = this.downloadRaster.bind(this);
  }

  async componentDidMount() {
    this.fetchData();
  }

  async fetchData() {
    const { token } = this.props;

    const vi_lomas_response = await axios.get(
      buildApiUrl("/vi-lomas/rasters"),
      { headers: { "Accept-Language": i18n.language, Authorization: token } }
    );
    let vi_lomas_rasters = vi_lomas_response.data;
    for (var i = 0; i < vi_lomas_rasters.length; i++) {
      vi_lomas_rasters[i]['type'] = 'vi-lomas'
      vi_lomas_rasters[i]['period_readeable'] = `${vi_lomas_rasters[i]['period']['date_from']} - ${vi_lomas_rasters[i]['period']['date_to']}`
    }

    const lomas_response = await axios.get(
      buildApiUrl("/lomas/rasters"),
      { headers: { "Accept-Language": i18n.language, Authorization: token } }
    );
    let lomas_rasters = lomas_response.data;
    for (var i = 0; i < lomas_rasters.length; i++) {
      lomas_rasters[i]['type'] = 'lomas'
      lomas_rasters[i]['period_readeable'] = `${lomas_rasters[i]['period']['date_from']} - ${lomas_rasters[i]['period']['date_to']}`

    }

    let result = vi_lomas_rasters.concat(lomas_rasters);
    result.sort(function (a, b) {
      if (a["period"]["date_from"] > ["period"]["date_from"]) { return -1; }
      if (b["period"]["date_from"] > a["period"]["date_from"]) { return 1; }
      return 0;
    });

    this.setState({ rows: result });
  }

  downloadRaster(id, name, type) {
    axios.get(buildApiUrl(`${typeBasePaths[type]}/download-raster/${id}`), {
      headers: { Authorization: this.props.token },
      responseType: 'blob'
    })
      .then(response => {
        FileDownload(response.data, name);
      });
  }


  render() {
    const { classes } = this.props;
    const { rows } = this.state;

    return (
      <div className={classes.root}>
        <Typography
          variant="h6"
          className={classes.title}
          gutterBottom
        >
          Imágenes
        </Typography>
        <RasterTable rows={rows} downloadHandler={this.downloadRaster} />
      </div>
    )
  }
}

RasterListContent = withSnackbar(RasterListContent);
RasterListContent = withStyles(styles)(RasterListContent);

export default RasterListContent;
