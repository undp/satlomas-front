import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
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
import LomasPolygonsLayer from "../components/LomasPolygonsLayer";
import LayersLegendExpansionPanel from "../components/LayersLegendExpansionPanel";
import { KeyboardDatePicker } from "@material-ui/pickers";
import moment from "moment";
import config from "../config";

const { appName } = config;

const allTypes = ["lomas-changes", "vi-lomas-changes"];
const sourcesByType = { "lomas-changes": "S2,P1", "vi-lomas-changes": "MV" }
const maxNativeZoomByType = { "lomas-changes": 14, "vi-lomas-changes": 13 }

const Map = dynamic(() => import("../components/Map"), {
  ssr: false,
  loadingProgress: <LoadingProgress />,
});

const TileLayer = dynamic(() => import("../components/TileLayer"), {
  ssr: false,
});

const GeoJSON = dynamic(() => import("../components/GeoJSON"), {
  ssr: false,
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
    right: theme.spacing(1),
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
    width: "46%",
  },
  periodDatePickerControl: {
    width: "90%",
  },
  periodPaper: {
    width: theme.spacing(20),
  },
  textField: {
    margin: theme.spacing(1),
  },
  searchControl: {
    width: 450,
  },
  searchControlContent: {
    flexFlow: "column",
  },
  plotsControl: {
    width: 550,
  },
  plotsControlHeading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
});

const legendBySlug = {
  ndvi: {
    items: [
      { color: "#1F6873", value: "0 - 0.2" },
      { color: "#1FA188", value: "0.2 - 0.4" },
      { color: "#70CF57", value: "0.4 - 0.6" },
      { color: "#FDE725", value: "> 0.8" },
    ],
  },
};

class ScopePolygonsLayer extends React.Component {
  _style = (feature) => {
    const { selectedScope } = this.props;
    const isSelected = feature.properties.id === selectedScope;
    const color = isSelected ? "#fff700" : "#ff7b00";
    return {
      color,
      fillColor: color,
      fillOpacity: 0.0,
      weight: 2,
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

    const scopeTypeItems = Object.values(scopeTypes).sort((st) => st.type);
    const scopeItems = scopeTypes[selectedScopeType].scopes.sort(
      (sc) => sc.name
    );

    const selectedScopeTypeName = scopeTypes[selectedScopeType].name;
    const selectedScopeName = scopeTypes[selectedScopeType].scopes.find(
      (s) => s.pk === selectedScope
    ).name;

    return (
      <div className={classes.searchControl}>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              {selectedScopeTypeName} - {selectedScopeName}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.searchControlContent}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="scope-type">Tipo de Ámbito</InputLabel>
              <Select
                value={selectedScopeType}
                onChange={onScopeTypeSelectChange}
              >
                {scopeTypeItems.map((sc) => (
                  <MenuItem key={sc.type} value={sc.type}>
                    {sc.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="scope">Ámbito</InputLabel>
              <Select onChange={onScopeSelectChange} value={selectedScope}>
                {scopeItems.map((sc) => (
                  <MenuItem key={sc.pk} value={sc.pk}>
                    {sc.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div>
              <FormControl
                className={classnames(
                  classes.formControl,
                  classes.datePickerControl
                )}
              >
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
              <FormControl
                className={classnames(
                  classes.formControl,
                  classes.datePickerControl
                )}
              >
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

let PlotsControl = ({ classes, type, dates, scope, customScope }) => (
  <div className={classes.plotsControl}>
    <ExpansionPanel expanded={true}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.plotsControlHeading}>
          {type === "vi-lomas-changes"
            ? "Variación del área de lomas"
            : "Cobertura de Loma Perdida"}
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Dashboard
          type={type}
          dates={dates}
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
    dates: [],
    datesLoaded: false,
    firstDate: null,
    lastDate: null,
    dateFrom: null,
    dateTo: null,
    customScope: null,
    selectedDateIdx: null,
    layers: [],
    activeLayers: ["ndvi"],
    layersOpacity: {},
    currentDate: null,
  };

  static getInitialProps = async ({ query }) => ({
    namespacesRequired: ["common"],
    query,
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
      console.log("ScopeTypes:", scopeTypes);

      const selectedScopeType = scopeTypes[0].type;
      const selectedScope = scopeTypes[0].scopes[0].pk;

      // Convert array to an object by "type"
      let scopeTypesObj = {};
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

  fetchDates = async () => {
    const { type } = this.state;

    try {
      const response = await axios.get(
        buildApiUrl(`/eo-sensors/available-dates/`),
        { params: { source: sourcesByType[type] } }
      );
      const datesRaw = response.data;
      const firstDate = moment(datesRaw.first_date);
      const lastDate = moment(datesRaw.last_date);
      const dates = datesRaw.availables.sort().map(d => moment(d));

      console.log("Dates:", dates);
      console.log("First date:", firstDate);
      console.log("Last date:", firstDate);

      // Select latest period by default
      const selectedDateIdx = dates.length > 0 ? dates.length - 1 : null;
      const currentDate = dates[selectedDateIdx];

      await this.setState({
        dates,
        selectedDateIdx,
        currentDate,
        datesLoaded: true,
        firstDate,
        lastDate,
        dateFrom: firstDate,
        dateTo: lastDate,
      });
    } catch (err) {
      console.error(err);
      this.props.enqueueSnackbar(`Failed to get available dates`, {
        variant: "error",
      });
    }
  };

  fetchAndBuildScopesGeoJSON = async (type) => {
    // console.log("Fetch scopes geometries for:", type);
    const res = {
      type: "FeatureCollection",
      features: [],
    };

    try {
      const response = await axios.get(buildApiUrl("/scopes/"), {
        params: { type },
      });
      const scopes = response.data;
      // console.log("Scopes", response);
      res["features"] = scopes.map((scope) => ({
        type: "Feature",
        geometry: scope.geom,
        properties: {
          id: scope.id,
          name: scope.name,
        },
      }));
    } catch (err) {
      console.error(err);
      this.props.enqueueSnackbar(`Failed to get scopes from type '${type}'`, {
        variant: "error",
      });
    }

    return res;
  };

  fetchRasters = async () => {
    const { type, dates, selectedDateIdx } = this.state;
    const date = dates[selectedDateIdx];

    const params = {
      source: sourcesByType[type],
      from: moment(date).utc().format("YYYY-MM-DD"),
      to: moment(date).utc().format("YYYY-MM-DD"),
    };

    try {
      const response = await axios.get(buildApiUrl(`/eo-sensors/rasters/`), {
        params,
      });

      const layersRaw = response.data;
      console.log("Layers:", layersRaw);

      const layers = layersRaw.map((r) => ({
        id: r.slug,
        name: r.name,
        tiles_url: r.tiles_url,
        legend: legendBySlug[r.slug],
      }));

      this.setState({ layers });
    } catch (err) {
      console.error(err);
      this.props.enqueueSnackbar(
        `Failed to get rasters for currrently selected date`,
        {
          variant: "error",
        }
      );
    }
  };

  componentDidMount() {
    this.fetchScopeTypes();
    this.fetchDates();
  }

  componentDidUpdate = async (_prevProps, prevState) => {
    // If selectedScopeType changed, refresh geojson layer with scopes from scopetype
    const {
      selectedScopeType,
      scopeGeomsByType,
      selectedDateIdx,
    } = this.state;

    if (selectedScopeType !== prevState.selectedScopeType) {
      if (!scopeGeomsByType[selectedScopeType]) {
        const geomData = await this.fetchAndBuildScopesGeoJSON(
          selectedScopeType
        );
        this.setState({
          scopeGeomsByType: {
            ...prevState.scopeGeomsByType,
            [selectedScopeType]: geomData,
          },
        });
      }
    }

    // TODO If selectedScope changed, highlight new scope and center map

    // TODO If selectedDateIdx changed, fetch rasters from date and update "layers"
    if (selectedDateIdx !== prevState.selectedDateIdx) {
      this.fetchRasters();
    }
  };

  handleDateFromChange = (datetime) => {
    this.setState({ dateFrom: datetime });
  };

  handleDateToChange = (datetime) => {
    this.setState({ dateTo: datetime });
  };

  handleScopeTypeSelectChange = (e) => {
    const { scopeTypes } = this.state;
    const type = e.target.value;

    this.setState({
      selectedScopeType: type,
      selectedScope: scopeTypes[type].scopes[0].pk,
    });
  };

  handleScopeSelectChange = (e) => {
    const scope = e.target.value;

    this.setState({ selectedScope: scope });
  };

  handleScopePolygonClick = (scope) => {
    this.setState({ selectedScope: scope });
  };

  handleMapViewportChanged = (viewport) => {
    this.setState({ viewport });
  };

  handleZoomInClick = () => {
    this.setState((prevState) => ({
      viewport: {
        ...prevState.viewport,
        zoom: Math.min(prevState.viewport.zoom + 1, 21),
      },
    }));
  };

  handleZoomOutClick = () => {
    this.setState((prevState) => ({
      viewport: {
        ...prevState.viewport,
        zoom: Math.max(prevState.viewport.zoom - 1, 1),
      },
    }));
  };

  handleToggleLayer = (layer) => {
    if (!layer) return; // just in case
    this.setState((prevState) => ({
      activeLayers: this._addOrRemove(prevState.activeLayers, layer.id),
    }));
  };

  _addOrRemove(array, item) {
    const include = array.includes(item);
    return include
      ? array.filter((arrayItem) => arrayItem !== item)
      : [...array, item];
  }

  handleOpacityChange = (id, value) => {
    this.setState((prevState) => ({
      layersOpacity: {
        ...prevState.layersOpacity,
        [id]: value,
      },
    }));
  };

  handleDateChange = (datetime) => {
    const { dates } = this.state;
    const selectedDateIdx = dates.findIndex(d => moment(d).format('YYYY-MM-DD') == datetime.format("YYYY-MM-DD"));
    const currentDate = dates[selectedDateIdx];
    console.log("Current date:", currentDate, "idx:", selectedDateIdx);
    if (selectedDateIdx >= 0) this.setState({ selectedDateIdx, currentDate });
  };

  handleDisabledDate = (datetime) => {
    const { dates } = this.state;
    return !dates.some(date => date.isSame(datetime));
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
      dates,
      datesLoaded,
      firstDate,
      lastDate,
      dateFrom,
      dateTo,
      layers,
      activeLayers,
      layersOpacity,
      currentDate,
    } = this.state;

    const loaded = scopesLoaded && datesLoaded;
    const scopeGeomsData = scopeGeomsByType[selectedScopeType];
    const filteredDates = dates.filter(
      date => date >= dateFrom && date <= dateTo
    );
    const visibleLayers = layers
      .filter((layer) => activeLayers.includes(layer.id))
      .map((layer, i) => ({
        ...layer,
        zIndex: layers.length - i,
        opacity: (layersOpacity[layer.id] || 100) / 100,
      }));

    const layersWithLegend = layers.filter(
      (layer) => activeLayers.includes(layer.id) && layer.name
    );

    console.log("RENDER currentDate:", currentDate);

    return (
      <div className="index">
        <Head>
          <title>{appName} - Mapa de Cambios</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
        </Head>
        {loaded && (
          <div className={classnames(classes.controlGroup, classes.topLeft)}>
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
            <LayersLegendExpansionPanel layers={layersWithLegend} />
          </div>
        )}
        <div className={classnames(classes.controlGroup, classes.bottomLeft)}>
          <ZoomControl
            onZoomInClick={this.handleZoomInClick}
            onZoomOutClick={this.handleZoomOutClick}
          />
          <LayersControl
            layers={layers}
            activeLayers={activeLayers}
            layersOpacity={layersOpacity}
            onToggle={this.handleToggleLayer}
            onOpacityChange={this.handleOpacityChange}
          />
          {filteredDates.length > 0 && (
            <div className={classes.periodPaper}>
              <Paper>
                <FormControl
                  className={classnames(
                    classes.formControl,
                    classes.periodDatePickerControl
                  )}
                >
                  <KeyboardDatePicker
                    ampm={false}
                    autoOk={true}
                    variant="inline"
                    format="YYYY-MM-DD"
                    id="date-period"
                    minDate={dateFrom}
                    maxDate={dateTo}
                    initialFocusedDate={moment(dateTo).format("YYYY-MM-DD")}
                    value={moment(currentDate).format("YYYY-MM-DD")}
                    shouldDisableDate={this.handleDisabledDate}
                    onChange={this.handleDateChange}
                  />
                </FormControl>
              </Paper>
            </div>
          )}
        </div>
        {loaded && (
          <div className={classnames(classes.controlGroup, classes.topRight)}>
            {/* <PlotsControl
              type={type}
              dates={filteredDates}
              scope={selectedScope}
              customScope={customScope}
            /> */}
          </div>
        )}
        <Map
          className={classes.map}
          bounds={bounds}
          viewport={viewport}
          onViewportChanged={this.handleMapViewportChanged}
        >
          {scopeGeomsData && (
            <ScopePolygonsLayer
              type={selectedScopeType}
              selectedScope={selectedScope}
              data={scopeGeomsData}
              onClick={this.handleScopePolygonClick}
            />
          )}
          <LomasPolygonsLayer />
          {visibleLayers.map((layer) => (
            <TileLayer
              key={layer.id}
              type="raster"
              url={layer.tiles_url}
              maxNativeZoom={maxNativeZoomByType[type]}
              opacity={layer.opacity}
              zIndex={layer.zIndex}
            />
          ))}
        </Map>
      </div>
    );
  }
}

ChangesMap = withStyles(styles)(ChangesMap);
ChangesMap = withSnackbar(ChangesMap);
ChangesMap = withAuthSync(ChangesMap, { redirect: false });

export default ChangesMap;
