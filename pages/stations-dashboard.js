import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import AppBar from "@material-ui/core/AppBar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import StationsFilterButton from "../components/StationsFilterButton";
import TimeRangeFilterButton from "../components/TimeRangeFilterButton";
import Head from "next/head";
import axios from "axios";
import { buildApiUrl } from "../utils/api";
import LinearProgress from "@material-ui/core/LinearProgress";
import ParameterPlot from "../components/ParameterPlot";

const styles = (theme) => ({
  appBar: {
    position: "relative",
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    [theme.breakpoints.up(1500 + theme.spacing.unit * 3 * 2)]: {
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
      marginLeft: theme.spacing.unit,
      width: "auto",
    },
  },
  cardGrid: {
    padding: `${theme.spacing.unit * 3}px 0`,
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
    padding: theme.spacing.unit * 6,
  },
  body: {
    fontFamily: "Roboto, sans-serif",
    fontSize: 10,
  },
});

const plots = [
  {
    key: "temperature",
    title: "Temperatura de Ambiente",
  },
  {
    key: "humidity",
    title: "Humedad Relativa",
  },
  {
    key: "wind_speed",
    title: "Velocidad del Viento",
  },
  {
    key: "wind_direction",
    title: "Dirección del Viento",
  },
  {
    key: "pressure",
    title: "Presión Atmosférica",
  },
  {
    key: "precipitation",
    title: "Precipitaciones (niebla)",
  },
  {
    key: "pm25",
    title: "Material Particulado (PM2.5)",
  },
];

class StationsDashboard extends React.Component {
  state = {
    loading: true,
    station: null,
    timeRange: null,
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
    // console.log("Stations:", stations);
    const station = query.id
      ? stations.find((station) => station.id === Number(query.id))
      : stations[0];
    // console.log("Current station:", station);

    // Set time range filter based on query param
    // TODO...

    this.setState({ station });

    this.setState({ loading: false });
  }

  async fetchStations() {
    try {
      const response = await axios.get(buildApiUrl("/stations/"));
      this.setState({ stations: response.data });
    } catch (error) {
      // TODO Raise an error modal
    }
  }

  handleStationsClick = (event) => {
    this.setState({
      stationsAnchorEl: event.currentTarget,
    });
  };

  handleStationsClose = () => {
    this.setState({
      stationsAnchorEl: null,
    });
  };

  handleStationsSelectChange = (e) => {
    const { stations } = this.state;
    const newId = e.target.value;
    const station = stations.find((st) => st.id === newId);
    this.setState({ station });
  };

  handleTimeRangeClick = (event) => {
    this.setState({
      timeRangeAnchorEl: event.currentTarget,
    });
  };

  handleTimeRangeClose = () => {
    this.setState({
      timeRangeAnchorEl: null,
    });
  };

  render() {
    const { classes } = this.props;
    const {
      loading,
      stations,
      station,
      stationsAnchorEl,
      timeRangeAnchorEl,
    } = this.state;

    // FIXME Move to state
    const start = "2011-01-01T00:00";
    const end = "2012-01-01T00:00";
    const groupingInterval = "month";
    const aggregationFunc = "avg";

    return (
      <React.Fragment>
        <Head>
          <title>
            {station
              ? `GeoLomas - Dashboard: ${station.name}`
              : `GeoLomas - Dashboard de Estaciones`}
          </title>
        </Head>
        <CssBaseline />
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" color="inherit" noWrap>
              {station
                ? `Dashboard: ${station.name}`
                : `Dashboard de Estaciones Meteorológicas`}
            </Typography>
            <div className={classes.grow} />
            <div className={classes.rightButtons}>
              <StationsFilterButton
                stations={stations}
                selectedStation={station}
                onSelectChange={this.handleStationsSelectChange}
                onClick={this.handleStationsClick}
                popoverOpen={Boolean(stationsAnchorEl)}
                anchorEl={stationsAnchorEl}
                onPopoverClose={this.handleStationsClose}
              />
              <TimeRangeFilterButton
                onClick={this.handleTimeRangeClick}
                popoverOpen={Boolean(timeRangeAnchorEl)}
                anchorEl={timeRangeAnchorEl}
                onPopoverClose={this.handleTimeRangeClose}
              />
            </div>
          </Toolbar>
        </AppBar>
        <main>
          {!loading && station ? (
            <div className={classNames(classes.layout, classes.cardGrid)}>
              <Grid container spacing={16}>
                {plots.map((plot) => (
                  <Grid item key={plot.key} sm={6} md={4} lg={4}>
                    <Card className={classes.card}>
                      <CardContent className={classes.cardContent}>
                        <Typography gutterBottom variant="h6" component="h6">
                          {plot.title}
                        </Typography>
                        <ParameterPlot
                          station={station}
                          parameter={plot.key}
                          start={start}
                          end={end}
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

StationsDashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StationsDashboard);
