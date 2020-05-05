import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Paper,
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
              <TableRow key={row.id}>
                <TableCell>{row.slug}</TableCell>
                <TableCell>{row.period}</TableCell>
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
                      onClick={() => downloadHandler(row.id)}
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

class RasterListContent extends React.Component {
  state = {
      rows: [],
      //rows : [{id:1, slug:"s1", period: "02 2020", name: "archivo.js", tiles_url:"asdasd.com",description: "asdasdasd", created_at:"01-01-2020", updated_at: "01-01-2020"}],
  }

  async componentDidMount() {
    this.fetchData();
  }

  async fetchData(){
    const { token } = this.props;
    const response = await axios.get(
        buildApiUrl("/vi-lomas/rasters"), 
        { headers: { "Accept-Language": i18n.language, Authorization: token }}
    );
    this.setState({ rows: response.data })
  }

  downloadRaster(id){
    axios.get(buildApiUrl(`/vi-lomas/download-raster/${id}`), {
      headers: { Authorization: this.props.token },
      responseType: 'blob'
    })
    .then(response => {
      FileDownload(response.data, file.name);
    });
  }


  render() {
    const { rows } = this.state;

    return (
      <RasterTable rows={rows} downloadHandler={this.downloadRaster}/>
    )
  }
}

RasterListContent = withSnackbar(RasterListContent);

export default RasterListContent;
