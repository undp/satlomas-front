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
import Button from '@material-ui/core/Button';
import { routerPush } from "../../utils/router";
import config from "../../config";

const { stationParameters } = config;

class ParameterRuleForm extends Component {
  state = {
    station: null,
    parameter: null,
    is_absolute: false,
    valid_min: "",
    valid_max: "",
    stations: [],
  }

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  async componentDidMount() {
    const { token } = this.props;
    const response = await axios.get(buildApiUrl("/stations/stations"), { headers: { Authorization: token } });
    this.setState({ stations: response.data });
    //Check if ID is in params
    if (false) {
      const response = await axios.get(buildApiUrl("/alerts/parameter-rules/" + 1), { headers: { Authorization: token } });
      this.setState({
        parameter: response.data["parameter"],
        valid_max: response.data["valid_max"],
        valid_min: response.data["valid_min"],
        station: response.data["station"],
      });
    }
  }

  async handleSubmit() {
    event.preventDefault();
    const data = this.state;
    const { token } = this.props;
    await axios.
      post(buildApiUrl("/alerts/parameter-rules/"),
        data,
        { headers: { Authorization: token } }
      ).then(response => {
        routerPush("/admin/rules");
      })
      .catch(error => {
        //TODO: Informar errores
        console.error(error);
      });
  }

  handleChange = (event) => {
    const { target } = event
    this.setState({ [target.name]: target.value });
  }

  render() {
    const { classes } = this.props;
    return (<Paper className={classes.root}>
      <form
        className={classes.form}
        method="post"
        onSubmit={this.handleSubmit}
      >
        <FormControl required className={classes.formControl} fullWidth>
          <InputLabel htmlFor="station">Station</InputLabel>
          <Select
            value={this.state.station}
            onChange={this.handleChange}
            inputProps={{
              name: 'station',
              id: 'station',
            }}
          >
            {this.state.stations.map(station =>
              (<MenuItem key={station.id} value={station.id}>{station.name}</MenuItem>)
            )}
          </Select>
        </FormControl>

        <FormControl required className={classes.formControl} fullWidth>
          <InputLabel htmlFor="station">Parameter</InputLabel>
          <Select
            value={this.state.parameter}
            onChange={this.handleChange}
            inputProps={{
              name: 'parameter',
              id: 'parameter',
            }}
            className={classes.selectEmpty}
          >
            {stationParameters.map(parameter =>
              (<MenuItem key={parameter.id} value={parameter.id}>{parameter.name}</MenuItem>)
            )}
          </Select>
        </FormControl>

        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="valid_min">
            Valor minimo
          </InputLabel>
          <Input
            id="valid_min"
            name="valid_min"
            autoFocus
            onChange={this.handleChange}
            value={this.state.valid_min}
          />
        </FormControl>

        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="valid_max">
            Valor maximo
          </InputLabel>
          <Input
            id="valid_max"
            name="valid_max"
            autoFocus
            onChange={this.handleChange}
            value={this.state.valid_max}
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
        <Button variant="contained" color="primary" type="submit" className={classes.button}>
          Crear
        </Button>
      </form></Paper>
    )
  }
}

const COVERAGE_MEASUREMENT_MODELS = [
  { id: 'lomas_change', name: 'Lomas' },
  { id: 'vi_lomas_change', name: 'Vegetacion' }
]

class ScopeRuleForm extends Component {
  state = {
    scopes: [],
    scope: null,
    measurement_content_type: null,
    change_type: null,
    valid_max: "",
    valid_min: "",
  }

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    const { token } = this.props;
    const response = await axios.get(buildApiUrl("/scopes"), { headers: { Authorization: token } });
    this.setState({ scopes: response.data });
    //Check if ID is in params
    if (false) {
      const response = await axios.get(buildApiUrl("/alerts/scope-rules/" + 1), { headers: { Authorization: token } });
      this.setState({
        measurement_content_type: response.data['measurement_content_type'],
        scope: response.data["scope"],
        valid_max: response.data["valid_max"],
        valid_min: response.data["valid_min"],
        change_type: response.data["change_type"].charAt(0).toUpperCase(),
      });
    }
  }
  handleChange = (event) => {
    const { target } = event
    this.setState({ [target.name]: target.value });
  }

  async handleSubmit() {
    event.preventDefault();
    const data = this.state;
    const { token } = this.props;
    console.log(data);
    //Error: "Request failed with status code 400"
    //api_1_ec142b081fd2 | Bad Request: /scopes-rules/
    //api_1_ec142b081fd2 | [29/Apr/2020 19:20:44] "POST /scopes-rules/ HTTP/1.1" 400 142
    await axios.
      post(buildApiUrl("/alerts/scopes-rules/"),
        data,
        { headers: { Authorization: token } }
      ).then(response => {
        routerPush("/admin/rules");
      })
      .catch(error => {
        //TODO: Informar errores
        console.error(error);
      });
  }


  render() {
    const { classes } = this.props;
    return (<Paper className={classes.root}>
      <form
        className={classes.form}
        method="post"
        onSubmit={this.handleSubmit}
      >
        <FormControl required className={classes.formControl} fullWidth>
          <InputLabel htmlFor="scope">Ambito</InputLabel>
          <Select
            value={this.state.scope}
            onChange={this.handleChange}
            inputProps={{
              name: 'scope',
              id: 'scope',
            }}
          >
            {this.state.scopes.map(scope =>
              (<MenuItem key={scope.id} value={scope.id}>{scope.name}</MenuItem>)
            )}
          </Select>
        </FormControl>

        <FormControl required className={classes.formControl} fullWidth>
          <InputLabel htmlFor="measurement_content_type">Medida</InputLabel>
          <Select
            value={this.state.measurement_content_type}
            onChange={this.handleChange}
            inputProps={{
              name: 'measurement_content_type',
              id: 'measurement_content_type',
            }}
            className={classes.selectEmpty}
          >
            {COVERAGE_MEASUREMENT_MODELS.map(coverage =>
              (<MenuItem key={coverage.id} value={coverage.id}>{coverage.name}</MenuItem>)
            )}
          </Select>
        </FormControl>

        <FormControl required className={classes.formControl} fullWidth>
          <InputLabel htmlFor="change_type">Tipo de medida</InputLabel>
          <Select
            value={this.state.change_type}
            onChange={this.handleChange}
            inputProps={{
              name: 'change_type',
              id: 'change_type',
            }}
            className={classes.selectEmpty}
          >
            <MenuItem value={"A"}>{"Area"}</MenuItem>)
            <MenuItem value={"P"}>{"Porcentaje"}</MenuItem>)
          </Select>
        </FormControl>

        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="valid_min">
            Valor minimo
          </InputLabel>
          <Input
            id="valid_min"
            name="valid_min"
            autoFocus
            onChange={this.handleChange}
            value={this.state.valid_min}
          />
        </FormControl>

        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="valid_max">
            Valor maximo
          </InputLabel>
          <Input
            id="valid_max"
            name="valid_max"
            autoFocus
            onChange={this.handleChange}
            value={this.state.valid_max}
          />
        </FormControl>
        <Button variant="contained" color="primary" type="submit" className={classes.button}>
          Crear
        </Button>
      </form></Paper>
    )
  }
}


const SCOPE_TYPES = [
  { id: 'CE', name: 'Corredores Ecologicos' },
  { id: 'AC', name: 'ACR' },
  { id: 'DI', name: 'Distritos' },
  { id: 'EF', name: 'Ecosistemas fragiles' },
  { id: 'SA', name: 'Sitios arqueologicos' },
]


class ScopeTypeRuleForm extends Component {
  state = {
    scope_type: null,
    measurement_content_type: null,
    change_type: null,
    valid_max: "",
    valid_min: "",
  }

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (event) => {
    const { target } = event
    this.setState({ [target.name]: target.value });
  }

  async handleSubmit() {
    event.preventDefault();
    const data = this.state;
    const { token } = this.props;
    console.log(data);
    await axios.
      post(buildApiUrl("/alerts/scope-type-rules/"),
        data,
        { headers: { Authorization: token } }
      ).then(response => {
        routerPush("/admin/rules");
      })
      .catch(error => {
        //TODO: Informar errores
        console.error(error);
      });
  }


  render() {
    const { classes } = this.props;
    return (<Paper className={classes.root}>
      <form
        className={classes.form}
        method="post"
        onSubmit={this.handleSubmit}
      >
        <FormControl required className={classes.formControl} fullWidth>
          <InputLabel htmlFor="scope_type">Tipo de Ambito</InputLabel>
          <Select
            value={this.state.scope_type}
            onChange={this.handleChange}
            inputProps={{
              name: 'scope_type',
              id: 'scope_type',
            }}
          >
            {SCOPE_TYPES.map(scope =>
              (<MenuItem key={scope.id} value={scope.id}>{scope.name}</MenuItem>)
            )}
          </Select>
        </FormControl>

        <FormControl required className={classes.formControl} fullWidth>
          <InputLabel htmlFor="measurement_content_type">Medida</InputLabel>
          <Select
            value={this.state.measurement_content_type}
            onChange={this.handleChange}
            inputProps={{
              name: 'measurement_content_type',
              id: 'measurement_content_type',
            }}
            className={classes.selectEmpty}
          >
            {COVERAGE_MEASUREMENT_MODELS.map(coverage =>
              (<MenuItem key={coverage.id} value={coverage.id}>{coverage.name}</MenuItem>)
            )}
          </Select>
        </FormControl>

        <FormControl required className={classes.formControl} fullWidth>
          <InputLabel htmlFor="change_type">Tipo de medida</InputLabel>
          <Select
            value={this.state.change_type}
            onChange={this.handleChange}
            inputProps={{
              name: 'change_type',
              id: 'change_type',
            }}
            className={classes.selectEmpty}
          >
            <MenuItem value={"A"}>{"Area"}</MenuItem>)
            <MenuItem value={"P"}>{"Porcentaje"}</MenuItem>)
          </Select>
        </FormControl>

        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="valid_min">
            Valor minimo
          </InputLabel>
          <Input
            id="valid_min"
            name="valid_min"
            autoFocus
            onChange={this.handleChange}
            value={this.state.valid_min}
          />
        </FormControl>

        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="valid_max">
            Valor maximo
          </InputLabel>
          <Input
            id="valid_max"
            name="valid_max"
            autoFocus
            onChange={this.handleChange}
            value={this.state.valid_max}
          />
        </FormControl>
        <Button variant="contained" color="primary" type="submit" className={classes.button}>
          Crear
        </Button>
      </form></Paper>
    )
  }
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

class RulesCreateContent extends Component {
  state = {
    value: 0,
    id: null,
  }

  componentDidMount() {
    const { tab, id } = this.props;
    if (id !== 'undefined') {
      this.setState({ id });
    }
    this.setState({ value: parseInt(tab) });
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
    const { classes, token } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs value={value} onChange={this.handleChange}>
            {this.createTabs()}
          </Tabs>
        </AppBar>
        {React.cloneElement(tabs[value].content, { classes, token })}
      </div>

    );
  }
}

RulesCreateContent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RulesCreateContent);