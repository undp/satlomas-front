import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Drawer } from "@material-ui/core";

export const drawerWidth = 400;

const styles = (theme) => ({
  drawerPaper: {
    width: drawerWidth,
  },
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
  searchFieldValue,
  onSearchFieldChange,
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
      <SearchField value={searchFieldValue} onMenuClick={onMenuClick} onChange={onSearchFieldChange} />
      <Divider />
      <StationsList items={stations} onSelect={onStationSelect} />
    </Drawer>
  );

MapDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool,
  stations: PropTypes.array,
  selectedStation: PropTypes.object,
  searchFieldValue: PropTypes.string,
  onClose: PropTypes.func,
  onSearchFieldChange: PropTypes.func,
  onStationSelect: PropTypes.func,
  onMenuClick: PropTypes.func,
};

MapDrawer.defaultProps = {
  open: true,
  selectedStation: null,
  searchFieldValue: "",
  onClose: () => { },
  onSearchFieldChange: () => { },
  onStationSelect: () => { },
  onMenuClick: () => { },
};

export default withStyles(styles)(MapDrawer);
