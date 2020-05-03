import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withSnackbar } from "notistack";
import { routerPush } from "../../utils/router";
import { buildApiUrl } from "../../utils/api";
import axios from "axios";
import {
  Typography,
  Button
} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  newButton: {
    marginLeft: theme.spacing(2)
  }
});

class RulesListContent extends React.Component {
  state = {
    rows: [],
    loaded: false,
  };

  async componentDidMount() {
    this.fetchData();
  }

  async fetchData() {
    const { ruleType, token } = this.props;

    try {
      const response = await axios.get(buildApiUrl(`/alerts/${ruleType}-rules`), {
        headers: { Authorization: token }
      })
      this.setState({ rows: response.data });
    } catch (err) {
      console.error(err);
      this.props.enqueueSnackbar('Failed to get rules', { variant: "error" })
      this.setState({ rows: [] });
    }
  }

  render() {
    const { classes, title, tableComponent, ruleType } = this.props;
    const { rows } = this.state;

    return (
      <div className={classes.root}>
        <Typography
          variant="h6"
          gutterBottom
        >
          {title}
          <Button
            onClick={() => routerPush(`/admin/${ruleType}-rules/new`)}
            className={classes.newButton}
            startIcon={<AddIcon />}
          >
            Nueva regla
          </Button>
        </Typography>
        {React.cloneElement(tableComponent, { rows })}
      </div >
    );
  }
}

RulesListContent.propTypes = {
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  tableComponent: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  ruleType: PropTypes.string.isRequired,
};

RulesListContent = withStyles(styles)(RulesListContent);
RulesListContent = withSnackbar(RulesListContent);

export default RulesListContent;