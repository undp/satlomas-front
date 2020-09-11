import React from "react";
import axios from "axios";
import { Paper } from "@material-ui/core";
import VirtualizedTable from "./VirtualizedTable";
import { buildApiUrl } from "../utils/api";
import _ from "lodash";
import { withSnackbar } from "notistack";
import moment from "moment";
import strftime from "../utils/strftime";

const getSecondsFromTimeAndUnit = (time, unit) => {
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
};

export const calculateTimeRange = (mode, params) => {
  switch (mode) {
    case "realtime": {
      const { now, lastTime } = params;
      const [time, unit] = lastTime.split("-");
      const seconds = getSecondsFromTimeAndUnit(time, unit);
      return [new Date(now - seconds), now];
    }
    case "historic": {
      const { start, end } = params;
      return [start, end];
    }
    default:
      throw "invalid time range mode";
  }
};

class StationTable extends React.Component {
  state = {
    loading: true,
    rows: [],
    columns: [],
  };

  componentDidMount() {
    const { parameters } = this.props;
    let columns = [{ width: 100, flexGrow: 1.0, label: "Fecha", dataKey: "t" }];
    parameters.forEach((e) =>
      columns.push({ width: 80, flexGrow: 1.0, label: e.name, dataKey: e.id })
    );
    this.setState({ columns });
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps, this.props)) {
      this.fetchData();
    }
  }

  async fetchData() {
    const {
      stationId,
      parameters,
      mode,
      timeRangeParams,
      groupingInterval,
      aggregationFunc,
    } = this.props;

    const [start, end] = calculateTimeRange(mode, timeRangeParams);

    const mStart = moment(start);
    const mEnd = moment(end);

    if (!mStart.isValid() || !mStart.isValid()) {
      return;
    }

    let parameter = "";
    parameters.forEach((e) => (parameter = parameter.concat(e.id).concat(",")));
    parameter = parameter.substring(0, parameter.length - 1);
    const params = {
      station: stationId,
      parameter: parameter,
      start: mStart.format(),
      end: mEnd.format(),
      grouping_interval: groupingInterval,
      aggregation_func: aggregationFunc,
    };
    console.log("PARAMS:", params);

    try {
      const response = await axios.get(
        buildApiUrl("/stations/measurements/summary"),
        {
          params,
        }
      );
      const formattedRows = this.formatRows(response.data);
      this.setState({ rows: formattedRows, loading: false });
    } catch (err) {
      console.error(err);
      this.props.enqueueSnackbar(`Failed to get table data`, {
        variant: "error",
      });
    }
  }

  formatRows = (rows) => {
    return rows.map((row) => {
      let formattedRow = {};
      Object.entries(row).map(([k, v]) => {
        formattedRow[k] = +(+v).toFixed(2);
      });
      formattedRow["t"] = this.formatDateTime(row.t);
      return formattedRow;
    });
  };

  formatDateTime(t) {
    const { groupingInterval } = this.props;
    const ft = new Date(Date.parse(t));

    switch (groupingInterval) {
      case "hour":
        return strftime("%Y-%m-%d %H:00", ft);
      case "day":
        return strftime("%Y-%m-%d", ft);
      // TODO
      // case 'week':
      //   return strftime("%Y %W", ft);
      case "month":
        return strftime("%Y-%m", ft);
      case "year":
        return strftime("%Y", ft);
      default:
        return t;
    }
  }

  render() {
    const { rows, columns, loading } = this.state;

    return (
      <>
        <Paper style={{ height: "80vh", width: "100%" }}>
          {!loading && (
            <VirtualizedTable
              rowCount={rows.length}
              rowGetter={({ index }) => rows[index]}
              columns={columns}
            />
          )}
        </Paper>
      </>
    );
  }
}

StationTable = withSnackbar(StationTable);

export default StationTable;
