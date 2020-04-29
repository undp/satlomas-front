import React from "react";
import PropTypes from "prop-types";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { withTranslation } from "../i18n";
import { withStyles } from '@material-ui/core/styles';

import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';

const styles = theme => ({
  root: {
    margin: theme.spacing(1),
    width: "18%",
    position: "fixed",
    left: 10,
    top: 10,
    zIndex: 1000
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  },
  item: {
    padding: "0 0 5px 0"
  },
  itemText: {
    padding: "0 5px 0 0"
  }
});

const ColorBlock = ({ value }) => (
  <div>
    <style jsx>{`
      div {
        border: 1px solid #000;
        width: 16px;
        height: 16px;
        background-color: ${value};
        display: inline-block;
        margin-right: 8px;
        margin-bottom: -3px;
      }
    `}</style>
  </div>
);

const Legend = withStyles(styles)(({ layer, classes }) => {
  const legend = layer.extra_fields && layer.extra_fields.legend;
  return legend ? (
    <List dense={true}>
      {legend.items.map((item, i) => (
        <ListItem key={i} className={classes.item}>
          <ColorBlock value={item.color} />
          <ListItemText className={classes.itemText} primary={item.value} />
        </ListItem>
      ))}
    </List>
  ) : null;
});

class LayersLegendExpansionPanel extends React.Component {
  render() {
    const { classes, layers } = this.props;

    return (
      <div className={classes.root}>
        {layers.map(layer => (
          <ExpansionPanel key={layer.uuid}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>{layer.name}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              {/* {layer.description && (
                <Typography>{layer.description}</Typography>
              )} */}
              <Legend layer={layer} />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ))}
      </div>
    );
  }
}

LayersLegendExpansionPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

export default withTranslation()(withStyles(styles)(LayersLegendExpansionPanel));
