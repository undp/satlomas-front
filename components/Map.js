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

// FIXME Move this to config/
const MAPBOX_TOKEN =
  "pk.eyJ1IjoiZ2Vzc2ljYTExMTIiLCJhIjoiY2pvZnYwYmV0MDhrYjNxanRpc2E3enhydiJ9.fawTIAVKzqpOE41wkVw1Zw";

const MapboxBasemap = ({ style }) => {
  const styleId = style || "mapbox.satellite";
  return (
    <Basemap
      url={`https://api.tiles.mapbox.com/v4/${styleId}/{z}/{x}/{y}.png?access_token=${MAPBOX_TOKEN}`}
      attribution='&amp;copy <a href="http://mapbox.com/copyright">Mapbox</a> contributors'
    />
  );
};

const Basemap = ({ url, attribution }) => (
  <TileLayer url={url} attribution={attribution} zIndex={-1} />
);

class Map extends React.Component {
  render() {
    const {
      classes,
      className,
      children,
      mapboxStyle,
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
        <MapboxBasemap style={mapboxStyle} />
        {children}
        {stationMarkers && (
          <StationMarkerList
            selectedMarker={selectedMarker}
            markers={stationMarkers}
          />
        )}
        <ZoomControl position="topright" />
      </LeafletMap>
    );
  }
}

export default withStyles(styles)(Map);
