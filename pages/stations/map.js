import axios from "axios";
import dynamic from "next/dynamic";
import Head from "next/head";
import PropTypes from "prop-types";
import React, { Component } from "react";
import classnames from "classnames";
import LoadingProgress from "../../components/LoadingProgress";
import MapDrawer from "../../components/MapDrawer";
import { Fab } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { withStyles } from "@material-ui/core/styles";
import { withNamespaces } from "../../i18n";
import { buildApiUrl } from "../../utils/api";
import { withSnackbar } from "notistack";

const styles = (theme) => ({
  controlGroup: {
    position: "fixed",
    zIndex: 1000,
  },
  topLeft: {
    top: theme.spacing.unit,
    left: theme.spacing.unit,
  },
  fabContainer: {
    display: "block",
  },
  fab: {
    margin: theme.spacing.unit,
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

let SearchFab = ({ classes, ...props }) => (
  <div className={classes.fabContainer}>
    <Fab
      color="primary"
      size="small"
      aria-label="Search"
      className={classes.fab}
      {...props}
    >
      <SearchIcon />
    </Fab>
  </div>
);

SearchFab = withStyles(styles)(SearchFab);

class StationsMap extends Component {
  state = {
    map: null,
    bounds: null,
    viewport: {
      center: [-12.046373, -76.542755],
      zoom: 10,
    },
    stations: [],
    selectedStation: null,
    drawerOpen: false,
  };

  static async getInitialProps({ query }) {
    return {
      query,
      namespacesRequired: ["common"],
    };
  }

  async fetchStations() {
    const { token } = this.props;
    const headers = token ? { Authorization: token } : {};

    let stations = [];
    try {
      const response = await axios.get(buildApiUrl(`/stations/stations/`), {
        headers: headers,
      });
      stations = response.data || [];
    } catch (err) {
      this.props.enqueueSnackbar("Failed to fetch stations", {
        variant: "error",
      });
    }

    this.setState({ stations });
  }

  componentDidMount() {
    this.fetchStations();
  }

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
      selectedStation,
      drawerOpen,
    } = this.state;

    const stationPoints = stations.map((s) => [s.lat, s.lon]);

    return (
      <div className="index">
        <Head>
          <title>GeoLomas Platform - Mapa de Estaciones Meteorológicas</title>
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
          stations={stations}
          selectedStation={selectedStation}
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
StationsMap = withNamespaces()(StationsMap);
StationsMap = withStyles(styles)(StationsMap);

export default StationsMap;
