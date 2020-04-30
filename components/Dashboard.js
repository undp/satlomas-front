import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import moment from "moment";
import { withSnackbar } from "notistack";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import axios from "axios";
import { buildApiUrl } from "../utils/api";

const styles = (theme) => ({});

const axisStyle = {
  fontSize: 12,
  fontWeight: 500,
  fontFamily: "Roboto, sans-serif",
};

class Dashboard extends React.Component {
  state = {
    data: [],
    dataAvailable: false,
  };

  componentDidMount() {
    this.getTimeSeries();
  }

  getTimeSeries = async () => {
    const { periods, scope } = this.props;

    if (periods.length === 0 || !scope) return;

    const dateFrom = Math.min(...periods.map(p => Math.min(p[0], p[1])));
    const dateTo = Math.max(...periods.map(p => Math.max(p[0], p[1])));
    console.log("min date on periods:", dateFrom);
    console.log("max date on periods:", dateTo);

    if (scope) {
      const body = {
        scope_id: scope,
        from_date: moment(dateFrom).format("YYYY-MM-DD"),
        end_date: moment(dateTo).format("YYYY-MM-DD"),
      };
      console.log(body);
      try {
        const response = await axios.post(buildApiUrl("/vi-lomas/coverage/"), body);
        console.log(response.data);
        this.setState({
          data: response.data.values,
          dataAvailable: true,
        });
      } catch (err) {
        console.error(err);
        this.props.enqueueSnackbar(`Failed to get scope types`, {
          variant: "error",
        });
      }
    }
  };

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.getTimeSeries();
    }
  }

  render() {
    const { data, dataAvailable } = this.state;
    return (
      <div>
        {dataAvailable && (
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <XAxis dataKey="date" style={axisStyle} />
            <YAxis style={axisStyle} />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="area" stroke="#8884d8" />
          </LineChart>
        )}
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
  periods: PropTypes.array.isRequired,
  scope: PropTypes.number,
  customScope: PropTypes.string,
};

Dashboard = withStyles(styles)(Dashboard);
Dashboard = withSnackbar(Dashboard);

export default Dashboard;
