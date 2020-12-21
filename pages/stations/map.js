import axios from "axios";
import dynamic from "next/dynamic";
import Head from "next/head";
import PropTypes from "prop-types";
import React, { Component } from "react";
import classnames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { withTranslation } from "../../i18n";
import { buildApiUrl } from "../../utils/api";
import { withSnackbar } from "notistack";
import LoadingProgress from "../../components/LoadingProgress";
import MapDrawer from "../../components/MapDrawer";
import SearchFab from "../../components/SearchFab";
import config from "../../config";

const { appName } = config;

const styles = (theme) => ({
  controlGroup: {
    position: "fixed",
    zIndex: 1000,
  },
  topLeft: {
    top: theme.spacing(1),
    left: theme.spacing(1),
  },
  fabContainer: {
    display: "block",
  },
  fab: {
    margin: theme.spacing(1),
  },
});

const mapboxStyle = "mapbox.streets";

// const sentinelModifiedAttribution =
//   'Contains modified <a href="http://www.esa.int/Our_Activities/Observing_the_Earth/Copernicus">Copernicus</a> Sentinel data 2019, processed by ESA.';
// const dymaxionAttribution = "&copy; Dymaxion Labs 2019";

const Map = dynamic(() => import("../../components/Map"), {
  ssr: false,
  loadingProgress: <LoadingProgress />,
});

const SensorIcon = () => <img src="/static/sensor_icon.png" height={24} />;

const StationsList = ({ items, selected, onSelect }) => (
  <List>
    {items &&
      items.map((item) => (
        <ListItem
          key={item.id}
          button
          selected={selected === item.id}
          onClick={() => onSelect(item)}
        >
          <ListItemIcon>
            <SensorIcon />
          </ListItemIcon>
          <ListItemText primary={item.name} secondary={item.place_name} />
        </ListItem>
      ))}
  </List>
);

class StationsMap extends Component {
  state = {
    map: null,
    bounds: null,
    viewport: {
      center: [-12.046373, -76.542755],
      zoom: 10,
    },
    stations: [],
    filteredStations: [],
    selectedStation: null,
    searchFieldValue: "",
    drawerOpen: false,
  };

  static async getInitialProps({ query }) {
    return {
      query,
      namespacesRequired: ["common"],
    };
  }

  async fetchStations(name) {
    const { token } = this.props;
    const headers = token ? { Authorization: token } : {};

    const params = name ? { name } : {};

    try {
      const response = await axios.get(buildApiUrl(`/stations/stations/`), {
        params,
        headers,
      });
      return response.data || [];
    } catch (err) {
      this.props.enqueueSnackbar("Failed to fetch stations", {
        variant: "error",
      });
      return [];
    }
  }

  filterStations(name) {
    return this.state.stations.filter((o) =>
      o["name"].toLowerCase().includes(name.toLowerCase())
    );
  }

  componentDidMount = async () => {
    const stations = await this.fetchStations();
    this.setState({ stations, filteredStations: stations });
  };

  componentDidUpdate(_prevProps, prevState) {
    const st = this.state.selectedStation;
    if (st !== prevState.selectedStation) {
      this.setState({
        viewport: {
          ...this.state.viewport,
          center: [st.lat, st.lon],
        },
      });
    }
  }

  handleMapViewportChanged = (viewport) => {
    this.setState({ viewport });
  };

  handleSearchFieldChange = async (e) => {
    const { value } = e.target;
    const filteredStations = this.filterStations(value);
    this.setState({
      searchFieldValue: value,
      filteredStations,
    });
  };

  handleStationSelect = (station) => {
    this.setState({
      selectedStation: station,
      drawerOpen: false,
    });
  };

  handleMenuClick = (e) => {
    console.log("Menu click");
  };

  handleSearchFabClick = (e) => {
    this.setState((prevState) => ({ drawerOpen: !prevState.drawerOpen }));
  };

  handleMapDrawerClose = (e) => {
    this.setState({ drawerOpen: false });
  };

  render() {
    const { classes } = this.props;
    const {
      viewport,
      bounds,
      stations,
      filteredStations,
      searchFieldValue,
      selectedStation,
      drawerOpen,
    } = this.state;

    const stationPoints = stations.map((s) => [s.lat, s.lon]);

    return (
      <div className="index">
        <Head>
          <title>{appName} - Mapa de Estaciones Meteorológicas</title>
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
          stations={filteredStations}
          searchFieldValue={searchFieldValue}
          selectedStation={selectedStation}
          onSearchFieldChange={this.handleSearchFieldChange}
          onStationSelect={this.handleStationSelect}
          onMenuClick={this.handleMenuClick}
        />
        <Map
          className={classes.map}
          bounds={bounds}
          boundPoints={stationPoints}
          viewport={viewport}
          onViewportChanged={this.handleMapViewportChanged}
          mapboxStyle={mapboxStyle}
          stationMarkers={stations}
          selectedMarker={selectedStation}
        />
      </div>
    );
  }
}

StationsMap.propTypes = {
  t: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
};

StationsMap = withSnackbar(StationsMap);
StationsMap = withTranslation()(StationsMap);
StationsMap = withStyles(styles)(StationsMap);

export default StationsMap;
