import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Head from "next/head";
import axios from "axios";
import {
  AppBar,
  Card,
  CardContent,
  CssBaseline,
  Grid,
  Toolbar,
  Typography,
  LinearProgress,
  Button,
} from "@material-ui/core";
import SitesFilterButton from "../../components/SitesFilterButton";
import TimeRangeFilterButton, {
  DEFAULT_MODE,
  DEFAULT_HISTORIC_START,
  DEFAULT_HISTORIC_END,
  DEFAULT_AGG_FUNC,
  DEFAULT_GROUP_INT,
  DEFAULT_RT_LAST_TIME,
  lastTimeItems,
  aggregationFuncItems,
  groupingIntervalItems,
} from "../../components/TimeRangeFilterButton";
import ParameterCardContent from "../../components/ParameterCardContent";
import { withRouter } from "next/router";
import { withStyles } from "@material-ui/core/styles";
import { withSnackbar } from "notistack";
import { buildApiUrl } from "../../utils/api";
import { isDate } from "../../utils/date";
import AppBarButtons from "../../components/AppBarButtons";
import config from "../../config";

const { stationParameters, appName, refreshIntervalMs } = config;

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
  },
});

let DataToolbar = ({ classes, onTableClick }) => (
  <div>
    <Button onClick={onTableClick} className={classes.button}>
      Tabla
    </Button>
  </div>
);
DataToolbar = withStyles(styles)(DataToolbar);

class SitesDashboard extends React.Component {
  state = {
    loading: true,
    site: null,
    mode: DEFAULT_MODE,
    realtimeParams: { now: new Date(), lastTime: DEFAULT_RT_LAST_TIME },
    historicParams: {
      start: new Date(DEFAULT_HISTORIC_START),
      end: new Date(DEFAULT_HISTORIC_END),
    },
    aggregationFunc: DEFAULT_AGG_FUNC,
    groupingInterval: DEFAULT_GROUP_INT,
    sitesAnchorEl: null,
    data: {},
  };

  static async getInitialProps({ query }) {
    return { namespacesRequired: ["common"], query };
  }

  async componentDidMount() {
    await this.fetchSites();

    const { query } = this.props;

    // Set site filter based on query param
    const { sites } = this.state;
    const site =
      sites &&
      (query.id
        ? sites.find((site) => site.id === Number(query.id))
        : sites[0]);

    // Set time range filter based on query param
    const { mode, lastTime, start, end, aggregationFunc, groupingInterval } =
      this.getValidTimeRangeParameters();

    this.setState((prevState) => ({
      loading: false,
      site,
      mode,
      realtimeParams: { ...prevState.realtimeParams, lastTime },
      historicParams: { ...prevState.historicParams, start, end },
      aggregationFunc,
      groupingInterval,
    }));

    if (mode === "realtime") {
      this.setRealtimeMode();
    } else if (mode === "historic") {
      this.setHistoricMode();
    }
  }

  componentDidUpdate(_prevProps, prevState) {
    const {
      site,
      mode,
      realtimeParams: { lastTime },
      historicParams: { start, end },
      aggregationFunc,
      groupingInterval,
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
      site != prevState.site ||
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
    this.rtInterval = setInterval(() => this.updateNow(), refreshIntervalMs);
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

  async fetchSites() {
    try {
      const response = await axios.get(buildApiUrl("/stations/sites/"));
      this.setState({ sites: response.data });
    } catch (error) {
      this.props.enqueueSnackbar("Failed to fetch sites", {
        variant: "error",
      });
    }
  }

  handleSitesClick = (event) => {
    this.setState({ sitesAnchorEl: event.currentTarget });
  };

  handleSitesClose = () => {
    this.setState({ sitesAnchorEl: null });
  };

  handleSitesSelectChange = (e) => {
    const { sites } = this.state;
    const newId = e.target.value;
    const site = sites.find((st) => st.id === newId);
    this.setState({ site });
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

  handleTableClick = () => {
    const { router } = this.props;
    const { query } = router;

    router.push({
      pathname: "/stations/data",
      query,
    });
  };

  pushNewRoute() {
    const {
      site,
      mode,
      realtimeParams: { lastTime },
      historicParams: { start, end },
      groupingInterval,
      aggregationFunc,
    } = this.state;

    const { router } = this.props;
    const { pathname, query } = router;

    router.push({
      pathname,
      query: {
        ...query,
        id: site.id,
        mode,
        lastTime,
        start,
        end,
        groupInt: groupingInterval,
        aggFunc: aggregationFunc,
      },
    });
  }

  getValidTimeRangeParameters() {
    const { query } = this.props;
    let { mode, lastTime, start, end, aggFunc, groupInt } = query;

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
      groupingInterval: groupInt,
    };
  }

  render() {
    const { classes } = this.props;
    const {
      loading,
      sites,
      site,
      sitesAnchorEl,
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
            {appName} -{" "}
            {site ? `Dashboard: ${site.name}` : `Estaciones Meteorológicas`}
          </title>
        </Head>
        <CssBaseline />
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" color="inherit" noWrap>
              {site ? `Dashboard: ${site.name}` : `Cargando datos...`}
            </Typography>
            <div className={classes.grow} />
            <div className={classes.rightButtons}>
              <SitesFilterButton
                value={site && site.id}
                sites={sites}
                popoverOpen={Boolean(sitesAnchorEl)}
                anchorEl={sitesAnchorEl}
                onClick={this.handleSitesClick}
                onPopoverClose={this.handleSitesClose}
                onSelectChange={this.handleSitesSelectChange}
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
            <AppBarButtons />
          </Toolbar>
        </AppBar>
        <main>
          <DataToolbar onTableClick={this.handleTableClick} />

          {!loading && site ? (
            <div className={classNames(classes.layout, classes.cardGrid)}>
              <Grid container spacing={2}>
                {stationParameters.map((param) => (
                  <Grid item key={param.id} sm={6} md={4} lg={4}>
                    <Card className={classes.card}>
                      <CardContent className={classes.cardContent}>
                        <Typography gutterBottom variant="h6" component="h6">
                          {param.name}
                        </Typography>
                        <ParameterCardContent
                          siteId={site.id}
                          parameter={param.id}
                          mode={mode}
                          timeRangeParams={timeRangeParams}
                          groupingInterval={groupingInterval}
                          aggregationFunc={aggregationFunc}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </div>
          ) : (
            <LinearProgress />
          )}
        </main>
      </React.Fragment>
    );
  }
}

SitesDashboard.propTypes = {
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
};

SitesDashboard = withRouter(SitesDashboard);
SitesDashboard = withSnackbar(SitesDashboard);
SitesDashboard = withStyles(styles)(SitesDashboard);

export default SitesDashboard;
