import React from "react";
import { Marker, Popup } from "react-leaflet";
import { Typography, Button } from "@material-ui/core";
import { Link } from "../i18n";
import { withStyles } from "@material-ui/core/styles";
import ParameterCardContent from "../components/ParameterCardContent";

const styles = (_theme) => ({
  popup: {
    width: 450,
  },
  popupChild: {
    width: 450,
  },
});

const StationMarker = ({
  classes,
  stationId,
  code,
  name,
  place_name,
  lat,
  lon,
}) => {
  const parameter = "temperature";
  const mode = "historic";
  const timeRangeParams = {
    start: "2011-01-01T00:00",
    end: "2012-01-01T00:00",
  };
  const groupingInterval = "month";
  const aggregationFunc = "avg";

  return (
    <Marker position={[lat, lon]}>
      <Popup className={classes.popup}>
        <Typography variant="h6" className={classes.popupChild}>
          {name} (<strong>{code}</strong>, {place_name})
        </Typography>
        <ParameterCardContent
          stationId={stationId}
          parameter={parameter}
          mode={mode}
          timeRangeParams={timeRangeParams}
          groupingInterval={groupingInterval}
          aggregationFunc={aggregationFunc}
        />
        <Link href={`/stations/dashboard?id=${stationId}`}>
          <Button variant="contained">Dashboard</Button>
        </Link>
      </Popup>
    </Marker>
  );
};

export default withStyles(styles)(StationMarker);
