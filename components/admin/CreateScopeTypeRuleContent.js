import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withSnackbar } from "notistack";
import axios from "axios";
import { buildApiUrl } from "../../utils/api";
import {
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  Paper,
} from "@material-ui/core"
import SelectControl from './forms/SelectControl';
import InputControl from './forms/InputControl';
import SubmitButton from './forms/SubmitButton';
import DestroyButton from './forms/DestroyButton';
import { routerPush } from "../../utils/router";
import config from "../../config";

const { measurementContentTypes } = config;

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2)
  },
  button: {
    marginRight: theme.spacing(1)
  }
});

const ChangeTypeControl = ({ value, onChange }) => (
  <FormControl component="fieldset">
    <FormLabel component="legend">Tipo de Cambio</FormLabel>
    <RadioGroup aria-label="change_type" name="change_type" value={value} onChange={onChange}>
      <FormControlLabel value="A" control={<Radio />} label="Área" />
      <FormControlLabel value="P" control={<Radio />} label="Porcentaje" />
    </RadioGroup>
  </FormControl>
)

class ScopeTypeRuleForm extends React.Component {
  state = {
    fields: {
      scope_type: null,
      measurement_content_type: "",
      change_type: "",
      valid_min: "",
      valid_max: ""
    },
    loaded: false,
  }

  async componentDidMount() {
    await this.fetchScopeTypes();

    const { id } = this.props;
    if (id) {
      await this.fetchRule(id);
    }

    this.setState({ loaded: true });
  }

  async fetchScopeTypes() {
    try {
      const response = await axios.get(buildApiUrl("/scopes/types/"));
      const scopeTypes = response.data.map(scopeType => ({
        id: scopeType.type,
        name: scopeType.name
      }));
      this.setState({ scopeTypes });
    } catch (err) {
      console.error(err);
      this.props.enqueueSnackbar("Failed to get scope types", { variant: 'error' });
    }
  }

  async fetchRule(id) {
    const { token } = this.props;

    try {
      const response = await axios.get(buildApiUrl(`/alerts/scope-type-rules/${id}/`), {
        headers: { Authorization: token }
      });

      const {
        scope_type,
        measurement_content_type,
        change_type,
        valid_min,
        valid_max
      } = response.data;

      this.setState({
        fields: {
          scope_type,
          measurement_content_type,
          change_type,
          valid_max,
          valid_min,
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
      await axios.post(buildApiUrl("/alerts/scope-type-rules/"),
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
      await axios.put(buildApiUrl(`/alerts/scope-type-rules/${id}/`),
        fields,
        { headers: { Authorization: token } }
      );
      enqueueSnackbar("Rule updated", { variant: 'success' })
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

  render() {
    const { classes, id } = this.props;
    const { scopeTypes, fields, loaded } = this.state;

    return <Paper className={classes.root}>
      <form
        className={classes.form}
        method="post"
        onSubmit={this.handleSubmit}
      >
        <SelectControl
          id="scope_type"
          label="Tipo de Ámbito"
          value={fields.scope_type}
          items={scopeTypes}
          disabled={!loaded}
          onChange={this.handleChange}
        />
        <SelectControl
          id="measurement_content_type"
          label="Tipo de Cobertura"
          value={fields.measurement_content_type}
          items={measurementContentTypes}
          disabled={!loaded}
          onChange={this.handleChange}
        />
        <ChangeTypeControl
          value={fields.change_type}
          onChange={this.handleChange}
          disabled={!loaded}
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
        <SubmitButton edit={id} disabled={!loaded} />
        {id && <DestroyButton />}
      </form>
    </Paper>
  }
}

ScopeTypeRuleForm = withStyles(styles)(ScopeTypeRuleForm);
ScopeTypeRuleForm = withSnackbar(ScopeTypeRuleForm);

const CreateScopeTypeRuleContent = (props) => <ScopeTypeRuleForm {...props} />;

export default CreateScopeTypeRuleContent;