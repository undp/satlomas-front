import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withSnackbar } from "notistack";
import {
  AppBar,
  Paper,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableContainer,
  TableCell,
  Tabs,
  Tab,
  Typography,
  Toolbar,
  Tooltip,
} from '@material-ui/core';
import axios from "axios";
import { i18n } from "../../i18n";
import Moment from "react-moment";
import { buildApiUrl } from "../../utils/api";
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import { routerPush } from "../../utils/router";

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
});

let TableToolBar = ({ value }) => (
  <Toolbar>
    <Tooltip title="Create">
      <IconButton aria-label="Create" onClick={() => routerPush("/admin/rules/new", { tab: value })}>
        <AddIcon />
      </IconButton>
    </Tooltip>
  </Toolbar>
)

function SimpleRuleTable(props) {
  const { classes, rows, columns, value } = props;

  function createRow(elem) {
    const locale = i18n.language;
    let row = [];
    let dates_set = new Set().add("created_at").add("updated_at")
    for (var key in elem) {
      if (dates_set.has(key)) {
        row.push(<TableCell key={key}><Moment locale={locale}>{elem[key]}</Moment></TableCell>)
      }
      else {
        row.push(<TableCell key={key}>{elem[key].toString()}</TableCell>)
      }
    }
    return row;
  }

  return (
    <Paper className={classes.root}>
      <TableToolBar classes={classes} value={value} />
      <TableContainer>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              {columns.map(column => <TableCell key={column}>{column}</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id}>
                {createRow(row)}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

SimpleRuleTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const tabs = [
  {
    'title': "Reglas de parametros",
    'url': "/alerts/parameter-rules"
  },
  {
    'title': "Reglas por ambito",
    'url': "/alerts/scope-rules"
  },
  {
    'title': "Reglas por tipo de ambito",
    'url': "/alerts/scope-type-rules"
  }
]

class RulesList extends React.Component {
  state = {
    tab: 0,
    cols: [],
    rows: [],
    loaded: false,
  };

  async componentDidMount() {
    const { tab } = this.props

    this.setState({ tab: +tab })
    this.fetchData(+tab);
  }

  async componentDidUpdate(_prevProps, prevState) {
    const { tab } = this.state;

    if (tab !== prevState.tab) {
      this.fetchData(tab);
    }
  }

  fetchData(tab) {
    const { token } = this.props;
    const tabObj = tabs[tab];

    axios.get(buildApiUrl(tabObj.url), { headers: { Authorization: token } }).then(response => {
      if (response.data.length > 0) {
        const cols = Object.keys(response.data[0]);
        this.setState({ rows: response.data, cols });
      } else {
        this.setState({ rows: [], cols: [] });
      }
    }).catch(err => {
      console.error(err);
      this.props.enqueueSnackbar(`Failed to get ${tabObj.title}`, { variant: "error" })
      this.setState({ rows: [], cols: [] });
    });
  }

  handleChange = async (_event, value) => {
    this.setState({ tab: value })
  };

  render() {
    const { classes } = this.props;
    const { rows, cols, tab } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs value={tab} onChange={this.handleChange}>
            {tabs.map(tab => <Tab key={tab.url} label={tab.title} />)}
          </Tabs>
        </AppBar>
        <SimpleRuleTable classes={classes} value={tab} rows={rows} columns={cols} />
      </div>
    );
  }
}

RulesList.propTypes = {
  classes: PropTypes.object.isRequired,
};

RulesList = withStyles(styles)(RulesList);
RulesList = withSnackbar(RulesList);

export default RulesList;
