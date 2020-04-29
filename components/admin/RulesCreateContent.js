import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import axios from "axios";
import { buildApiUrl } from "../../utils/api";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const parameters = ["temperature", "humidity"]

class ParameterRuleForm extends Component {
  state = {
    station: null,
    parameter: null,
    is_absolute: false,
    min: null,
    max: null,
  }

  handleSubmit() {
    console.log("Submit form");
  }

  handleChange = (event) => {
    const { target } = event
    this.setState({ [target.name]: target.value });
  }

  async createStationSelect() {
    let items = [];
    const response = await axios.get(buildApiUrl("/stations"));
    console.log(response);
    //Create select with that response
  }
  render() {
    const { classes } = this.props;
    return (<Paper className={classes.root}>
      <form
        className={classes.form}
        method="post"
        onSubmit={this.handleSubmit}
      >
        <FormControl className={classes.formControl} fullWidth>
          <InputLabel htmlFor="station">Station</InputLabel>
          <Select
            value={this.state.station}
            onChange={this.handleChange}
            inputProps={{
              name: 'station',
              id: 'station',
            }}
          >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>

        <FormControl className={classes.formControl} fullWidth>
          <InputLabel htmlFor="station">Parameter</InputLabel>
          <Select
            value={this.state.parameter}
            onChange={this.handleChange}
            inputProps={{
              name: 'parameter',
              id: 'parameter',
            }}
          >
            {parameters.map(parameter => (<MenuItem key={parameter} value={parameter}>{parameter}</MenuItem>))}
          </Select>
        </FormControl>

        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="min_val">
            Valor minimo
          </InputLabel>
          <Input
            id="min_val"
            name="min"
            autoFocus
            onChange={this.handleChange}
            value={this.state.min}
          />
        </FormControl>

        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="max_val">
            Valor maximo
          </InputLabel>
          <Input
            id="max_val"
            name="max"
            autoFocus
            onChange={this.handleChange}
            value={this.state.max}
          />
        </FormControl>

        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Absoluta</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox checked={this.state.is_absolute} onChange={() => this.setState({ is_absolute: !this.state.is_absolute })} />
              }
            />
          </FormGroup>
        </FormControl>
      </form></Paper>
    )
  }
}

function ScopeRuleForm() {
  return (<div>Scope rule</div>)
}

function ScopeTypeRuleForm() {
  return (<div>Scope type rule</div>)
}

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
    'title': "Crear regla de parametros",
    'content': <ParameterRuleForm />
  },
  {
    'title': "Crear reglas por ambito",
    'content': <ScopeRuleForm />
  },
  {
    'title': "Crar regla por tipo de ambito",
    'content': <ScopeTypeRuleForm />
  }

]

class RulesCreate extends Component {
  state = {
    value: 0,
  }

  componentDidMount() {
    //TODO: Cambiar value dependiendo de query params, para setear pestaña 
  }


  handleChange = (event, value) => {
    this.setState({ value });
  };

  createTabs = () => {
    let arr = [];
    tabs.forEach(function (value, i) {
      arr.push(<Tab key={i} label={value.title} />);
    });
    return arr;
  }

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs value={value} onChange={this.handleChange}>
            {this.createTabs()}
          </Tabs>
        </AppBar>
        {React.cloneElement(tabs[value].content, { classes })}
      </div>

    );
  }
}

RulesCreate.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RulesCreate);