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
import EditIcon from '@material-ui/icons/Edit';
import { routerPush } from "../../utils/router";
import RulesListContent from "./RulesListContent";
import { withSnackbar } from 'notistack';
import axios from "axios";
import { buildApiUrl } from "../../utils/api";

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  newButton: {
    marginLeft: theme.spacing(2)
  }
});

const getStationName = (stations, id) => {
  if (!id) return 'Cualquiera';
  if (!stations) return '';
  const station = stations[id];
  if (!station) return '';
  return station.name;
}

let ParameterRulesTable = (props) => {
  const { t, classes, stations, rows } = props;
  const locale = i18n.language;

  return (
    <Paper className={classes.root}>
      <TableContainer>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Estación</TableCell>
              <TableCell>Parámetro</TableCell>
              <TableCell>Rango</TableCell>
              <TableCell>Fecha de creación</TableCell>
              <TableCell>Fecha de modificación</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{getStationName(row.station)}</TableCell>
                <TableCell>{t(`parameters.${row.parameter}`)}</TableCell>
                <TableCell>{row.valid_min} - {row.valid_max}{row.is_absolute ? ` (absoluto)` : ''}</TableCell>
                <TableCell><Moment locale={locale} fromNow>{row.created_at}</Moment></TableCell>
                <TableCell><Moment locale={locale} fromNow>{row.updated_at}</Moment></TableCell>
                <TableCell align="right">
                  <Tooltip title="Editar">
                    <IconButton
                      onClick={() => routerPush(`/admin/parameter-rules/${row.id}`)}
                      aria-label="Editar regla"
                    >
                      <EditIcon />
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

ParameterRulesTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

ParameterRulesTable = withStyles(styles)(ParameterRulesTable);
ParameterRulesTable = withTranslation(["me", "common"])(ParameterRulesTable);

class ParameterRulesListContent extends React.Component {
  state = {
    stations: {}
  }

  componentDidMount() {
    this.fetchStations()
  }

  async fetchStations() {
    try {
      const response = await axios.get(buildApiUrl("/stations/stations"));
      const stationsArray = response.data;
      let stations = {};
      for (let i = 0; i < stationsArray.length; i++) {
        const station = stationsArray[i];
        stations[station.id] = station;
      }
      this.setState({ stations });
    } catch (err) {
      console.error(err);
      this.props.enqueueSnackbar("Failed to get stations", { variant: 'error' });
    }
  }

  render() {
    const { token } = this.props;
    const { stations } = this.state;

    return (
      <RulesListContent
        token={token}
        ruleType="parameter"
        title="Reglas por Parámetro"
        tableComponent={<ParameterRulesTable stations={stations} />} />
    )
  }
}

ParameterRulesListContent = withSnackbar(ParameterRulesListContent);

export default ParameterRulesListContent;
