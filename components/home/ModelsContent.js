import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from '@material-ui/icons/Edit';
import Chip from "@material-ui/core/Chip";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import cookie from "js-cookie";
import PropTypes from "prop-types";
import React from "react";
import Moment from "react-moment";
import { routerPush } from "../../utils/router";
import { i18n, Link, withNamespaces } from "../../i18n";
import { buildApiUrl } from "../../utils/api";
import { logout } from "../../utils/auth";
import ShowUuidDialog from "../ShowUuidDialog";
import ConfirmationDialog from "../ConfirmationDialog";

const styles = theme => ({
  root: {
    width: "100%",
    overflowX: "auto"
  },
  table: {
    minWidth: 700
  },
  title: {
    marginBottom: theme.spacing.units * 10
  },
  modelBtn: {
    float: "right"
  },
  chip: {
    marginRight: theme.spacing.unit
  }
});

let NewModelButton = ({ t, className }) => (
  <Link href="/models/new">
    <Button className={className}>{t("models.new_btn")}</Button>
  </Link>
);

NewModelButton = withNamespaces("me")(NewModelButton);

class ModelsContent extends React.Component {
  state = {
    models: [],
    contextualMenuOpen: null,
    showUuidDialogOpen : false,
    deleteDialogOpen: false,
    currentUUID: ""
  };

  getModels = async () => {
    const projectId = cookie.get("project");
    axios
      .get(buildApiUrl("/estimators/"), {
        params: { project_uuid: projectId },
        headers: { Authorization: this.props.token }
      })
      .then(response => {
        this.setState({ models: response.data.results,
                        deleteDialogOpen: false });
      })
      .catch(err => {
        const response = err.response;
        if (response && response.status === 401) {
          logout();
        } else {
          console.error(response);
        }
      });
  }
  
  componentDidMount() {
    this.getModels();
  }

  estimatorTypeName(model) {
    const { t } = this.props;
    return t(`models.types.${model.estimator_type}`);
  }

  handleContextualMenuClick = event => {
    this.setState({contextualMenuOpen: event.currentTarget});
  }

  handleContextualMenuClose = () => {
    this.setState({contextualMenuOpen: null});
  }

  onDialogResult = async (action) => {
    this.setState({
      showUuidDialogOpen: false,
      deleteDialogOpen: false,
      currentUUID: ""
    })
  }

  estimatorViewUUID = model => {
    this.setState({
      currentUUID: model.uuid,
      showUuidDialogOpen: true
    })
  }

  estimatorDelete = model => {
    this.setState({
      currentUUID: model.uuid,
      deleteDialogOpen: true
    })
  }

  onDeleteDialogResult = async (action) => {
    if (action) {
      const currentUUID = this.state.currentUUID;
      await axios.delete(
        buildApiUrl(`/estimators/${currentUUID}`), 
        {
          headers: { Authorization: this.props.token } 
        }
      ).then(() => {
        this.getModels();
      });
    }
    this.setState({
      deleteDialogOpen: false
    })
  }

  estimatorAddImages = model => {
    routerPush(`/models/new/od/upload?id=${model.uuid}`);
  }
  estimatorAddAnnotations = model => {
    routerPush(`/models/new/od/annotate?id=${model.uuid}`);
  }

  render() {
    const { t, classes } = this.props;
    const { models: models, contextualMenuOpen, showUuidDialogOpen, currentUUID,deleteDialogOpen } = this.state;
    const locale = i18n.language;

    return (
      <div>
        <Typography
          className={classes.title}
          variant="h4"
          gutterBottom
          component="h2"
        >
          <NewModelButton className={classes.modelBtn} />
          {t("models.title")}
        </Typography>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>{t("models.name")}</TableCell>
                <TableCell>{t("models.estimator_type")}</TableCell>
                <TableCell>{t("models.classes")}</TableCell>
                <TableCell>{t("models.created_at")}</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {models.map((model, i) => (
                <TableRow key={i}>
                  <TableCell component="th" scope="row">
                    {model.name}
                  </TableCell>
                  <TableCell>{this.estimatorTypeName(model)}</TableCell>
                  <TableCell>
                    {model.classes.map(cls => (
                      <Chip className={classes.chip} key={cls} label={cls} />
                    ))}
                  </TableCell>
                  <TableCell>
                    <Moment locale={locale} fromNow>
                      {model.created_at}
                    </Moment>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      className={classes.button}
                      aria-label="Edit"
                      aria-controls="simple-menu" 
                      aria-haspopup="true" 
                      onClick={this.handleContextualMenuClick}
                    >
                      <EditIcon />
                    </IconButton>
                    <Menu
                      id="edit-estimator-menu"
                      anchorEl={contextualMenuOpen}
                      keepMounted
                      open={Boolean(contextualMenuOpen)}
                      onClose={this.handleContextualMenuClose}
                    >
                      <MenuItem onClick={ () => this.estimatorViewUUID(model)}>{t("models.uuid")}</MenuItem>
                      <MenuItem onClick={ () => this.estimatorAddImages(model)}>{t("models.add_imgs")}</MenuItem>
                      <MenuItem onClick={ () => this.estimatorAddAnnotations(model)}>{t("models.add_annot")}</MenuItem>
                      <MenuItem onClick={ () => this.estimatorDelete(model)}>{t("models.delete_models")}</MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
        <ShowUuidDialog
          onClose={this.onDialogResult} 
          open={showUuidDialogOpen}
          title={"UUID"}
          content={currentUUID}
        />
        <ConfirmationDialog
          onClose={this.onDeleteDialogResult} 
          open={deleteDialogOpen}
          title={t("models.title_delete")}
          content={
            <div>
              <p>{t("models.text_delete")}</p>
              <p><strong>{t("models.text_delete_warning")}</strong></p>
            </div>
           }
        />
      </div>
    );
  }
}

ModelsContent.propTypes = {
  classes: PropTypes.object.isRequired
};

ModelsContent = withStyles(styles)(ModelsContent);
ModelsContent = withNamespaces("me")(ModelsContent);

export default ModelsContent;
