import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import cookie from "js-cookie";
import ChipInput from "material-ui-chip-input";
import React from "react";
import { i18n, withNamespaces } from "../../../../i18n";
import { buildApiUrl } from "../../../../utils/api";
import { routerPush } from "../../../../utils/router";
import StepContentContainer from "../StepContentContainer";

const styles = theme => ({
  header: {
    marginBottom: theme.spacing.unit * 3,
    textAlign: "center"
  },
  classesLabel: {
    paddingBottom: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  },
  errorMessage: {
    color: "red"
  }
});

class CreateStep extends React.Component {
  state = {
    name: "",
    classes: [],
    isSubmitting: false
  };

  handleSubmit = event => {
    event.preventDefault();

    const project = cookie.get("project");
    const { t, token } = this.props;
    const { name, classes } = this.state;

    const dataSend = {
      project: project,
      estimator_type: "OD",
      name: name,
      classes: classes
    };

    // Reset messages
    this.setState({
      errorMsg: "",
      isSubmitting: true
    });

    axios
      .post(buildApiUrl("/estimators/"), dataSend, {
        headers: {
          Authorization: token,
          "Accept-Language": i18n.language
        }
      })
      .then(response => {
        const modelId = response.data.uuid;
        routerPush(`/models/new/od/upload?id=${modelId}`);
      })
      .catch(error => {
        if (error.response) {
          const { response } = error;
          if (response.status === 400) {
            if (response.data.hasOwnProperty("non_field_errors")) {
              this.setState({
                errorMsg: t("create_step.error_msg_duplicate"),
                isSubmitting: false
              });
            }
            if (response.data.hasOwnProperty("classes")) {
              this.setState({
                errorMsg: t("create_step.error_msg_classes"),
                isSubmitting: false
              });
            }
          }
        }

        if (!error.response || error.response.status >= 500) {
          this.setState({
            errorMsg: t("create_step.error_msg_internal"),
            isSubmitting: false
          });
        }
      });
  };

  handleNameChange = e => {
    this.setState({ name: e.target.value });
  };

  handleChangeClasses = chips => {
    this.setState({ classes: chips });
  };

  render() {
    const { classes, t } = this.props;
    const { isSubmitting, errorMsg } = this.state;

    return (
      <StepContentContainer>
        <Typography className={classes.header} component="h1" variant="h5">
          {t("create_step.title")}
        </Typography>
        <Typography variant="body2">{t("create_step.explanation")}</Typography>
        {errorMsg && (
          <Typography className={classes.errorMessage}>{errorMsg}</Typography>
        )}
        <form
          className={classes.form}
          method="post"
          onSubmit={this.handleSubmit}
        >
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="name">
              {t("create_step.name_label")}
            </InputLabel>
            <Input
              id="name"
              name="name"
              autoFocus
              onInput={this.handleNameChange}
              onChange={this.handleNameChange}
              value={this.state.name}
            />
            <FormHelperText>{t("create_step.name_helper")}</FormHelperText>
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <ChipInput
              label={t("create_step.classes_label")}
              onChange={chips => this.handleChangeClasses(chips)}
            />
            <FormHelperText>
              {t("create_step.classes_helper_1")} <kbd>Enter</kbd>
              {t("create_step.classes_helper_2")}
            </FormHelperText>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            className={classes.submit}
          >
            {t("create_step.submit_btn")}
          </Button>
        </form>
      </StepContentContainer>
    );
  }
}

CreateStep = withStyles(styles)(CreateStep);
CreateStep = withNamespaces("models")(CreateStep);

export default CreateStep;
