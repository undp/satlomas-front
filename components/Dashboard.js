import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { LinearProgress } from "@material-ui/core";
import moment from "moment";
import classNames from "classnames";
import { withSnackbar } from "notistack";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import axios from "axios";
import { buildApiUrl } from "../utils/api";

const typeBasePaths = {
  "lomas-changes": "/lomas",
  "vi-lomas-changes": "/vi-lomas"
}

const styles = (theme) => ({
  progress: {
    marginBottom: theme.spacing(1)
  },
  invisible: {
    visibility: 'hidden'
  }
});

const axisStyle = {
  fontSize: 12,
  fontWeight: 500,
  fontFamily: "Roboto, sans-serif",
};

class Dashboard extends React.Component {
  state = {
    data: null,
    loading: true
  };

  componentDidMount() {
    this.getTimeSeries();
  }

  getTimeSeries = async () => {
    const { type, periods, scope } = this.props;
    //const basePath = typeBasePaths[type]
    const basePath = '/vi-lomas';

    this.setState({ loading: true });

    if (periods.length === 0 || !scope) return;

    const dateFrom = Math.min(...periods.map(p => Math.min(p.from, p.to)));
    const dateTo = Math.max(...periods.map(p => Math.max(p.from, p.to)));

    if (scope) {
      const params = {
        scope,
        date_from: moment(dateFrom).utc().format("YYYY-MM-DD"),
        date_to: moment(dateTo).utc().format("YYYY-MM-DD"),
      };
      try {
        const response = await axios.get(buildApiUrl(`${basePath}/coverage/`), { params });
        const values = response.data.values.map(value => ({
          ...value,
          ym: moment(value.date).format("YYYY-MM"),
          area: value.area / 10000,
        }));
        this.setState({
          data: values,
        });
      } catch (err) {
        console.error(err);
        this.props.enqueueSnackbar(`Failed to get scope types`, {
          variant: "error",
        });
      }
      this.setState({ loading: false })
    }
  };

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.getTimeSeries();
    }
  }

  render() {
    const { classes } = this.props;
    const { data, loading } = this.state;
    return (
      <div>
        <LinearProgress className={classNames(classes.progress, !loading && classes.invisible)} />
        {data && (
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <XAxis dataKey="ym" style={axisStyle} />
            <YAxis style={axisStyle} unit=" ha" />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="area" stroke="#009688" />
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
