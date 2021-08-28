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

const SitesList = ({ items, selected, onSelect }) => (
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

class SitesMap extends Component {
  state = {
    map: null,
    bounds: null,
    viewport: {
      center: [-12.046373, -76.542755],
      zoom: 10,
    },
    sites: [],
    filteredSites: [],
    selectedSite: null,
    searchFieldValue: "",
    drawerOpen: false,
  };

  static async getInitialProps({ query }) {
    return {
      query,
      namespacesRequired: ["common"],
    };
  }

  async fetchSites(name) {
    const { token } = this.props;
    const headers = token ? { Authorization: token } : {};

    const params = name ? { name } : {};

    try {
      const response = await axios.get(buildApiUrl(`/stations/sites/`), {
        params,
        headers,
      });
      return response.data || [];
    } catch (err) {
      this.props.enqueueSnackbar("Failed to fetch sites", {
        variant: "error",
      });
      return [];
    }
  }

  filterSites(name) {
    return this.state.sites.filter((o) =>
      o["name"].toLowerCase().includes(name.toLowerCase())
    );
  }

  componentDidMount = async () => {
    const sites = await this.fetchSites();
    this.setState({ sites, filteredSites: sites });
  };

  componentDidUpdate(_prevProps, prevState) {
    const site = this.state.selectedSite;
    if (site !== prevState.selectedSite) {
      this.setState({
        viewport: {
          ...this.state.viewport,
          center: site.geom.coordinates,
        },
      });
    }
  }

  handleMapViewportChanged = (viewport) => {
    this.setState({ viewport });
  };

  handleSearchFieldChange = async (e) => {
    const { value } = e.target;
    const filteredSites = this.filterSites(value);
    this.setState({
      searchFieldValue: value,
      filteredSites,
    });
  };

  handleSiteSelect = (site) => {
    this.setState({
      selectedSite: site,
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
      sites,
      filteredSites,
      searchFieldValue,
      selectedSite,
      drawerOpen,
    } = this.state;

    console.log("Sites", sites);
    const sitePoints = sites
      .filter((s) => s.geom?.coordinates)
      .map((s) => s.geom.coordinates);
    console.log("sitePoints", sitePoints);

    return (
      <div className="index">
        <Head>
          <title>{appName} - Mapa de Sitios de Evaluación</title>
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
          sites={filteredSites}
          searchFieldValue={searchFieldValue}
          selectedSite={selectedSite}
          onSearchFieldChange={this.handleSearchFieldChange}
          onSiteSelect={this.handleSiteSelect}
          onMenuClick={this.handleMenuClick}
        />
        <Map
          className={classes.map}
          bounds={bounds}
          boundPoints={sitePoints}
          viewport={viewport}
          onViewportChanged={this.handleMapViewportChanged}
          mapboxStyle={mapboxStyle}
          siteMarkers={sites}
          selectedMarker={selectedSite}
        />
      </div>
    );
  }
}

SitesMap.propTypes = {
  t: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
};

SitesMap = withSnackbar(SitesMap);
SitesMap = withTranslation()(SitesMap);
SitesMap = withStyles(styles)(SitesMap);

export default SitesMap;
