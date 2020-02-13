import React from "react";
import { Marker, Popup } from "react-leaflet";

const StationMarker = ({ code, name, place, lat, lon }) => (
  <Marker position={[lat, lon]}>
    <Popup>
      {code} - {name} ({place})
    </Popup>
  </Marker>
);

export default StationMarker;
