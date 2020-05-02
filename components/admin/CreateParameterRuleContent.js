import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withSnackbar } from "notistack";
import axios from "axios";
import { buildApiUrl } from "../../utils/api";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
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

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2)
  },
  button: {
    marginRight: theme.spacing(1)
  }
});

let StationsSelectControl = ({ classes, items, value, disabled, onChange }) => (
  <FormControl className={classes.formControl} fullWidth>
    <InputLabel htmlFor="station">Estación</InputLabel>
    <Select
      value={value || '---'}
      onChange={onChange}
      inputProps={{
        name: 'station',
        id: 'station',
      }}
      disabled={disabled}
    >
      <MenuItem value="---">Cualquiera</MenuItem>
      {items.map(item =>
        (<MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)
      )}
    </Select>
  </FormControl>
)

StationsSelectControl = withStyles(styles)(StationsSelectControl);

let ParametersSelectControl = ({ classes, value, disabled, onChange }) => (
  <FormControl required className={classes.formControl} fullWidth>
    <InputLabel htmlFor="parameter">Parámetro</InputLabel>
    <Select
      value={value || ""}
      onChange={onChange}
      inputProps={{
        name: 'parameter',
        id: 'parameter',
      }}
      className={classes.selectEmpty}
      disabled={disabled}
    >
      {stationParameters.map(parameter =>
        (<MenuItem key={parameter.id} value={parameter.id}>{parameter.name}</MenuItem>)
      )}
    </Select>
  </FormControl>
)

ParametersSelectControl = withStyles(styles)(ParametersSelectControl);

class ParameterRuleForm extends Component {
  state = {
    fields: {
      station: null,
      parameter: null,
      is_absolute: false,
      valid_min: "",
      valid_max: "",
    },
    stations: [],
    loaded: false,
  }

  async componentDidMount() {
    await this.fetchStations();

    const { id } = this.props;
    if (id) {
      await this.fetchRule(id);
    }

    this.setState({ loaded: true });
  }

  async fetchStations() {
    try {
      const response = await axios.get(buildApiUrl("/stations/stations"));
      this.setState({ stations: response.data });
    } catch (err) {
      console.error(err);
      this.props.enqueueSnackbar("Failed to get stations", { variant: 'error' });
    }
  }

  async fetchRule(id) {
    const { token } = this.props;

    try {
      const response = await axios.get(buildApiUrl(`/alerts/parameter-rules/${id}/`), {
        headers: { Authorization: token }
      });

      const { parameter, is_absolute, valid_min, valid_max, station } = response.data;
      this.setState({
        fields: {
          parameter,
          is_absolute,
          valid_max,
          valid_min,
          station: station && station.id,
        }
      });
    } catch (err) {
      console.error(err);
      this.props.enqueueSnackbar("Failed to get rule attributes", { variant: 'error' });
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    const { id } = this.props;
    if (id) {
      this.patchRule(id);
    } else {
      this.createRule();
    }
  }

  async createRule() {
    const { token } = this.props;
    const { fields } = this.state;

    try {
      await axios.post(buildApiUrl("/alerts/parameter-rules/"),
        fields,
        { headers: { Authorization: token } }
      );

      routerPush("/admin/rules");
    } catch (err) {
      console.error(err);
      this.props.enqueueSnackbar("Failed to create new rule", { variant: 'error' });
    }
  }

  async patchRule(id) {
    const { token, enqueueSnackbar } = this.props;
    const { fields } = this.state;

    try {
      await axios.put(buildApiUrl(`/alerts/parameter-rules/${id}/`),
        fields,
        { headers: { Authorization: token } }
      );
      enqueueSnackbar("Rule updated", { variant: 'success' })
      // routerPush("/admin/parameter-rules");
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Failed to update rule", { variant: 'error' });
    }
  }

  handleChange = (event) => {
    const { target } = event;

    this.setState(prevState => ({
      fields: {
        ...prevState.fields,
        [target.name]: target.value
      }
    }));
  }

  handleIsAbsoluteChange = () => {
    this.setState(prevState => ({
      fields: {
        ...prevState.fields,
        is_absolute: !prevState.fields.is_absolute
      }
    }));
  }

  render() {
    const { classes, id } = this.props;
    const { stations, fields, loaded } = this.state;

    return (<Paper className={classes.root}>
      <form
        className={classes.form}
        method="post"
        onSubmit={this.handleSubmit}
      >
        <StationsSelectControl
          items={stations}
          value={fields.station}
          disabled={!loaded}
          onChange={this.handleChange}
        />
        <ParametersSelectControl
          value={fields.parameter}
          disabled={!loaded}
          onChange={this.handleChange}
        />
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="valid_min">
            Valor mínimo
          </InputLabel>
          <Input
            id="valid_min"
            name="valid_min"
            autoFocus
            onChange={this.handleChange}
            value={fields.valid_min}
            disabled={!loaded}
          />
        </FormControl>
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="valid_max">
            Valor máximo
          </InputLabel>
          <Input
            id="valid_max"
            name="valid_max"
            autoFocus
            onChange={this.handleChange}
            value={fields.valid_max}
            disabled={!loaded}
          />
        </FormControl>
        <FormControl component="fieldset" className={classes.formControl} fullWidth>
          <FormLabel component="legend">¿Es absoluto?</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={fields.is_absolute}
                  onChange={this.handleIsAbsoluteChange}
                  disabled={!loaded}
                />
              }
            />
          </FormGroup>
        </FormControl>
        <Button variant="contained" value="create" color="primary" type="submit" className={classes.button} disabled={!loaded}>
          {id ? 'Guardar' : 'Crear'}
        </Button>
        {id && <Button variant="contained" disabled value="delete" color="secondary" type="submit" className={classes.button}>
          Eliminar
        </Button>}
      </form></Paper>
    )
  }
}

ParameterRuleForm = withStyles(styles)(ParameterRuleForm);
ParameterRuleForm = withSnackbar(ParameterRuleForm);

const CreateParameterRuleContent = (props) => <ParameterRuleForm {...props} />;

export default CreateParameterRuleContent;