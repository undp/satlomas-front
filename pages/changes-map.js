import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Head from "next/head";
import {
  Fab,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Select,
  MenuItem,
  FormControl,
  TextField,
  InputLabel,
  Typography,
  FilledInput,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import LayersIcon from "@material-ui/icons/Layers";
import RemoveIcon from "@material-ui/icons/Remove";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import classnames from "classnames";
import axios from "axios";
import dynamic from "next/dynamic";
import { withAuthSync } from "../utils/auth";
import { buildApiUrl } from "../utils/api";

import MapDrawer from "../components/MapDrawer";
import SearchFab from "../components/SearchFab";
import LoadingProgress from "../components/LoadingProgress";
import Dashboard from "../components/Dashboard";

const drawerWidth = 360;
const mapboxStyle = "mapbox.streets";

const Map = dynamic(() => import("../components/Map"), {
  ssr: false,
  loadingProgress: <LoadingProgress />,
});

const styles = (theme) => ({
  controlGroup: {
    position: "fixed",
    zIndex: 1000,
  },
  topLeft: {
    top: theme.spacing.unit,
    left: theme.spacing.unit,
  },
  topRight: {
    top: theme.spacing.unit,
    right: theme.spacing.unit,
  },
  bottomLeft: {
    bottom: theme.spacing.unit,
    left: theme.spacing.unit,
  },
  bottomRight: {
    bottom: theme.spacing.unit,
    right: theme.spacing.unit
  },
  fabContainer: {
    display: "block",
  },
  fab: {
    margin: theme.spacing.unit,
  },
  searchAndDateControl: {
    display: "flex",
    flexWrap: "wrap",
    margin: theme.spacing.unit,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 350,
  },
  textField: {
    margin: theme.spacing.unit,
  },
  drawerPaper: {
    width: 360,
  },
  plotsControl: {
    width: 360,
  },
  plotsControlHeading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  },
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

let DateField = ({
  classes,
  dates,
  onChangeFrom: onFromChange,
  onChangeTo: onToChange,
}) => {
  const createSelect = () => {
    let items = [];
    for (let i = 0; i <= dates.availableDates.length - 1; i++) {
      items.push(
        <MenuItem key={i} value={dates.availableDates[i]}>
          {dates.availableDates[i]}
        </MenuItem>
      );
    }
    return items;
  };

  return (
    <>
      <TextField
        id="date_from"
        label="Date from"
        type="date"
        defaultValue={dates.dashboardDateFrom.toISOString().slice(0, 10)}
        className={classes.textField}
        onChange={onFromChange}
        variant="filled"
        InputProps={{
          inputProps: {
            min: dates.initDate.toISOString().slice(0, 10),
            max: dates.dashboardDateTo.toISOString().slice(0, 10),
          },
        }}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        id="date_to"
        label="Date to"
        type="date"
        defaultValue={dates.dashboardDateTo.toISOString().slice(0, 10)}
        className={classes.textField}
        onChange={onToChange}
        variant="filled"
        InputProps={{
          inputProps: {
            min: dates.dashboardDateFrom.toISOString().slice(0, 10),
            max: dates.endDate.toISOString().slice(0, 10),
          },
        }}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="map-date">Fecha del mapa</InputLabel>
        <Select
          value={dates.availableDates[0]}
          input={<FilledInput id="map-date" />}
        >
          {createSelect()}
        </Select>
      </FormControl>
    </>
  );
};

DateField = withStyles(styles)(DateField);

class SearchControl extends Component {
  createSelectTypes = () => {
    let items = [];
    for (let i = 0; i <= this.props.scopes.types.length - 1; i++) {
      items.push(
        <MenuItem key={i} value={i}>
          {this.props.scopes.types[i]["name"]}
        </MenuItem>
      );
    }
    return items;
  };

  createSelectScopes = (pos) => {
    let items = [];
    for (
      let i = 0;
      i <= this.props.scopes.types[pos]["scopes"].length - 1;
      i++
    ) {
      items.push(
        <MenuItem key={i} value={i}>
          {this.props.scopes.types[pos]["scopes"][i]["name"]}
        </MenuItem>
      );
    }
    return items;
  };

  render() {
    const {
      classes,
      scopes,
      dates,
      onChangeFrom,
      onChangeTo,
      selectTypeChange,
      selectScopeChange,
    } = this.props;

    const scopeType = scopes.types[scopes.selectedType];
    const scopeItems = scopeType ? scopeType["scopes"] : [];

    return (
      <div className={classes.searchAndDateControl}>
        {/* <SearchField /> */}
        <FormControl variant="filled" className={classes.formControl}>
          <InputLabel htmlFor="scope-type">Tipo de Ámbito</InputLabel>
          <Select
            value={scopes.selectedType}
            onChange={selectTypeChange}
            input={<FilledInput id="scope-type" />}
          >
            {this.createSelectTypes()}
          </Select>
        </FormControl>
        <FormControl variant="filled" className={classes.formControl}>
          <InputLabel htmlFor="scope">Ámbito</InputLabel>
          {scopeItems.length > 0 ? (
            <Select
              onChange={selectScopeChange}
              value={scopes.selectedScope != null ? scopes.selectedScope : 0}
              input={<FilledInput id="scope" />}
            >
              {this.createSelectScopes(scopes.selectedType)}
            </Select>
          ) : (
              <Select value="-1" input={<FilledInput id="scope" />} />
            )}
        </FormControl>
        <DateField
          dates={dates}
          onChangeFrom={onChangeFrom}
          onChangeTo={onChangeTo}
        />
      </div>
    );
  }
}

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

let PlotsControl = ({ classes, dates, scope, custom_scope }) => (
  <div className={classnames(classes.controlGroup, classes.topRight, classes.plotsControl)}>
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.plotsControlHeading}>Serie de tiempo</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Dashboard
          dateFrom={dates.dashboardDateFrom}
          dateTo={dates.dashboardDateTo}
          scope={scope}
          custom_scope={custom_scope}
        />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  </div>
);

PlotsControl = withStyles(styles)(PlotsControl);

class ChangesMap extends Component {
  state = {
    map: null,
    bounds: null,
    viewport: {
      center: [-12.046373, -76.542755],
      zoom: 10,
    },
    drawerOpen: false,
    dates: {
      dashboardDateFrom: null,
      dashboardDateTo: null,
      availableDates: [],
      allAvaibleDates: [],
      initDate: null,
      endDate: null,
    },
    scopes: {
      types: [],
      selectedType: null,
      selectedScope: null,
      scope: null,
    },
    scopesLoaded: false,
    customScope: null,
    loadDrawer: false,
    mapDate: null,
    loadSearchDate: false,
  };

  static getInitialProps = async () => ({
    namespacesRequired: ["common"],
  });

  getDates = async () => {
    const response = await axios.get(
      buildApiUrl("/scopes/available-dates/"),
      {}
    );
    const dates = {
      firstDate: new Date(response.data.first_date),
      lastDate: new Date(response.data.last_date),
      availables: response.data.availables,
    };
    return dates;
  };

  getScopes = async () => {
    const response = await axios.get(buildApiUrl("/scopes/types/"), {});
    const types = response.data;
    const scope = types[0] && types[0]["scopes"][0]["pk"];

    this.setState((prevState) => ({
      scopes: {
        ...prevState.scopes,
        types,
        scope,
        selectedType: 0,
        selectedScope: 0,
      },
      scopesLoaded: true,
    }));
  };

  componentDidMount = async () => {
    this.getScopes();

    let dates = await this.getDates();

    // Get first day of the current month or the most recent date
    let today = new Date();
    today.setDate(1);
    if (today > dates.lastDate) {
      today = new Date(dates.lastDate);
    }

    // Get six months ago or the first available date, for the time series plot
    let sixmonthago = new Date();
    sixmonthago.setMonth(today.getMonth() - 6);
    if (sixmonthago < dates.firstDate) {
      sixmonthago = new Date(dates.firstDate);
    }

    // Build list of available dates
    let availableDates = [];
    let reference_date = new Date(sixmonthago);
    while (reference_date < today) {
      if (dates.availables.includes(reference_date.toISOString().slice(0, 7))) {
        availableDates.push(reference_date.toISOString().slice(0, 7));
      }
      reference_date.setMonth(reference_date.getMonth() + 1);
    }
    this.setState({
      dates: {
        dashboardDateFrom: sixmonthago,
        dashboardDateTo: today,
        initDate: dates.firstDate,
        endDate: dates.lastDate,
        availableDates: availableDates,
        allAvaibleDates: dates.availables,
      },
      mapDate: today,
      selected_scope: 1,
      custom_scope: null,
      loadDrawer: true,
      loadSearchDate: true,
    });
  };

  onChangeFrom = (event) => {
    let date_from = new Date(event.target.value + " 00:00:00");
    let availableDates = [];
    while (date_from < this.state.dates.endDate) {
      if (
        this.state.dates.allAvaibleDates.includes(
          date_from.toISOString().slice(0, 7)
        )
      ) {
        availableDates.push(date_from.toISOString().slice(0, 7));
      }
      date_from.setMonth(date_from.getMonth() + 1);
    }
    this.setState({
      dates: {
        ...this.state.dates,
        dashboardDateFrom: new Date(event.target.value + " 00:00:00"),
        availableDates: availableDates,
      },
    });
  };

  onChangeTo = (event) => {
    let date_to = new Date(event.target.value + " 00:00:00");
    let availableDates = [];
    let { initDate } = this.state.dates;
    while (initDate < date_to) {
      if (
        this.state.dates.allAvaibleDates.includes(
          initDate.toISOString().slice(0, 7)
        )
      ) {
        availableDates.push(initDate.toISOString().slice(0, 7));
      }
      initDate.setMonth(initDate.getMonth() + 1);
    }
    this.setState({
      dates: {
        ...this.state.dates,
        dashboardDateTo: date_to,
        availableDates: availableDates,
      },
    });
  };

  selectTypeChange = (event) => {
    let s = this.state.scopes.types[event.target.value]["scopes"][0]["pk"];
    this.setState({
      scopes: {
        ...this.state.scopes,
        selectedScope: 0,
        selectedType: event.target.value,
        scope: s,
      },
    });
  };

  selectScopeChange = (event) => {
    let s = this.state.scopes.types[this.state.scopes.selectedType]["scopes"][
      event.target.value
    ]["pk"];
    this.setState({
      scopes: {
        ...this.state.scopes,
        selectedScope: event.target.value,
        scope: s,
      },
    });
  };

  handleSearchFabClick = (e) => {
    this.setState((prevState) => ({ drawerOpen: !prevState.drawerOpen }));
  };

  handleMapDrawerClose = (e) => {
    this.setState({ drawerOpen: false });
  };

  handleMapViewportChanged = (viewport) => {
    this.setState({ viewport });
  };

  render() {
    const { classes } = this.props;
    const {
      viewport,
      bounds,
      dates,
      drawerOpen,
      loadDrawer,
      customScope,
      loadSearchDate,
      scopesLoaded,
      scopes,
    } = this.state;

    return (
      <div className="index">
        <Head>
          <title>GeoLomas Platform - Mapa de Cambios</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
        </Head>
        <div className={classnames(classes.controlGroup, classes.topLeft)}>
          <SearchFab size="medium" onClick={this.handleSearchFabClick} />
        </div>
        <MapDrawer
          open={drawerOpen}
          onClose={this.handleMapDrawerClose}
          width={drawerWidth}
        >
          {loadSearchDate && scopesLoaded && (
            <SearchControl
              scopes={scopes}
              dates={dates}
              onChangeFrom={this.onChangeFrom}
              onChangeTo={this.onChangeTo}
              selectTypeChange={this.selectTypeChange}
              selectScopeChange={this.selectScopeChange}
            />
          )}
        </MapDrawer>
        <div className={classnames(classes.controlGroup, classes.bottomLeft)}>
          <ZoomControl />
          <LayersControl />
        </div>
        {loadDrawer && (
          <PlotsControl
            dates={dates}
            scope={scopes.scope}
            custom_scope={customScope}
          />
        )}
        <Map
          className={classes.map}
          bounds={bounds}
          viewport={viewport}
          onViewportChanged={this.handleMapViewportChanged}
          mapboxStyle={mapboxStyle}
        />
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

ChangesMap = withStyles(styles)(ChangesMap);
ChangesMap = withAuthSync(ChangesMap, { redirect: false });

export default ChangesMap;
