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
import { LineChart, XAxis, YAxis, CartesianGrid, Line } from "recharts";
import StationsFilterButton from "../components/StationsFilterButton";
import TimeRangeFilterButton from "../components/TimeRangeFilterButton";

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

const axisStyle = {
  fontSize: 12,
  fontWeight: 500,
  fontFamily: "Roboto, sans-serif",
};

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
    stationsAnchorEl: null,
    data: {
      temperature: [
        { ts: "2020-04-01", uv: 400, pv: 2400 },
        { ts: "2020-04-02", uv: 200, pv: 1400 },
        { ts: "2020-04-03", uv: 100, pv: 1200 },
        { ts: "2020-04-04", uv: 600, pv: 1700 },
        { ts: "2020-04-05", uv: 800, pv: 3400 },
        { ts: "2020-04-06", uv: 480, pv: 4400 },
      ],
      humidity: [
        { ts: "2020-04-01", uv: 400, pv: 2400 },
        { ts: "2020-04-02", uv: 200, pv: 1400 },
        { ts: "2020-04-03", uv: 100, pv: 1200 },
        { ts: "2020-04-04", uv: 600, pv: 1700 },
        { ts: "2020-04-05", uv: 800, pv: 3400 },
        { ts: "2020-04-06", uv: 480, pv: 4400 },
      ],
      wind_speed: [
        { ts: "2020-04-01", uv: 400, pv: 2400 },
        { ts: "2020-04-02", uv: 200, pv: 1400 },
        { ts: "2020-04-03", uv: 100, pv: 1200 },
        { ts: "2020-04-04", uv: 600, pv: 1700 },
        { ts: "2020-04-05", uv: 800, pv: 3400 },
        { ts: "2020-04-06", uv: 480, pv: 4400 },
      ],
      wind_direction: [
        { ts: "2020-04-01", uv: 400, pv: 2400 },
        { ts: "2020-04-02", uv: 200, pv: 1400 },
        { ts: "2020-04-03", uv: 100, pv: 1200 },
        { ts: "2020-04-04", uv: 600, pv: 1700 },
        { ts: "2020-04-05", uv: 800, pv: 3400 },
        { ts: "2020-04-06", uv: 480, pv: 4400 },
      ],
      pressure: [
        { ts: "2020-04-01", uv: 400, pv: 2400 },
        { ts: "2020-04-02", uv: 200, pv: 1400 },
        { ts: "2020-04-03", uv: 100, pv: 1200 },
        { ts: "2020-04-04", uv: 600, pv: 1700 },
        { ts: "2020-04-05", uv: 800, pv: 3400 },
        { ts: "2020-04-06", uv: 480, pv: 4400 },
      ],
      precipitation: [
        { ts: "2020-04-01", uv: 400, pv: 2400 },
        { ts: "2020-04-02", uv: 200, pv: 1400 },
        { ts: "2020-04-03", uv: 100, pv: 1200 },
        { ts: "2020-04-04", uv: 600, pv: 1700 },
        { ts: "2020-04-05", uv: 800, pv: 3400 },
        { ts: "2020-04-06", uv: 480, pv: 4400 },
      ],
      pm25: [
        { ts: "2020-04-01", uv: 400, pv: 2400 },
        { ts: "2020-04-02", uv: 200, pv: 1400 },
        { ts: "2020-04-03", uv: 100, pv: 1200 },
        { ts: "2020-04-04", uv: 600, pv: 1700 },
        { ts: "2020-04-05", uv: 800, pv: 3400 },
        { ts: "2020-04-06", uv: 480, pv: 4400 },
      ],
    },
  };

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
    const { data, stationsAnchorEl, timeRangeAnchorEl } = this.state;

    const stationsOpen = Boolean(stationsAnchorEl);
    const timeRangeOpen = Boolean(timeRangeAnchorEl);

    return (
      <React.Fragment>
        <CssBaseline />
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" color="inherit" noWrap>
              GeoLomas - Dashboard de Estaciones Meteorológicas
            </Typography>
            <div className={classes.grow} />
            <div className={classes.rightButtons}>
              <StationsFilterButton
                onClick={this.handleStationsClick}
                popoverOpen={stationsOpen}
                anchorEl={stationsAnchorEl}
                onPopoverClose={this.handleStationsClose}
              />
              <TimeRangeFilterButton
                onClick={this.handleTimeRangeClick}
                popoverOpen={timeRangeOpen}
                anchorEl={timeRangeAnchorEl}
                onPopoverClose={this.handleTimeRangeClose}
              />
            </div>
          </Toolbar>
        </AppBar>
        <main>
          <div className={classNames(classes.layout, classes.cardGrid)}>
            <Grid container spacing={16}>
              {plots.map((plot) => (
                <Grid item key={plot.key} sm={6} md={4} lg={4}>
                  <Card className={classes.card}>
                    <CardContent className={classes.cardContent}>
                      <Typography gutterBottom variant="h6" component="h6">
                        {plot.title}
                      </Typography>
                      <LineChart width={400} height={300} data={data[plot.key]}>
                        <XAxis dataKey="ts" style={axisStyle} />
                        <YAxis style={axisStyle} />
                        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                        <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
                      </LineChart>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        </main>
      </React.Fragment>
    );
  }
}

StationsDashboard.getInitialProps = async () => ({
  namespacesRequired: ["common"],
});

StationsDashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StationsDashboard);
