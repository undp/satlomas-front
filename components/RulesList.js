import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import axios from "axios";
import { buildApiUrl } from "../utils/api";

const tableStyles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});





function SimpleRuleTable(props) {
  const { classes, rows, columns } = props;

  function createTable(columns){
    let table = []
    for (let i = 0; i < columns.length; i++) {
      table.push(<TableCell>{columns[i]}</TableCell>)
    }
    return table
  }

  function createRow(elem){
    let row = [];
    for (var key in elem){
        if (key != "id"){row.push(<TableCell>{elem[key]}</TableCell>)}
    }
    return row;
  }

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            {createTable(columns)}
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

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
});

const tabs = [
    {
        'title': "Reglas de parametros",
        'url': "/parameter-rules"
    },
    {
        'title': "Reglas por ambito",
        'url': "/scopes-rules"
    },
    {
        'title': "Reglas por tipo de ambito",
        'url': "/scopes-type-rule"
    }

]

class RulesList extends React.Component {
  state = {
    value: 0,
    cols : [],
    rows : [],
    loaded : false,
  };

  async componentDidMount(){
    await this.fetchData();
  }


  async fetchData(){
    const response = await axios.get(buildApiUrl(tabs[this.state.value].url));
    if (response.data.length > 0){
        let cols = Object.keys(response.data[0]).filter(function(item) {
            return item !== "id"
        })
        this.setState({rows: response.data, cols: cols});
    }
    else {
        this.setState({rows: [], cols: []});
    }
    
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.state.value !== prevState.value) {
        await this.fetchData();
    }
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  createTabs = () => {
      let arr = [];
      tabs.forEach(function (value, i) {
        arr.push( <Tab key={i} label={value.title}/>);
      });
      return arr;
  }


  render() {
    const { classes } = this.props;
    const { value, rows, cols } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs value={value} onChange={this.handleChange}>
            {this.createTabs()}
          </Tabs>
        </AppBar>
        <SimpleRuleTable classes={classes} rows={rows} columns={cols}/>
      </div>
    );
  }
}

RulesList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RulesList);
