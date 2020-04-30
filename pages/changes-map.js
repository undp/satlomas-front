import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Head from "next/head";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import classnames from "classnames";
import axios from "axios";
import dynamic from "next/dynamic";
import { withAuthSync } from "../utils/auth";
import { withSnackbar } from "notistack";
import { buildApiUrl } from "../utils/api";
import LoadingProgress from "../components/LoadingProgress";
import Dashboard from "../components/Dashboard";
import ZoomControl from "../components/ZoomControl";
import LayersControl from "../components/LayersControl";
import { KeyboardDatePicker } from "@material-ui/pickers"

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

const styles = (theme) => ({
  controlGroup: {
    position: "fixed",
    zIndex: 1000,
  },
  topLeft: {
    top: theme.spacing(1),
    left: theme.spacing(1),
  },
  topRight: {
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
  bottomLeft: {
    bottom: theme.spacing(1),
    left: theme.spacing(1),
  },
  bottomRight: {
    bottom: theme.spacing(1),
    right: theme.spacing(1)
  },
  fabContainer: {
    display: "block",
  },
  fab: {
    margin: theme.spacing(1),
  },
  searchAndDateControl: {
    display: "flex",
    flexWrap: "wrap",
    margin: theme.spacing(1),
  },
  formControl: {
    margin: theme.spacing(1),
  },
  datePickerControl: {
    width: '46%',
  },
  textField: {
    margin: theme.spacing(1),
  },
  searchControl: {
    width: 450,
  },
  searchControlContent: {
    flexFlow: "column"
  },
  plotsControl: {
    width: 550,
  },
  plotsControlHeading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  },
});

class ScopePolygons extends React.Component {
  _style = feature => {
    const { selectedScope } = this.props
    const color = feature.properties.id === selectedScope ? "#fff700" : "#ff7b00";
    return {
      fillColor: "#000000",
      fillOpacity: 0.0,
      color: color,
      weight: 2
    };
  };

  _onEachFeature = (feature, layer) => {
    const { onClick } = this.props;
    const { id } = feature.properties;
    layer.on("click", () => {
      if (onClick) onClick(id);
    });
  };

  render() {
    const { type, data } = this.props;

    return (
      <GeoJSON
        key={type}
        data={data}
        style={this._style}
        onEachFeature={this._onEachFeature}
      />
    );
  }
}

class SearchControl extends Component {
  render() {
    const {
      classes,
      scopeTypes,
      selectedScopeType,
      selectedScope,
      periods,
      dateFrom,
      dateTo,
      onDateFromChange,
      onDateToChange,
      onScopeTypeSelectChange,
      onScopeSelectChange,
    } = this.props;

    const scopeTypeItems = Object.values(scopeTypes).sort(st => st.type);
    const scopeItems = scopeTypes[selectedScopeType].scopes.sort(sc => sc.name);
    const { firstDate, lastDate } = periods;

    const selectedScopeTypeName = scopeTypes[selectedScopeType].name;
    const selectedScopeName = scopeTypes[selectedScopeType].scopes.find(s => s.pk === selectedScope).name;

    return (
      <div className={classes.searchControl}>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{selectedScopeTypeName} - {selectedScopeName}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.searchControlContent}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="scope-type">Tipo de Ámbito</InputLabel>
              <Select
                value={selectedScopeType}
                onChange={onScopeTypeSelectChange}
              >
                {scopeTypeItems.map(sc => (<MenuItem key={sc.type} value={sc.type}>{sc.name}</MenuItem>))}
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="scope">Ámbito</InputLabel>
              <Select
                onChange={onScopeSelectChange}
                value={selectedScope}
              >
                {scopeItems.map(sc => (<MenuItem key={sc.pk} value={sc.pk}>{sc.name}</MenuItem>))}
              </Select>
            </FormControl>
            <div>
              <FormControl className={classnames(classes.formControl, classes.datePickerControl)}>
                <KeyboardDatePicker
                  ampm={false}
                  autoOk={true}
                  variant="inline"
                  format="YYYY-MM-DD"
                  id="date-from"
                  label="Desde"
                  minDate={firstDate}
                  maxDate={lastDate}
                  value={dateFrom}
                  onChange={onDateFromChange}
                />
              </FormControl>
              <FormControl className={classnames(classes.formControl, classes.datePickerControl)}>
                <KeyboardDatePicker
                  ampm={false}
                  autoOk={true}
                  variant="inline"
                  format="YYYY-MM-DD"
                  id="date-to"
                  label="Hasta"
                  minDate={firstDate}
                  maxDate={lastDate}
                  value={dateTo}
                  onChange={onDateToChange}
                />
              </FormControl>
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

SearchControl = withStyles(styles)(SearchControl);

let PlotsControl = ({ classes, dates, scope, custom_scope }) => (
  <div className={classes.plotsControl}>
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
    scopesLoaded: false,
    scopeTypes: {},
    selectedScopeType: null,
    selectedScope: null,
    scopeGeomsByType: {},
    periods: {},
    periodsLoaded: false,
    dateFrom: null,
    dateTo: null,
    // dates: {
    //   dashboardDateFrom: null,
    //   dashboardDateTo: null,
    //   availableDates: [],
    //   allAvaibleDates: [],
    //   initDate: null,
    //   endDate: null,
    // },
    customScope: null,
  };

  static getInitialProps = async () => ({
    namespacesRequired: ["common"],
  });

  fetchAndSetScopeTypes = async () => {
    try {
      const response = await axios.get(buildApiUrl("/scopes/types/"), {});
      const scopeTypes = response.data;
      // console.log("ScopeTypes:", scopeTypes);

      const selectedScopeType = scopeTypes[0].type;
      const selectedScope = scopeTypes[0].scopes[0].pk;

      // Convert array to an object by "type"
      let scopeTypesObj = {}
      for (let i = 0; i < scopeTypes.length; i++) {
        const sc = scopeTypes[i];
        scopeTypesObj[sc.type] = sc;
      }

      await this.setState({
        scopeTypes: scopeTypesObj,
        selectedScopeType,
        selectedScope,
        scopesLoaded: true,
      });
    } catch (err) {
      console.error(err);
      this.props.enqueueSnackbar(`Failed to get scope types`, {
        variant: "error",
      });
    }
  };

  fetchAndSetPeriods = async () => {
    try {
      const response = await axios.get(buildApiUrl("/vi-lomas/available-periods/"));
      const periodsRaw = response.data;
      const periods = {
        firstDate: new Date(periodsRaw.first_date),
        lastDate: new Date(periodsRaw.last_date),
        availables: periodsRaw.availables
      };
      // console.log("Periods:", periods);
      this.setState({
        periods,
        dateFrom: periods.firstDate,
        dateTo: periods.lastDate,
        periodsLoaded: true
      });
    } catch (err) {
      console.error(err);
      this.props.enqueueSnackbar(`Failed to get available periods`, {
        variant: "error",
      });
    }
  };

  fetchScopesGeometries = async (type) => {
    // console.log("Fetch scopes geometries for:", type);
    const res = {
      "type": "FeatureCollection",
      "features": []
    };

    try {
      const response = await axios.get(buildApiUrl("/scopes/"), { params: { type } });
      const scopes = response.data;
      // console.log("Scopes", response);
      res['features'] = scopes.map(scope => ({
        type: "Feature",
        geometry: scope.geom,
        properties: {
          id: scope.id,
          name: scope.name,
        }
      }));
    } catch (err) {
      console.error(err);
      this.props.enqueueSnackbar(`Failed to get scopes from type '${type}'`, {
        variant: "error",
      });
    }

    return res;
  }

  componentDidMount = async () => {
    this.fetchAndSetScopeTypes();
    this.fetchAndSetPeriods();
  };

  componentDidUpdate = async (_prevProps, prevState) => {
    // If selectedScopeType changed, refresh geojson layer with scopes from scopetype
    const { selectedScopeType, scopeGeomsByType } = this.state;
    if (selectedScopeType !== prevState.selectedScopeType) {
      if (!scopeGeomsByType[selectedScopeType]) {
        const geomData = await this.fetchScopesGeometries(selectedScopeType);
        this.setState({
          scopeGeomsByType: {
            ...prevState.scopeGeomsByType,
            [selectedScopeType]: geomData
          }
        });
      }
    }

    // TODO If selectedScope changed, highlight new scope and center map
  }

  handleDateFromChange = (datetime) => {
    this.setState({ dateFrom: datetime });
  };

  handleDateToChange = (datetime) => {
    this.setState({ dateTo: datetime })
  };

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

  handleScopePolygonClick = scope => {
    this.setState({ selectedScope: scope })
  }

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
      scopeTypes,
      selectedScopeType,
      selectedScope,
      scopesLoaded,
      scopeGeomsByType,
      periods,
      periodsLoaded,
      dateFrom,
      dateTo
    } = this.state;

    const loaded = scopesLoaded && periodsLoaded;
    const scopeGeomsData = scopeGeomsByType[selectedScopeType];

    return (
      <div className="index">
        <Head>
          <title>GeoLomas Platform - Mapa de Cambios</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
        </Head>
        {loaded && (<div className={classnames(classes.controlGroup, classes.topLeft)}>
          <SearchControl
            scopeTypes={scopeTypes}
            selectedScopeType={selectedScopeType}
            selectedScope={selectedScope}
            dateFrom={dateFrom}
            dateTo={dateTo}
            periods={periods}
            onDateFromChange={this.handleDateFromChange}
            onDateToChange={this.handleDateToChange}
            onScopeTypeSelectChange={this.handleScopeTypeSelectChange}
            onScopeSelectChange={this.handleScopeSelectChange}
          />
        </div>)}
        <div className={classnames(classes.controlGroup, classes.bottomLeft)}>
          <ZoomControl
            onZoomInClick={this.handleZoomInClick}
            onZoomOutClick={this.handleZoomOutClick} />
          <LayersControl
            layers={[]}
            activeLayers={[]} />
        </div>
        {loaded && (
          <div className={classnames(classes.controlGroup, classes.topRight)}>
            {/* <PlotsControl
              dates={dates}
              scope={scopes.scope}
              custom_scope={customScope}
            /> */}
          </div>
        )}
        <Map
          className={classes.map}
          bounds={bounds}
          viewport={viewport}
          onViewportChanged={this.handleMapViewportChanged}
          mapboxStyle={mapboxStyle}
        >
          {scopeGeomsData && <ScopePolygons
            type={selectedScopeType}
            selectedScope={selectedScope}
            data={scopeGeomsData}
            onClick={this.handleScopePolygonClick}
          />}
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
      </div >
    );
  }
}

ChangesMap = withStyles(styles)(ChangesMap);
ChangesMap = withSnackbar(ChangesMap);
ChangesMap = withAuthSync(ChangesMap, { redirect: false });

export default ChangesMap;
