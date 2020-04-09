import React from "react";
import { Marker, Popup } from "react-leaflet";
import { Typography, Button } from "@material-ui/core";
import { Link } from "../i18n";

const StationMarker = ({ stationId, code, name, place_name, lat, lon }) => (
  <Marker position={[lat, lon]}>
    <Popup>
      <Typography variant="h6">
        {name} - {place_name}
      </Typography>
      <Typography variant="body1">
        Code: <strong>{code}</strong>
      </Typography>
      <Link href={`/stations/dashboard?id=${stationId}`}>
        <Button variant="contained">Dashboard</Button>
      </Link>
    </Popup>
  </Marker>
);

export default StationMarker;
