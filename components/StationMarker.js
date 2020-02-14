import React from "react";
import { Marker, Popup } from "react-leaflet";
import { Typography } from "@material-ui/core";

const StationMarker = ({ code, name, place_name, lat, lon }) => (
  <Marker position={[lat, lon]}>
    <Popup>
      <Typography variant="h6">
        {name} - {place_name}
      </Typography>
      <Typography variant="body1">
        Code: <strong>{code}</strong>
      </Typography>
    </Popup>
  </Marker>
);

export default StationMarker;
