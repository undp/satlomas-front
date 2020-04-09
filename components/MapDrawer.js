import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import React from "react";
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import SearchField from "./SearchField";

export const drawerWidth = 360;

const styles = (theme) => ({
  // drawer: {
  //   width: drawerWidth,
  //   flexShrink: 0,
  // },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
});

const SensorIcon = () => <img src="/static/sensor_icon.png" height={24} />;

const StationsList = ({ items, onSelect }) => (
  <List>
    {items &&
      items.map((item) => (
        <ListItem key={item.id} button onClick={() => onSelect(item)}>
          <ListItemIcon>
            <SensorIcon />
          </ListItemIcon>
          <ListItemText primary={item.name} secondary={item.place_name} />
        </ListItem>
      ))}
  </List>
);

const MapDrawer = ({
  classes,
  open,
  onClose,
  stations,
  onStationSelect,
  onMenuClick,
}) => (
  <Drawer
    open={open}
    onClose={onClose}
    className={classes.drawer}
    classes={{
      paper: classes.drawerPaper,
    }}
    anchor="left"
  >
    <SearchField stations={stations} onMenuClick={onMenuClick} />
    <Divider />
    <StationsList items={stations} onSelect={onStationSelect} />
  </Drawer>
);

MapDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  stations: PropTypes.array,
  selectedStation: PropTypes.object,
  onStationSelect: PropTypes.func,
  onMenuClick: PropTypes.func,
};

MapDrawer.defaultProps = {
  stations: [],
  open: true,
  selectedStation: null,
  onClose: () => {},
  onStationSelect: () => {},
  onMenuClick: () => {},
};

export default withStyles(styles)(MapDrawer);
