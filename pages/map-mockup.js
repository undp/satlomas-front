import Fab from "@material-ui/core/Fab";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import AddIcon from "@material-ui/icons/Add";
import LayersIcon from "@material-ui/icons/Layers";
import RemoveIcon from "@material-ui/icons/Remove";
import Head from "next/head";
import React, { Component } from "react";
import SearchField from "../components/SearchField";
import { withAuthSync } from "../utils/auth";

const styles = theme => ({
  searchAndDateControl: {
    position: "fixed",
    top: theme.spacing.unit,
    left: theme.spacing.unit
  },
  zoomControl: {
    position: "fixed",
    top: theme.spacing.unit,
    right: theme.spacing.unit
  },
  layersControl: {
    position: "fixed",
    bottom: theme.spacing.unit,
    right: theme.spacing.unit
  },
  fabContainer: {
    display: "block"
  },
  fab: {
    margin: theme.spacing.unit
  },
  extendedIcon: {
    marginRight: theme.spacing.unit
  },
  dateField: {
    padding: "2px 4px",
    margin: "10px",
    display: "flex",
    alignItems: "center",
    width: 340
  }
});

let ZoomControl = ({ classes }) => (
  <div className={classes.zoomControl}>
    <div className={classes.fabContainer}>
      <Fab
        color="primary"
        size="small"
        aria-label="Zoom in"
        className={classes.fab}
      >
        <AddIcon />
      </Fab>
    </div>
    <div className={classes.fabContainer}>
      <Fab
        color="primary"
        size="small"
        aria-label="Zoom out"
        className={classes.fab}
      >
        <RemoveIcon />
      </Fab>
    </div>
  </div>
);

ZoomControl = withStyles(styles)(ZoomControl);

let DateField = ({ classes }) => <Paper className={classes.dateField}></Paper>;

DateField = withStyles(styles)(DateField);

let SearchControl = ({ classes }) => (
  <div className={classes.searchAndDateControl}>
    <SearchField />
    <DateField />
  </div>
);

SearchControl = withStyles(styles)(SearchControl);

let LayersControl = ({ classes }) => (
  <div className={classes.layersControl}>
    <div className={classes.fabContainer}>
      <Fab
        color="primary"
        size="small"
        aria-label="Toggle Layers"
        className={classes.fab}
      >
        <LayersIcon />
      </Fab>
    </div>
  </div>
);

LayersControl = withStyles(styles)(LayersControl);

class MapMockup extends Component {
  render() {
    return (
      <div className="index">
        <Head>
          <title>Map</title>
          <link
            rel="shortcut icon"
            type="image/x-icon"
            href="/static/favicon.ico"
          />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
        </Head>
        <SearchControl />
        <ZoomControl />
        <LayersControl />
        <img id="map" src="/static/mockup/invasiones2.png" />
        <style jsx>
          {`
            #map {
              position: absolute;
              top: 0;
              left: 0;
              height: 100vh;
              width: 100vw;
              z-index: -1;
            }
          `}
        </style>
      </div>
    );
  }
}

MapMockup = withStyles(styles)(MapMockup);
MapMockup = withAuthSync(MapMockup, { redirect: false });

export default MapMockup;
