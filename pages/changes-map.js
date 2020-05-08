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
import PeriodSlider from "../components/PeriodSlider";
import LomasPolygonsLayer from "../components/LomasPolygonsLayer"
import { KeyboardDatePicker } from "@material-ui/pickers"
import moment from "moment";
import config from "../config";

const { appName } = config;

const allTypes = ["lomas-changes", "vi-lomas-changes"];
const typeBasePaths = {
  "lomas-changes": "/lomas",
  "vi-lomas-changes": "/vi-lomas"
}

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

class ScopePolygonsLayer extends React.Component {
  _style = feature => {
    const { selectedScope } = this.props
    const isSelected = feature.properties.id === selectedScope
    const color = isSelected ? "#fff700" : "#ff7b00";
    return {
      color,
      fillColor: color,
      fillOpacity: 0.0,
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
      firstDate,
      lastDate,
      dateFrom,
      dateTo,
      onDateFromChange,
      onDateToChange,
      onScopeTypeSelectChange,
      onScopeSelectChange,
    } = this.props;

    const scopeTypeItems = Object.values(scopeTypes).sort(st => st.type);
    const scopeItems = scopeTypes[selectedScopeType].scopes.sort(sc => sc.name);

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

let PlotsControl = ({ classes, type, periods, scope, customScope }) => (
  <div className={classes.plotsControl}>
    <ExpansionPanel expanded={true}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.plotsControlHeading}>{type === "vi-lomas-changes" ? "Cobertura de vegetación (MODIS VI)" : "Cobertura de Loma Perdida"}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Dashboard
          type={type}
          periods={periods}
          scope={scope}
          customScope={customScope}
        />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  </div>
);

PlotsControl = withStyles(styles)(PlotsControl);

class ChangesMap extends Component {
  state = {
    type: null,
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
    periods: [],
    periodsLoaded: false,
    firstDate: null,
    lastDate: null,
    dateFrom: null,
    dateTo: null,
    customScope: null,
    selectedPeriodId: null,
    layers: [],
    activeLayers: ["ndvi"],
    layersOpacity: {}
  };

  static getInitialProps = async ({ query }) => ({
    namespacesRequired: ["common"],
    query
  });

  constructor(props) {
    super(props);

    let { type } = props.query;

    // Set current section based on path
    if (type && allTypes.includes(type)) {
      this.state.type = type;
    }
  }

  fetchScopeTypes = async () => {
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

  fetchPeriods = async () => {
    const { type } = this.state;
    const basePath = typeBasePaths[type]

    try {
      const response = await axios.get(buildApiUrl(`${basePath}/available-periods/`));

      const periodsRaw = response.data;
      const firstDate = new Date(periodsRaw.first_date);
      const lastDate = new Date(periodsRaw.last_date);
      const periods = periodsRaw.availables.map(p => ({
        id: p.id,
        from: new Date(p.date_from),
        to: new Date(p.date_to)
      }));

      // Select latest period by default
      const selectedPeriodId = periods.length > 0 ? periods.length - 1 : null;

      await this.setState({
        periods,
        selectedPeriodId,
        periodsLoaded: true,
        firstDate,
        lastDate,
        dateFrom: firstDate,
        dateTo: lastDate,
      });

    } catch (err) {
      console.error(err);
      this.props.enqueueSnackbar(`Failed to get available periods`, {
        variant: "error",
      });
    }
  };

  fetchAndBuildScopesGeoJSON = async (type) => {
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

  fetchRasters = async () => {
    const { type, periods, selectedPeriodId } = this.state;
    const basePath = typeBasePaths[type];

    const { from, to } = periods[selectedPeriodId];
    const params = {
      from: moment(from).utc().format("YYYY-MM-DD"),
      to: moment(to).utc().format("YYYY-MM-DD"),
    }

    try {
      const response = await axios.get(buildApiUrl(`${basePath}/rasters/`), { params });

      const layers = response.data.map(r => ({
        id: r.slug,
        name: r.name,
        tiles_url: r.tiles_url
      }))

      this.setState({ layers })

    } catch (err) {
      console.error(err);
      this.props.enqueueSnackbar(`Failed to get rasters for currrently selected period`, {
        variant: "error",
      });
    }
  }

  componentDidMount() {
    this.fetchScopeTypes();
    this.fetchPeriods();
  };

  componentDidUpdate = async (_prevProps, prevState) => {
    // If selectedScopeType changed, refresh geojson layer with scopes from scopetype
    const { selectedScopeType, scopeGeomsByType, selectedPeriodId } = this.state;

    if (selectedScopeType !== prevState.selectedScopeType) {
      if (!scopeGeomsByType[selectedScopeType]) {
        const geomData = await this.fetchAndBuildScopesGeoJSON(selectedScopeType);
        this.setState({
          scopeGeomsByType: {
            ...prevState.scopeGeomsByType,
            [selectedScopeType]: geomData
          }
        });
      }
    }

    // TODO If selectedScope changed, highlight new scope and center map

    // TODO If selectedPeriodId changed, fetch rasters from period and update "layers"
    if (selectedPeriodId !== prevState.selectedPeriodId) {
      this.fetchRasters();
    }
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

  handlePeriodSliderChange = (_event, value) => {
    this.setState({ selectedPeriodId: value })
  }

  handleToggleLayer = layer => {
    if (!layer) return; // just in case
    this.setState(prevState => ({
      activeLayers: this._addOrRemove(prevState.activeLayers, layer.id)
    }));
  };

  _addOrRemove(array, item) {
    const include = array.includes(item);
    return include
      ? array.filter(arrayItem => arrayItem !== item)
      : [...array, item];
  }

  handleOpacityChange = (id, value) => {
    this.setState(prevState => ({
      layersOpacity: {
        ...prevState.layersOpacity,
        [id]: value
      }
    }));
  };

  render() {
    const { classes } = this.props;
    const {
      type,
      viewport,
      bounds,
      scopeTypes,
      selectedScopeType,
      selectedScope,
      scopesLoaded,
      scopeGeomsByType,
      customScope,
      periods,
      periodsLoaded,
      firstDate,
      lastDate,
      dateFrom,
      dateTo,
      layers,
      activeLayers,
      layersOpacity,
    } = this.state;

    const loaded = scopesLoaded && periodsLoaded;
    const scopeGeomsData = scopeGeomsByType[selectedScopeType];
    const filteredPeriods = periods.filter(p => (p.from >= dateFrom && p.to <= dateTo));
    const periodLabels = filteredPeriods.map(({ from, to }) => [
      moment(from).utc().format("YYYY-MM-DD"),
      moment(to).utc().format("YYYY-MM-DD")
    ]);

    const visibleLayers = layers.filter(layer => activeLayers.includes(layer.id)).map((layer, i) => ({
      ...layer,
      zIndex: layers.length - i,
      opacity: (layersOpacity[layer.id] || 100) / 100
    }))

    return (
      <div className="index">
        <Head>
          <title>{appName} - Mapa de Cambios</title>
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
            firstDate={firstDate}
            lastDate={lastDate}
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
            layers={layers}
            activeLayers={activeLayers}
            layersOpacity={layersOpacity}
            onToggle={this.handleToggleLayer}
            onOpacityChange={this.handleOpacityChange}
          />
          {filteredPeriods.length > 0 && <PeriodSlider
            periods={filteredPeriods}
            periodLabels={periodLabels}
            onChange={this.handlePeriodSliderChange}
          />}
        </div>
        {loaded && (
          <div className={classnames(classes.controlGroup, classes.topRight)}>
            <PlotsControl
              type={type}
              periods={filteredPeriods}
              scope={selectedScope}
              customScope={customScope}
            />
          </div>
        )}
        <Map
          className={classes.map}
          bounds={bounds}
          viewport={viewport}
          onViewportChanged={this.handleMapViewportChanged}
          mapboxStyle={mapboxStyle}
        >
          {scopeGeomsData && <ScopePolygonsLayer
            type={selectedScopeType}
            selectedScope={selectedScope}
            data={scopeGeomsData}
            onClick={this.handleScopePolygonClick}
          />}
          {/* <LomasPolygonsLayer /> */}
          {visibleLayers.map(layer => (<TileLayer
            key={layer.id}
            type="raster"
            url={layer.tiles_url}
            maxNativeZoom={13}
            opacity={layers.opacity}
            zIndex={layer.zIndex}
          />))}
        </Map>
      </div >
    );
  }
}

ChangesMap = withStyles(styles)(ChangesMap);
ChangesMap = withSnackbar(ChangesMap);
ChangesMap = withAuthSync(ChangesMap, { redirect: false });

export default ChangesMap;
