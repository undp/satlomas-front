import Fab from "@material-ui/core/Fab";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Drawer from "@material-ui/core/Drawer";
import AddIcon from "@material-ui/icons/Add";
import LayersIcon from "@material-ui/icons/Layers";
import RemoveIcon from "@material-ui/icons/Remove";
import Head from "next/head";
import React, { Component } from "react";
import SearchField from "../components/SearchField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import { withAuthSync } from "../utils/auth";

const drawerWidth = 450;

const styles = theme => ({
  searchAndDateControl: {
    position: "fixed",
    top: theme.spacing.unit,
    left: theme.spacing.unit
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 300
  },
  topRightControlGroup: {
    position: "fixed",
    top: theme.spacing.unit,
    right: theme.spacing.unit
  },
  bottomLeftControlGroup: {
    position: "fixed",
    bottom: theme.spacing.unit,
    left: theme.spacing.unit
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
    width: 320
  },
  selectsField: {
    padding: "2px 4px",
    margin: "10px",
    display: "flex",
    alignItems: "center",
    width: 320
  },
  textField: {
    margin: theme.spacing.unit
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  }
});

let ZoomControl = ({ classes }) => (
  <div>
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

let DateField = ({ classes }) => (
  <Paper className={classes.dateField}>
    <TextField
      id="date"
      style={{ width: 300 }}
      defaultValue="November 2019"
      className={classes.textField}
      InputLabelProps={{
        shrink: true
      }}
    />
    {/* <TextField
      id="date"
      defaultValue="April 2019"
      className={classes.textField}
      InputLabelProps={{
        shrink: true
      }}
    /> */}
  </Paper>
);

DateField = withStyles(styles)(DateField);

let SearchControl = ({ classes }) => (
  <div className={classes.searchAndDateControl}>
    {/* <SearchField /> */}
    <Paper className={classes.selectsField}>
      <FormControl variant="outlined" className={classes.formControl}>
        <Select value="eco">
          <MenuItem value="eco">Corredores Ecológicos</MenuItem>
        </Select>
      </FormControl>
    </Paper>
    <Paper className={classes.selectsField}>
      <FormControl variant="outlined" className={classes.formControl}>
        <Select value="sur">
          <MenuItem value="sur">Lomas del Sur</MenuItem>
        </Select>
      </FormControl>
    </Paper>
    <DateField />
  </div>
);

SearchControl = withStyles(styles)(SearchControl);

let LayersControl = ({ classes }) => (
  <div>
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

let PlotsDrawer = ({ classes }) => (
  <Drawer
    className={classes.drawer}
    variant="permanent"
    classes={{
      paper: classes.drawerPaper
    }}
    anchor="right"
  ></Drawer>
);

PlotsDrawer = withStyles(styles)(PlotsDrawer);

class MapMockup extends Component {
  render() {
    const { classes } = this.props;

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
        <div className={classes.bottomLeftControlGroup}>
          <ZoomControl />
          <LayersControl />
        </div>
        <PlotsDrawer />
        <img id="map" src="/static/mockup/verde2.png" />
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
