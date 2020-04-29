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
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import classnames from "classnames";
import axios from "axios";
import dynamic from "next/dynamic";
import { withAuthSync } from "../utils/auth";
import { withSnackbar } from "notistack";
import { buildApiUrl } from "../utils/api";

import MapDrawer from "../components/MapDrawer";
import SearchFab from "../components/SearchFab";
import LoadingProgress from "../components/LoadingProgress";
import Dashboard from "../components/Dashboard";
import ZoomControl from "../components/ZoomControl";
import LayersControl from "../components/LayersControl";

const drawerWidth = 360;
const mapboxStyle = "mapbox.streets";

const Map = dynamic(() => import("../components/Map"), {
  ssr: false,
  loadingProgress: <LoadingProgress />,
});

const TileLayer = dynamic(() => import("../components/TileLayer"), {
  ssr: false,
});

const GeoJSON = dynamic(() => import("../components/GeoJSON"), {
  ssr: false
});

const someScopesData = require("../static/corredores.json");

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
    width: 550,
  },
  plotsControlHeading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  },
});

const ScopePolygons = ({ data }) => (
  <GeoJSON
    data={data}
    style={{
      fillColor: "#000000",
      fillOpacity: 0.0,
      color: "#fcba03",
      weight: 2
    }}
  />
);


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
  render() {
    const {
      classes,
      scopeTypes,
      selectedScopeType,
      selectedScope,
      // dates,
      // onChangeFrom,
      // onChangeTo,
      onScopeTypeSelectChange,
      onScopeSelectChange,
    } = this.props;

    const scopeTypeItems = Object.values(scopeTypes).sort(st => st.type);
    const scopeItems = scopeTypes[selectedScopeType].scopes.sort(sc => sc.name);

    return (
      <div className={classes.searchAndDateControl}>
        {/* <SearchField /> */}
        <FormControl variant="filled" className={classes.formControl}>
          <InputLabel htmlFor="scope-type">Tipo de Ámbito</InputLabel>
          <Select
            value={selectedScopeType}
            onChange={onScopeTypeSelectChange}
            input={<FilledInput id="scope-type" />}
          >
            {scopeTypeItems.map(sc => (<MenuItem key={sc.type} value={sc.type}>{sc.name}</MenuItem>))}
          </Select>
        </FormControl>
        <FormControl variant="filled" className={classes.formControl}>
          <InputLabel htmlFor="scope">Ámbito</InputLabel>
          <Select
            onChange={onScopeSelectChange}
            value={selectedScope}
            input={<FilledInput id="scope" />}
          >
            {scopeItems.map(sc => (<MenuItem key={sc.pk} value={sc.pk}>{sc.name}</MenuItem>))}
          </Select>
        </FormControl>
        {/* <DateField
          dates={dates}
          onChangeFrom={onChangeFrom}
          onChangeTo={onChangeTo}
        /> */}
      </div>
    );
  }
}

SearchControl = withStyles(styles)(SearchControl);

let PlotsControl = ({ classes, dates, scope, custom_scope }) => (
  <div className={classnames(classes.controlGroup, classes.topRight, classes.plotsControl)}>
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.plotsControlHeading}>Cobertura de vegetación (MODIS VI)</Typography>
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
    scopeTypes: {},
    selectedScopeType: null,
    selectedScope: null,
    scopesLoaded: false,
    // dates: {
    //   dashboardDateFrom: null,
    //   dashboardDateTo: null,
    //   availableDates: [],
    //   allAvaibleDates: [],
    //   initDate: null,
    //   endDate: null,
    // },
    customScope: null,
    loadDrawer: false,
    mapDate: null,
    loadSearchDate: false,
  };

  static getInitialProps = async () => ({
    namespacesRequired: ["common"],
  });

  fetchScopeTypes = async () => {
    try {
      const response = await axios.get(buildApiUrl("/scopes/types/"), {});
      const scopeTypes = response.data;

      const selectedScopeType = scopeTypes[0].type;
      const selectedScope = scopeTypes[0].scopes[0].pk;

      // Convert array to an object by "type"
      let scopeTypesObj = {}
      for (let i = 0; i < scopeTypes.length; i++) {
        const sc = scopeTypes[i];
        scopeTypesObj[sc.type] = sc;
      }

      this.setState({
        scopeTypes: scopeTypesObj,
        selectedScopeType,
        selectedScope,
        scopesLoaded: true,
      });
    } catch (err) {
      this.props.enqueueSnackbar(`Failed to get scope types`, {
        variant: "error",
      });
    }
  };

  fetchPeriods = async () => {
    const response = await axios.get(buildApiUrl("/vi-lomas/periods/"));
    this.setState({ periods: response.data })
  };

  componentDidMount = async () => {
    this.fetchScopeTypes();
    // this.fetchPeriods();

    /*
    // Get first day of the current month or the most recent date
    let today = new Date();
    today.setDate(1);
    if (today > lastDate) {
      today = new Date(lastDate);
    }

    // Get six months ago or the first available date, for the time series plot
    let sixmonthago = new Date();
    sixmonthago.setMonth(today.getMonth() - 6);
    if (sixmonthago < firstDate) {
      sixmonthago = new Date(firstDate);
    }

    // Build list of available dates
    let availableDates = [];
    let reference_date = new Date(sixmonthago);
    while (reference_date < today) {
      if (availables.includes(reference_date.toISOString().slice(0, 7))) {
        availableDates.push(reference_date.toISOString().slice(0, 7));
      }
      reference_date.setMonth(reference_date.getMonth() + 1);
    }
    this.setState({
      dates: {
        dashboardDateFrom: sixmonthago,
        dashboardDateTo: today,
        initDate: firstDate,
        endDate: lastDate,
        availableDates: availableDates,
        allAvaibleDates: availables,
      },
      mapDate: today,
      selected_scope: 1,
      custom_scope: null,
      loadDrawer: true,
      loadSearchDate: true,
    });
    */
  };

  handleChangeFrom = (event) => {
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

  handleChangeTo = (event) => {
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

  // componentDidUpdate(_prevProps, prevState) {
  //   // TODO If selectedScopeType changed, refresh geojson layer with scopes from scopetype
  //   // TODO If selectedScope changed, highlight new scope and center map
  // }

  handleScopeTypeSelectChange = (e) => {
    const { scopeTypes } = this.state
    const type = e.target.value;

    this.setState({
      selectedScopeType: type,
      selectedScope: scopeTypes[type].scopes[0].pk
    });
  };

  handleScopeSelectChange = (e) => {
    const scope = e.target.value;

    this.setState({ selectedScope: scope })
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

  handleZoomInClick = () => {
    this.setState((prevState) => ({
      viewport: {
        ...prevState.viewport,
        zoom: Math.min(prevState.viewport.zoom + 1, 21)
      }
    }))
  }

  handleZoomOutClick = () => {
    this.setState((prevState) => ({
      viewport: {
        ...prevState.viewport,
        zoom: Math.max(prevState.viewport.zoom - 1, 1)
      }
    }))
  }

  render() {
    const { classes } = this.props;
    const {
      viewport,
      bounds,
      dates,
      drawerOpen,
      loadDrawer,
      scopesLoaded,
      scopeTypes,
      selectedScopeType,
      selectedScope,
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
          {scopesLoaded && (
            <SearchControl
              scopeTypes={scopeTypes}
              selectedScopeType={selectedScopeType}
              selectedScope={selectedScope}
              dates={dates}
              onChangeFrom={this.handleChangeFrom}
              onChangeTo={this.handleChangeTo}
              onScopeTypeSelectChange={this.handleScopeTypeSelectChange}
              onScopeSelectChange={this.handleScopeSelectChange}
            />
          )}
        </MapDrawer>
        <div className={classnames(classes.controlGroup, classes.bottomLeft)}>
          <ZoomControl
            onZoomInClick={this.handleZoomInClick}
            onZoomOutClick={this.handleZoomOutClick} />
          <LayersControl
            layers={[]}
            activeLayers={[]} />
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
        >
          <ScopePolygons data={someScopesData} />
          {/* <TileLayer type="raster" url="http://localhost:8080/{z}/{x}/{y}.png" maxZoom={13} /> */}
        </Map>
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
ChangesMap = withSnackbar(ChangesMap);
ChangesMap = withAuthSync(ChangesMap, { redirect: false });

export default ChangesMap;
