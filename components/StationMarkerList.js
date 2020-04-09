import React, { Fragment } from "react";
import StationMarker from "./StationMarker";

const StationMarkerList = ({ markers }) => {
  const items = markers.map(({ code, ...props }) => (
    <StationMarker stationId={props.id} key={code} code={code} {...props} />
  ));
  return <Fragment>{items}</Fragment>;
};

export default StationMarkerList;
