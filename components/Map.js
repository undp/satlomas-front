import classnames from "classnames";
import { Map as LeafletMap, TileLayer, ZoomControl } from "react-leaflet";
import StationMarkerList from "./StationMarkerList";
import { withStyles } from "@material-ui/core/styles";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const styles = (_theme) => ({
  map: {
    width: "100vw",
    height: "100vh",
    flex: 1,
  },
});

const OSMBasemap = () => {
  return (
    <Basemap
      url={`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`}
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    />
  );
};

const MapboxBasemap = ({ style }) => {
  const styleId = style || "mapbox/satellite-v8";

  return (
    <Basemap
      url={`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`}
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    />
  );
};

const Basemap = ({ url, attribution }) => (
  <TileLayer url={url} attribution={attribution} zIndex={-1} />
);

const GoogleMapsBasemap = () => (
  <Basemap
    // url={`http://ecn.t3.tiles.virtualearth.net/tiles/a{q}.jpeg?g=1`}
    url={`https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}`}
    attribution="&copy; Google"
    zIndex={-1}
  />
);

class Map extends React.Component {
  render() {
    const {
      classes,
      className,
      children,
      basemapStyle,
      stationMarkers,
      selectedMarker,
      boundPoints,
      bounds,
      ...extraProps
    } = this.props;

    let realBounds = bounds;
    if (!realBounds && boundPoints) {
      const group = new L.FeatureGroup(
        boundPoints.map(([lat, lon]) => L.marker([lat, lon]))
      );
      realBounds = group.getBounds();
    }
    if (realBounds && !realBounds.isValid()) realBounds = null;

    return (
      <LeafletMap
        ref={(e) => (this.map = e)}
        className={classnames(classes.map, className)}
        zoomControl={false}
        bounds={realBounds}
        {...extraProps}
      >
        <GoogleMapsBasemap />
        {children}
        {stationMarkers && (
          <StationMarkerList
            selectedMarker={selectedMarker}
            markers={stationMarkers}
          />
        )}
      </LeafletMap>
    );
  }
}

export default withStyles(styles)(Map);
