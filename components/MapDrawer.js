import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import SearchField from "./SearchField";

const drawerWidth = 360;

const styles = (theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
});

const SensorIcon = () => <img src="/static/sensor_icon.png" height={24} />;

const StationsList = ({ stations, onStationSelect }) => (
  <List>
    {stations &&
      stations.map((station) => (
        <ListItem
          key={station.id}
          button
          onClick={() => onStationSelect(station)}
        >
          <ListItemIcon>
            <SensorIcon />
          </ListItemIcon>
          <ListItemText primary={station.name} secondary={station.place_name} />
        </ListItem>
      ))}
  </List>
);

const MapDrawer = ({
  classes,
  selectedStation,
  stations,
  onStationSelect,
  onMenuClick,
}) => (
  <Drawer
    className={classes.drawer}
    variant="permanent"
    classes={{
      paper: classes.drawerPaper,
    }}
    anchor="left"
  >
    <SearchField stations={stations} onMenuClick={onMenuClick} />
    <Divider />
    {!selectedStation && (
      <StationsList items={stations} onStationSelect={onStationSelect} />
    )}
  </Drawer>
);

MapDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  stations: PropTypes.array,
  selectedStation: PropTypes.object,
  onStationSelect: PropTypes.func,
  onMenuClick: PropTypes.func,
};

MapDrawer.defaultProps = {
  stations: [],
  selectedStation: null,
  onStationSelect: () => {},
  onMenuClick: () => {},
};

export default withStyles(styles)(MapDrawer);
