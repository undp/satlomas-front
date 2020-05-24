import React from 'react';
import axios from "axios";
import { withStyles } from '@material-ui/core/styles';
import { Typography, Paper } from '@material-ui/core';
import { buildApiUrl } from "../../utils/api";
import { withSnackbar } from 'notistack';
import VirtualizedTable from '../VirtualizedTable';

const styles = _theme => ({
  root: {
    flexGrow: 1,
  },
});


class AlertsTable extends React.Component {
  state = {
    loading: true,
    rows: [],
    columns: [
      { width: 120, flexGrow: 1.0, label: "Fecha y hora", dataKey: "created_at" },
      { width: 120, flexGrow: 1.0, label: "Tipo de regla", dataKey: "rule_content_type" },
      { width: 120, flexGrow: 1.0, label: "Regla", dataKey: "rule_id" },
      { width: 120, flexGrow: 1.0, label: "Tipo de medida", dataKey: "measurement_content_type" },
    ],
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
    console.log("Alerts:", rows);
    this.setState({ loading: false, rows });
  }

  render() {
    const { classes } = this.props;
    const { loading, rows, columns } = this.state;

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
          {!loading && (
            <VirtualizedTable
              rowCount={rows.length}
              rowGetter={({ index }) => rows[index]}
              columns={columns}
            />
          )}
        </Paper>
      </div>
    );
  }
}

AlertsTable = withSnackbar(AlertsTable);
AlertsTable = withStyles(styles)(AlertsTable);

export default AlertsTable