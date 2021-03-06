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
                        href={`/user/${ruleByContentType[row.rule_content_type].urlName}/${row.rule.id}`}>
                        {String(row.rule.id)}
                      </Link>
                    </TableCell>
                    <TableCell>{row.description}</TableCell>
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
