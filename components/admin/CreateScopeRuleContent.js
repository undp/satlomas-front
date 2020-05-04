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
import BackButton from './forms/BackButton'
import ConfirmationDialog from '../ConfirmationDialog';
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

class ScopeRuleForm extends React.Component {
  state = {
    fields: {
      scope: null,
      measurement_content_type: "",
      change_type: "",
      valid_min: "",
      valid_max: ""
    },
    loaded: false,
    openConfirmationDialog: false,
  }

  async componentDidMount() {
    await this.fetchScopes();

    const { id } = this.props;
    if (id) {
      await this.fetchRule(id);
    }

    this.setState({ loaded: true });
  }

  async fetchScopes() {
    try {
      // Fetch all scopes, skipping geometry field
      const response = await axios.get(buildApiUrl("/scopes/"), { params: { skipgeom: 1 } });
      const scopes = response.data.map(scope => ({
        id: scope.id,
        name: `${scope.scope_type} - ${scope.name}`,
      }));
      this.setState({ scopes });
    } catch (err) {
      console.error(err);
      this.props.enqueueSnackbar("Failed to get scopes", { variant: 'error' });
    }
  }

  async fetchRule(id) {
    const { token } = this.props;

    try {
      const response = await axios.get(buildApiUrl(`/alerts/scope-rules/${id}/`), {
        headers: { Authorization: token }
      });

      const {
        scope,
        measurement_content_type,
        change_type,
        valid_min,
        valid_max
      } = response.data;

      this.setState({
        fields: {
          scope,
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
      await axios.post(buildApiUrl("/alerts/scope-rules/"),
        fields,
        { headers: { Authorization: token } }
      );

      routerPush("/admin/scope-rules");
    } catch (err) {
      console.error(err);
      this.props.enqueueSnackbar("Failed to create new rule", { variant: 'error' });
    }
  }

  async patchRule(id) {
    const { token, enqueueSnackbar } = this.props;
    const { fields } = this.state;

    try {
      await axios.put(buildApiUrl(`/alerts/scope-rules/${id}/`),
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

  handleDelete = () => {
    this.setState({openConfirmationDialog: true});
  }

  onDialogResult = async action => {
    const { id, token } = this.props;
    if(action){
      try {
        await axios.delete(buildApiUrl(`/alerts/scope-rules/${id}/`),
          { headers: { Authorization: token } }
        );
        this.props.enqueueSnackbar("Rule deleted", { variant: 'success' })
        routerPush("/admin/scope-rules");
      } catch (err) {
        console.error(err);
        this.props.enqueueSnackbar("Failed to delete rule", { variant: 'error' });
      }
    }
    this.setState({
      openConfirmationDialog: false
    });
  }

  render() {
    const { classes, id } = this.props;
    const { scopes, fields, loaded, openConfirmationDialog } = this.state;

    return <Paper className={classes.root}>
      <form
        className={classes.form}
        method="post"
        onSubmit={this.handleSubmit}
      >
        <SelectControl
          id="scope"
          label="Ámbito"
          value={fields.scope}
          items={scopes}
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
        <BackButton url={'/admin/scope-rules'}/>
        {id && <DestroyButton onClick={this.handleDelete}/>}
        <ConfirmationDialog
          onClose={this.onDialogResult}
          open={openConfirmationDialog}
          title={"Eliminar"}
          content={"¿Esta seguro que desea eliminar esta regla?"}
          delete={true}
        />
      </form>
    </Paper>
  }
}

ScopeRuleForm = withStyles(styles)(ScopeRuleForm);
ScopeRuleForm = withSnackbar(ScopeRuleForm);

const CreateScopeRuleContent = (props) => <ScopeRuleForm {...props} />;

export default CreateScopeRuleContent;
