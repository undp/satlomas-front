import React from "react";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";
import { LineChart, XAxis, YAxis, CartesianGrid, Line } from "recharts";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import { buildApiUrl } from "../utils/api";
import _ from "lodash";

const axisStyle = {
  fontSize: 12,
  fontWeight: 500,
  fontFamily: "Roboto, sans-serif",
};

const styles = (_theme) => ({
  table: {
    minWidth: 400,
  },
});

const ParameterPlot = ({ data }) => (
  <LineChart width={400} height={250} data={data}>
    <XAxis dataKey="t" style={axisStyle} />
    <YAxis style={axisStyle} />
    <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
    <Line type="monotone" dataKey="v" stroke="#8884d8" />
  </LineChart>
);

let ParameterTable = ({ classes, data }) => (
  <Table className={classes.table}>
    <TableHead>
      <TableRow>
        <TableCell>Fecha y hora</TableCell>
        <TableCell align="right">Valor</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {data.map((row) => (
        <TableRow key={row.t}>
          <TableCell component="th" scope="row">
            {row.t}
          </TableCell>
          <TableCell align="right">{row.v}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

ParameterTable = withStyles(styles)(ParameterTable);

class ParameterCardContent extends React.Component {
  state = {
    loading: true,
    data: null,
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps, this.props)) {
      this.fetchData();
    }
  }

  getSecondsFromTimeAndUnit(time, unit) {
    switch (unit) {
      case "hour":
        return time * 1000 * 60 * 60;
      case "day":
        return time * 1000 * 60 * 60 * 24;
      case "week":
        return time * 1000 * 60 * 60 * 24 * 7;
      case "month":
        return time * 1000 * 60 * 60 * 24 * 30;
      case "year":
        return time * 1000 * 60 * 60 * 24 * 365;
      default:
        throw `Invalid time unit: ${unit}`;
    }
  }

  calculateTimeRange(mode, params) {
    switch (mode) {
      case "realtime": {
        const { now, lastTime } = params;
        const [time, unit] = lastTime.split("-");
        const seconds = this.getSecondsFromTimeAndUnit(time, unit);
        return [new Date(now - seconds), now];
      }
      case "historic": {
        const { start, end } = params;
        return [start, end];
      }
      default:
        throw "invalid time range mode";
    }
  }

  async fetchData() {
    const {
      parameter,
      stationId,
      mode,
      timeRangeParams,
      groupingInterval,
      aggregationFunc,
    } = this.props;

    const [start, end] = this.calculateTimeRange(mode, timeRangeParams);

    const params = {
      station: stationId,
      parameter,
      start,
      end,
      grouping_interval: groupingInterval,
      aggregation_func: aggregationFunc,
    };

    try {
      const response = await axios.get(buildApiUrl("/measurements/summary"), {
        params,
      });
      this.setState({ data: response.data, loading: false });
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    const { showTable } = this.props;
    const { data, loading } = this.state;

    return (
      !loading &&
      (showTable ? (
        <ParameterTable data={data} />
      ) : (
        <ParameterPlot data={data} />
      ))
    );
  }
}

export default ParameterCardContent;
