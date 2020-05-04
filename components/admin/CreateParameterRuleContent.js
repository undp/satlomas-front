import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withSnackbar } from "notistack";
import axios from "axios";
import { buildApiUrl } from "../../utils/api";
import { Paper } from "@material-ui/core"
import SelectControl from './forms/SelectControl';
import InputControl from './forms/InputControl';
import CheckboxControl from './forms/CheckboxControl';
import SubmitButton from './forms/SubmitButton';
import BackButton from './forms/BackButton';
import DestroyButton from './forms/DestroyButton';
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

class ParameterRuleForm extends React.Component {
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

      routerPush("/admin/parameter-rules");
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

    return <Paper className={classes.root}>
      <form
        className={classes.form}
        method="post"
        onSubmit={this.handleSubmit}
      >
        <SelectControl
          id="station"
          label="Estación"
          items={stations}
          value={fields.station}
          disabled={!loaded}
          onChange={this.handleChange}
        />
        <SelectControl
          id="parameter"
          label="Parámetro"
          items={stationParameters}
          value={fields.parameter}
          disabled={!loaded}
          onChange={this.handleChange}
        />
        <InputControl
          id="valid_min"
          label="Valor mínimo"
          onChange={this.handleChange}
          value={fields.valid_min}
          disabled={!loaded}
        />
        <InputControl
          id="valid_max"
          label="Valor máximo"
          onChange={this.handleChange}
          value={fields.valid_max}
          disabled={!loaded}
        />
        <CheckboxControl
          label="¿Es absoluto?"
          checked={fields.is_absolute}
          onChange={this.handleIsAbsoluteChange}
          disabled={!loaded}
        />
        <SubmitButton edit={id} disabled={!loaded} />
        {id && <DestroyButton />}
        <BackButton url={'/admin/parameter-rules'}/>
      </form>
    </Paper>
  }
}

ParameterRuleForm = withStyles(styles)(ParameterRuleForm);
ParameterRuleForm = withSnackbar(ParameterRuleForm);

const CreateParameterRuleContent = (props) => <ParameterRuleForm {...props} />;

export default CreateParameterRuleContent;