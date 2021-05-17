import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { LinearProgress } from "@material-ui/core";
import moment from "moment";
import classNames from "classnames";
import { withSnackbar } from "notistack";
import {
  BarChart,
  Legend,
  Tooltip,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import axios from "axios";
import { buildApiUrl } from "../utils/api";

const groupBy = (xs, key) =>
  xs.reduce((rv, x) => {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});

const sourcesByType = { "lomas-changes": "S2,P1", "vi-lomas-changes": "MV" };
const kindsByType = {
  "lomas-changes": ["C", "D", "U", "V"],
  "vi-lomas-changes": ["V", "C"],
};
const colorsByKind = {
  "vi-lomas-changes": {
    V: "#59c798",
    C: "#8faadc",
  },
};
const namesByKind = {
  "vi-lomas-changes": {
    V: "Cobertura de vegetación (ha)",
    C: "Nubosidad (ha)",
  },
};

const styles = (theme) => ({
  progress: {
    marginBottom: theme.spacing(1),
  },
  invisible: {
    visibility: "hidden",
  },
});

const axisStyle = {
  fontSize: 12,
  fontWeight: 500,
  fontFamily: "Roboto, sans-serif",
};

class TimeSeriesControl extends React.Component {
  state = {
    data: null,
    loading: true,
  };

  componentDidMount() {
    this.getTimeSeries();
  }

  getTimeSeries = async () => {
    const { type, dates, scope } = this.props;

    this.setState({ loading: true });

    if (dates.length === 0 || !scope) return;

    const dateFrom = Math.min(...dates);
    const dateTo = Math.max(...dates);

    if (scope) {
      const params = {
        source: sourcesByType[type],
        scope,
        date_from: moment(dateFrom).format("YYYY-MM-DD"),
        date_to: moment(dateTo).format("YYYY-MM-DD"),
      };

      try {
        console.log("params:", params);
        const response = await axios.get(buildApiUrl(`/eo-sensors/coverage/`), {
          params,
        });
        const valuesRaw = response.data.values;
        console.log("valuesRaw:", valuesRaw);

        const valuesPerDate = groupBy(valuesRaw, "date");
        console.log("valuesPerDate:", valuesPerDate);

        const kinds = [...new Set(valuesRaw.map((v) => v["kind"]))];
        console.log("kinds:", kinds);

        const values = Object.values(valuesPerDate).map((dateValues) => {
          let v = dateValues[0];
          v["ym"] = moment(v["date"]).format("YYYY-MM");
          dateValues.forEach((otherValue) => {
            v[`area_${otherValue["kind"]}`] = Math.round(
              otherValue["area"] / 10000
            );
          });
          return v;
        });

        this.setState({
          kinds,
          data: values,
        });
      } catch (err) {
        console.error(err);
        this.props.enqueueSnackbar(`Failed to get time series data`, {
          variant: "error",
        });
      }
      this.setState({ loading: false });
    }
  };

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.getTimeSeries();
    }
  }

  render() {
    const { classes, type } = this.props;
    const { data, loading } = this.state;

    return (
      <div>
        <LinearProgress
          className={classNames(
            classes.progress,
            !loading && classes.invisible
          )}
        />
        {data && (
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis dataKey="ym" style={axisStyle} />
            <YAxis style={axisStyle} unit=" ha" />
            <Tooltip />
            <Legend />
            {kindsByType[type].map((kind) => (
              <Bar
                key={kind}
                stackId={type}
                dataKey={`area_${kind}`}
                fill={colorsByKind[type][kind]}
                name={namesByKind[type][kind]}
              />
            ))}
          </BarChart>
        )}
      </div>
    );
  }
}

TimeSeriesControl.propTypes = {
  classes: PropTypes.object.isRequired,
  dates: PropTypes.array.isRequired,
  scope: PropTypes.number,
  customScope: PropTypes.string,
};

TimeSeriesControl = withStyles(styles)(TimeSeriesControl);
TimeSeriesControl = withSnackbar(TimeSeriesControl);

export default TimeSeriesControl;
