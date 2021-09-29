import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { LinearProgress, Typography } from "@material-ui/core";
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

const sourcesByType = {
  "lomas-changes": ["S2", "P1"],
  "vi-lomas-changes": ["MV"],
};
const titlesByType = {
  "lomas-changes": {
    S2: "Análisis con imágenes Sentinel-2",
    P1: "Análisis con imágenes PeruSat-1",
  },
  "vi-lomas-changes": {},
};
const kindsByTypeSource = {
  "lomas-changes": { P1: ["C", "D", "U", "V"], S2: ["LS", "CL"] },
  "vi-lomas-changes": { MV: ["V", "C"] },
};
const colorsByKindSource = {
  "vi-lomas-changes": {
    MV: {
      V: "#59c798",
      C: "#8faadc",
    },
  },
  "lomas-changes": {
    S2: {
      LS: "#ff0000",
      CL: "#00c8ff",
    },
    P1: {
      C: "#c70039",
      D: "#eddd53",
      U: "#2a7b9b",
      V: "#33a02c",
    },
  },
};
const namesByKindSource = {
  "vi-lomas-changes": {
    MV: {
      V: "Cobertura de vegetación (ha)",
      C: "Nubosidad (ha)",
    },
  },
  "lomas-changes": {
    S2: {
      LS: "Cobertura perdida (ha)",
      CL: "Nubosidad (ha)",
    },
    P1: {
      C: "Caminos (ha)",
      D: "Posible suelo disturbado (ha)",
      U: "Construcciones (ha)",
      V: "Vegetación cultivada (ha)",
    },
  },
};

const styles = (theme) => ({
  progress: {
    marginBottom: theme.spacing(1),
  },
  invisible: {
    visibility: "hidden",
  },
  chartTitle: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  note: {
    fontSize: "0.75rem",
    marginTop: theme.spacing(2),
    width: "80%",
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
        source: sourcesByType[type].join(","),
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

        const data = {};
        Object.entries(valuesRaw).forEach(([source, sourceValues]) => {
          const valuesPerDate = groupBy(sourceValues, "date");
          console.log("valuesPerDate:", valuesPerDate);
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

          data[source] = values;
        });

        console.log("Data:", data);

        this.setState({ data });
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

    const sources = sourcesByType[type];
    const titles = titlesByType[type];

    return (
      <div>
        {loading && (
          <LinearProgress
            className={classNames(
              classes.progress,
              !loading && classes.invisible
            )}
          />
        )}
        {data &&
          sources.map((source) => (
            <>
              {titles[source] && (
                <Typography class={classes.chartTitle}>
                  {titles[source]}
                </Typography>
              )}
              <BarChart
                key={source}
                width={500}
                height={260}
                data={data[source]}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <XAxis dataKey="ym" style={axisStyle} />
                <YAxis style={axisStyle} unit=" ha" />
                <Tooltip />
                <Legend />
                {kindsByTypeSource[type][source].map((kind) => (
                  <Bar
                    key={kind}
                    stackId={type}
                    dataKey={`area_${kind}`}
                    fill={colorsByKindSource[type][source][kind]}
                    name={namesByKindSource[type][source][kind]}
                  />
                ))}
              </BarChart>
            </>
          ))}
        {type == "lomas-changes" && (
          <Typography className={classes.note}>
            *Resultados en base a un modelo experimental con imágenes
            satelitales PeruSat-1 y Sentinel-2.
          </Typography>
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
