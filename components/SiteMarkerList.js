import React from "react";
import SiteMarker from "./SiteMarker";

const SiteMarkerList = ({ markers }) => {
  return (
    <>
      {markers.map(({ ...props }) => (
        <SiteMarker key={props.id} {...props} />
      ))}
    </>
  );
};

export default SiteMarkerList;
