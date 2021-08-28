import React from "react";
import { Marker, Popup } from "react-leaflet";
import { Typography, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import ParameterCardContent from "../components/ParameterCardContent";
import SelectControl from "../components/SelectControl";
import { Link } from "../i18n";
import config from "../config";

const { stationParameters } = config;

const styles = (_theme) => ({
  popup: {
    width: 450,
  },
  popupChild: {
    width: 450,
  },
});

class SiteMarker extends React.Component {
  state = {
    parameter: stationParameters[0].id,
  };

  handleParameterChange = (e) => {
    this.setState({ parameter: e.target.value });
  };

  render() {
    const { classes, id, station_code, name, geom } = this.props;
    const { parameter } = this.state;

    const mode = "historic";
    const timeRangeParams = {
      start: "2011-01-01T00:00",
      end: "2012-01-01T00:00",
    };
    const groupingInterval = "month";
    const aggregationFunc = "avg";

    const [lat, lon] = geom.coordinates;

    return (
      <Marker position={[lat, lon]}>
        <Popup className={classes.popup}>
          <Typography variant="h6" className={classes.popupChild}>
            {name} (<strong>{station_code}</strong>)
          </Typography>
          <SelectControl
            id="parameter"
            label="Parámetro"
            items={stationParameters}
            value={parameter}
            onChange={this.handleParameterChange}
          />
          <ParameterCardContent
            siteId={id}
            parameter={parameter}
            mode={mode}
            timeRangeParams={timeRangeParams}
            groupingInterval={groupingInterval}
            aggregationFunc={aggregationFunc}
          />
          <Link href={`/stations/dashboard?id=${id}`}>
            <Button variant="contained">Dashboard</Button>
          </Link>
        </Popup>
      </Marker>
    );
  }
}

export default withStyles(styles)(SiteMarker);
