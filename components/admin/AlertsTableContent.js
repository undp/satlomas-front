import React from 'react';
import axios from "axios";
import Moment from "react-moment";
import { withStyles } from '@material-ui/core/styles';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { i18n, Link, withTranslation } from "../../i18n";
import { buildApiUrl } from "../../utils/api";
import { withSnackbar } from 'notistack';

const ruleByContentType = {
  parameterrule: { name: "Parámetro", urlName: "parameter-rules" },
  scoperule: { name: "Ámbito", urlName: "scope-rules" },
  scopetyperule: { name: "Tipo de Ámbito", urlName: "scope-type-rules" }
}

const styles = _theme => ({
  root: {
    flexGrow: 1,
  },
});


class AlertsTable extends React.Component {
  state = {
    loading: true,
    rows: [],
  }

  async componentDidMount() {
    await this.fetchData();
    this.markAsSeen();
  }

  markAsSeen() {
    const { token } = this.props;
    axios.put(buildApiUrl("/alerts/mark-as-seen/"), null, {
      headers: { Authorization: token }
    });
  }

  describeAlert(alert) {
    const { t } = this.props;

    const value = alert.value;
    const parameterName = t(`parameters.${alert.rule_attributes.parameter}`);
    const changeVerb = value > 0 ? 'aumentó' : 'disminuyó';
    const changeVerb2 = value > 0 ? 'mayor' : 'menor';
    const threshValue = value > 0 ? alert.rule_attributes.valid_max : alert.rule_attributes.valid_min;

    switch (alert.rule_content_type) {
      case "parameterrule": {
        return (<span>
          El parámetro {parameterName} de la estación{` `}
          {alert.rule_attributes.station_name}{` `}
          {changeVerb} {Math.abs(value)},{` `}
          {changeVerb2} que el umbral {Math.abs(threshValue)}.
        </span>);
      }
      case "scopetyperule": {
        const scopeType = alert.rule_attributes.scope_type;

        switch (alert.rule_attributes.change_type) {
          case "A":
            return (<span>
              El área en todos los ámbitos de {scopeType}{` `}
              {changeVerb} {Math.abs(value)} has, {changeVerb2} que el umbral de{` `}
              {Math.abs(threshValue)} has.
            </span>);
          case "P":
            return (<span>
              El porcentaje de área en todos los ámbitos de {scopeType}{` `}
              {changeVerb} {Math.abs(value)} has, {changeVerb2} que el umbral de{` `}
              {Math.abs(threshValue)} has.
            </span>);
          default:
            throw `Unknown change type: ${alert.rule_attributes.change_type}`;
        }
      }
      case "scoperule": {
        const scopeName = alert.rule_attributes.scope_name;
        const scopeType = alert.rule_attributes.scope_type;

        switch (alert.rule_attributes.change_type) {
          case "A":
            return (<span>
              El área del ámbito {scopeName} ({scopeType}){` `}
              {changeVerb} {Math.abs(value)} has, {changeVerb2} que el umbral de{` `}
              {Math.abs(threshValue)} has.
            </span>);
          case "P":
            return (<span>
              El porcentaje de área del ámbito {scopeName} ({scopeType}){` `}
              {changeVerb} {Math.abs(value)} has, {changeVerb2} que el umbral de{` `}
              {Math.abs(threshValue)} has.
            </span>);
          default:
            throw `Unknown change type: ${alert.rule_attributes.change_type}`;
        }
      }
      default:
        throw `Unknown rule content type: ${alert.rule_content_type}`;
    }
  }

  async fetchData() {
    const { token } = this.props;
    const response = await axios.get(buildApiUrl("/alerts/"), { headers: { Authorization: token } });
    const rows = response.data;
    this.setState({ loading: false, rows });
  }

  render() {
    const { classes } = this.props;
    const { rows } = this.state;

    const locale = i18n.language;

    return (
      <div className={classes.root}>
        <Typography
          variant="h6"
          className={classes.title}
          gutterBottom
        >
          Alertas
        </Typography>
        <Paper>
          <TableContainer>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Fecha y hora</TableCell>
                  <TableCell>Tipo de regla</TableCell>
                  <TableCell>Regla</TableCell>
                  <TableCell>Causa</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <TableRow key={row.id}>
                    <TableCell><Moment locale={locale} fromNow>{row.created_at}</Moment></TableCell>
                    <TableCell>{ruleByContentType[row.rule_content_type].name}</TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/${ruleByContentType[row.rule_content_type].urlName}/${row.rule.id}`}>
                        {String(row.rule.id)}
                      </Link>
                    </TableCell>
                    <TableCell>{this.describeAlert(row)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    );
  }
}

AlertsTable = withSnackbar(AlertsTable);
AlertsTable = withStyles(styles)(AlertsTable);
AlertsTable = withTranslation(["me", "common"])(AlertsTable);

export default AlertsTable