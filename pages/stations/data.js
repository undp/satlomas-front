import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Head from "next/head";
import axios from "axios";
import moment from "moment"
import {
  AppBar,
  CssBaseline,
  Toolbar,
  Typography,
  LinearProgress,
  Button,
} from "@material-ui/core";
import StationsFilterButton from "../../components/StationsFilterButton";
import TimeRangeFilterButton, {
  DEFAULT_MODE,
  DEFAULT_HISTORIC_START,
  DEFAULT_HISTORIC_END,
  DEFAULT_AGG_FUNC,
  DEFAULT_GROUP_INT,
  DEFAULT_RT_LAST_TIME,
  lastTimeItems,
  aggregationFuncItems,
  groupingIntervalItems
} from "../../components/TimeRangeFilterButton";
import StationTable from "../../components/StationTable";
import AppbarButtons from "../../components/AppbarButtons";
import { withStyles } from "@material-ui/core/styles";
import { withSnackbar } from "notistack";
import { withRouter } from "next/router";
import { buildApiUrl } from "../../utils/api";
import { isDate } from "../../utils/date";
import FileDownload from "../../utils/file-download"
import config from "../../config";

const { appName, stationParameters } = config;

// FIXME Move to config.js
const REFRESH_INTERVAL_MS = 1000 * 60; // Refresh every 60 seconds

const styles = (theme) => ({
  appBar: {
    position: "relative",
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(1500 + theme.spacing(3) * 2)]: {
      width: 1500,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  grow: {
    flexGrow: 1,
  },
  rightButtons: {
    position: "relative",
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  cardGrid: {
    padding: `${theme.spacing(3)}px 0`,
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  body: {
    fontFamily: "Roboto, sans-serif",
    fontSize: 10,
  },
  button: {
    margin: theme.spacing(1),
  }
});

let DataToolbar = ({ classes, onDownloadClick, onDashboardClick }) => (
  <div>
    <Button onClick={onDashboardClick} className={classes.button}>Dashboard</Button>
    <Button onClick={onDownloadClick} className={classes.button}>Descargar</Button>
  </div>
)

DataToolbar = withStyles(styles)(DataToolbar)

class StationsData extends React.Component {
  state = {
    loading: true,
    station: null,
    mode: DEFAULT_MODE,
    realtimeParams: { now: new Date(), lastTime: DEFAULT_RT_LAST_TIME },
    historicParams: { start: new Date(DEFAULT_HISTORIC_START), end: new Date(DEFAULT_HISTORIC_END) },
    aggregationFunc: DEFAULT_AGG_FUNC,
    groupingInterval: DEFAULT_GROUP_INT,
    stationsAnchorEl: null,
    data: {},
  };

  static async getInitialProps({ query }) {
    return { namespacesRequired: ["common"], query };
  }

  async componentDidMount() {
    await this.fetchStations();

    const { query } = this.props;

    // Set station filter based on query param
    const { stations } = this.state;
    const station =
      stations &&
      (query.id
        ? stations.find((station) => station.id === Number(query.id))
        : stations[0]);

    // Set time range filter based on query param
    const {
      mode,
      lastTime,
      start,
      end,
      aggregationFunc,
      groupingInterval
    } = this.getValidTimeRangeParameters();

    this.setState((prevState) => ({
      loading: false,
      station,
      mode,
      realtimeParams: { ...prevState.realtimeParams, lastTime },
      historicParams: { ...prevState.historicParams, start, end },
      aggregationFunc,
      groupingInterval,
    }))
  }

  componentDidUpdate(_prevProps, prevState) {
    const {
      station,
      mode,
      realtimeParams: { lastTime },
      historicParams: { start, end },
      aggregationFunc,
      groupingInterval
    } = this.state;

    // Set mode if it changed
    if (mode !== prevState.mode) {
      if (mode === "realtime") {
        this.setRealtimeMode();
      } else if (mode === "historic") {
        this.setHistoricMode();
      }
    }

    // Update query params based on state
    if (
      station != prevState.station ||
      mode != prevState.mode ||
      lastTime != prevState.realtimeParams.lastTime ||
      start != prevState.historicParams.start ||
      end != prevState.historicParams.end ||
      aggregationFunc != prevState.aggregationFunc ||
      groupingInterval != prevState.groupingInterval
    ) {
      this.pushNewRoute();
    }
  }

  setRealtimeMode() {
    this.updateNow();
    this.rtInterval = setInterval(() => this.updateNow(), REFRESH_INTERVAL_MS);
  }

  setHistoricMode() {
    this.setState({ mode: "historic" });
    this.rtInterval = null;
  }

  updateNow() {
    const now = new Date();

    console.log("Update now:", now);
    this.setState((prevState) => ({
      mode: "realtime",
      realtimeParams: { ...prevState.realtimeParams, now },
    }));
  }

  async fetchStations() {
    try {
      const response = await axios.get(buildApiUrl("/stations/stations/"));
      this.setState({ stations: response.data });
    } catch (error) {
      this.props.enqueueSnackbar("Failed to fetch stations", {
        variant: "error",
      });
    }
  }

  async downloadCSV() {
    const {
      station,
      mode,
      realtimeParams,
      historicParams,
      groupingInterval,
      aggregationFunc,
    } = this.state;

    const parameter = stationParameters.map(param => param.id).join(",");
    const timeRangeParams = mode === "realtime" ? realtimeParams : historicParams;
    const [start, end] = this.calculateTimeRange(mode, timeRangeParams);

    const mStart = moment(start);
    const mEnd = moment(end);

    if (!mStart.isValid() || !mStart.isValid()) {
      return;
    }

    const params = {
      station: station.id,
      parameter,
      start: mStart.format("YYYY-MM-DDTHH:mm"),
      end: mEnd.format("YYYY-MM-DDTHH:mm"),
      grouping_interval: groupingInterval,
      aggregation_func: aggregationFunc,
    };

    const filename = "data.csv";

    try {
      const response = await axios.get(buildApiUrl(`/stations/measurements/summary`), {
        params,
        headers: { Accept: 'text/csv' },
        responseType: 'blob'
      });
      console.log(response);
      FileDownload(response.data, filename);
    } catch (err) {
      console.error(err);
      this.props.enqueueSnackbar("Failed to download CSV file", {
        variant: "error",
      });
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

  handleStationsClick = (event) => {
    this.setState({ stationsAnchorEl: event.currentTarget });
  };

  handleStationsClose = () => {
    this.setState({ stationsAnchorEl: null });
  };

  handleStationsSelectChange = (e) => {
    const { stations } = this.state;
    const newId = e.target.value;
    const station = stations.find((st) => st.id === newId);
    this.setState({ station });
  };

  handleTimeRangeClick = (event) => {
    this.setState({ timeRangeAnchorEl: event.currentTarget });
  };

  handleTimeRangeMode = (mode) => {
    this.setState({ mode });
  };

  handleTimeRangeClose = () => {
    this.setState({ timeRangeAnchorEl: null });
  };

  handleTimeRangeLastTimeSelectChange = (e) => {
    this.setState((prevState) => ({
      realtimeParams: {
        ...prevState.realtimeParams,
        lastTime: e.target.value,
      },
    }));
  };

  handleTimeRangeStartTimeChange = (datetime) => {
    this.setState((prevState) => ({
      historicParams: { ...prevState.historicParams, start: datetime },
    }));
  };

  handleTimeRangeEndTimeChange = (datetime) => {
    this.setState((prevState) => ({
      historicParams: { ...prevState.historicParams, end: datetime },
    }));
  };

  handleAggregationFunctionSelectChange = (e) => {
    this.setState({ aggregationFunc: e.target.value });
  };

  handleGroupingIntervalSelectChange = (e) => {
    this.setState({ groupingInterval: e.target.value });
  };

  handleDownloadClick = () => {
    this.downloadCSV();
  }

  handleDashboardClick = () => {
    const { router } = this.props;
    const { query } = router;

    router.push({
      pathname: "/stations/dashboard",
      query,
    });
  }

  getValidTimeRangeParameters() {
    const { query } = this.props
    let {
      mode,
      lastTime,
      start,
      end,
      aggFunc,
      groupInt } = query;

    if (!["realtime", "historic"].includes(mode)) {
      mode = DEFAULT_MODE;
    }
    if (!Object.keys(lastTimeItems).includes(lastTime)) {
      lastTime = DEFAULT_RT_LAST_TIME;
    }
    if (!Object.keys(aggregationFuncItems).includes(aggFunc)) {
      aggFunc = DEFAULT_AGG_FUNC;
    }
    if (!Object.keys(groupingIntervalItems).includes(groupInt)) {
      groupInt = DEFAULT_GROUP_INT;
    }

    start = new Date(start);
    end = new Date(end);
    if (!isDate(start) || !isDate(end)) {
      start = new Date(DEFAULT_HISTORIC_START);
      end = new Date(DEFAULT_HISTORIC_END);
    }

    return {
      mode,
      lastTime,
      start,
      end,
      aggregationFunc: aggFunc,
      groupingInterval: groupInt
    }
  }

  pushNewRoute() {
    const {
      station,
      mode,
      realtimeParams: { lastTime },
      historicParams: { start, end },
      groupingInterval,
      aggregationFunc
    } = this.state;

    const { router } = this.props;
    const { pathname, query } = router;

    router.push({
      pathname,
      query: {
        ...query,
        id: station.id,
        mode,
        lastTime,
        start,
        end,
        groupInt: groupingInterval,
        aggFunc: aggregationFunc
      }
    });
  }

  render() {
    const { classes } = this.props;
    const {
      loading,
      stations,
      station,
      stationsAnchorEl,
      timeRangeAnchorEl,
      mode,
      realtimeParams,
      historicParams,
      groupingInterval,
      aggregationFunc,
    } = this.state;

    const timeRangeParams =
      mode === "realtime" ? realtimeParams : historicParams;

    return (
      <React.Fragment>
        <Head>
          <title>
            {appName} -
            {station
              ? `Dashboard: ${station.name}`
              : `Estaciones Meteorológicas`}
          </title>
        </Head>
        <CssBaseline />
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" color="inherit" noWrap>
              {station
                ? `Datos: ${station.name}`
                : `Cargando datos...`}
            </Typography>
            <div className={classes.grow} />
            <div className={classes.rightButtons}>
              <StationsFilterButton
                value={station && station.id}
                stations={stations}
                popoverOpen={Boolean(stationsAnchorEl)}
                anchorEl={stationsAnchorEl}
                onClick={this.handleStationsClick}
                onPopoverClose={this.handleStationsClose}
                onSelectChange={this.handleStationsSelectChange}
              />
              <TimeRangeFilterButton
                mode={mode}
                realtimeParams={realtimeParams}
                historicParams={historicParams}
                aggregationFunc={aggregationFunc}
                groupingInterval={groupingInterval}
                popoverOpen={Boolean(timeRangeAnchorEl)}
                anchorEl={timeRangeAnchorEl}
                onPopoverClose={this.handleTimeRangeClose}
                onClick={this.handleTimeRangeClick}
                onModeChange={this.handleTimeRangeMode}
                onLastTimeSelectChange={
                  this.handleTimeRangeLastTimeSelectChange
                }
                onStartTimeChange={this.handleTimeRangeStartTimeChange}
                onEndTimeChange={this.handleTimeRangeEndTimeChange}
                onAggregationFunctionSelectChange={
                  this.handleAggregationFunctionSelectChange
                }
                onGroupingIntervalSelectChange={
                  this.handleGroupingIntervalSelectChange
                }
              />
            </div>
            <AppbarButtons />
          </Toolbar>
        </AppBar>
        <main>
          <DataToolbar onDownloadClick={this.handleDownloadClick} onDashboardClick={this.handleDashboardClick} />
          {!loading && station ? (
            <div className={classNames(classes.layout, classes.cardGrid)}>
              <StationTable
                stationId={station.id}
                parameters={stationParameters}
                mode={mode}
                timeRangeParams={timeRangeParams}
                groupingInterval={groupingInterval}
                aggregationFunc={aggregationFunc}
              ></StationTable>
            </div>
          ) : (
              <LinearProgress />
            )}
        </main>
      </React.Fragment>
    );
  }
}

StationsData.propTypes = {
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
};

StationsData = withRouter(StationsData);
StationsData = withSnackbar(StationsData);
StationsData = withStyles(styles)(StationsData);

export default StationsData;
