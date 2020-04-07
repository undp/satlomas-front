import React from "react";
import axios from "axios";
import { LineChart, XAxis, YAxis, CartesianGrid, Line } from "recharts";
import { buildApiUrl } from "../utils/api";
import LinearProgress from "@material-ui/core/LinearProgress";

const axisStyle = {
  fontSize: 12,
  fontWeight: 500,
  fontFamily: "Roboto, sans-serif",
};

class ParameterPlot extends React.Component {
  state = {
    loading: true,
    data: null,
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    const {
      parameter,
      station,
      start,
      end,
      groupingInterval,
      aggregationFunc,
    } = this.props;

    if (
      parameter !== prevProps.parameter ||
      station !== prevProps.station ||
      start !== prevProps.start ||
      end !== prevProps.end ||
      groupingInterval !== prevProps.groupingInterval ||
      aggregationFunc !== prevProps.aggregationFunc
    ) {
      this.fetchData();
    }
  }

  async fetchData() {
    const {
      parameter,
      station,
      start,
      end,
      groupingInterval,
      aggregationFunc,
    } = this.props;

    const params = {
      station: station.id,
      parameter,
      start,
      end,
      grouping_interval: groupingInterval,
      aggregation_func: aggregationFunc,
    };

    try {
      const response = await axios.get(buildApiUrl("/measures/summary"), {
        params,
      });
      // console.log(`Fetch data for '${parameter}':`, response.data);
      this.setState({ data: response.data, loading: false });
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    const { data, loading } = this.state;

    return loading ? (
      <LinearProgress />
    ) : (
      <LineChart width={400} height={250} data={data}>
        <XAxis dataKey="t" style={axisStyle} />
        <YAxis style={axisStyle} />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Line type="monotone" dataKey="v" stroke="#8884d8" />
      </LineChart>
    );
  }
}

export default ParameterPlot;
