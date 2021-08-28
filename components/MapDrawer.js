import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import SearchField from "./SearchField";

export const drawerWidth = 400;

const styles = (theme) => ({
  drawerPaper: {
    width: drawerWidth,
  },
});

const SensorIcon = () => <img src="/static/sensor_icon.png" height={24} />;

const SitesList = ({ items, onSelect }) => (
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
  sites,
  searchFieldValue,
  onSearchFieldChange,
  onSiteSelect,
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
    <SearchField
      value={searchFieldValue}
      onMenuClick={onMenuClick}
      onChange={onSearchFieldChange}
    />
    <Divider />
    <SitesList items={sites} onSelect={onSiteSelect} />
  </Drawer>
);

MapDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool,
  sites: PropTypes.array,
  selectedSite: PropTypes.object,
  searchFieldValue: PropTypes.string,
  onClose: PropTypes.func,
  onSearchFieldChange: PropTypes.func,
  onSiteSelect: PropTypes.func,
  onMenuClick: PropTypes.func,
};

MapDrawer.defaultProps = {
  open: true,
  selectedSite: null,
  searchFieldValue: "",
  onClose: () => {},
  onSearchFieldChange: () => {},
  onSiteSelect: () => {},
  onMenuClick: () => {},
};

export default withStyles(styles)(MapDrawer);
