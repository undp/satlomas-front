import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withSnackbar } from "notistack";
import {
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  Tooltip,
  TableHead,
  TableRow,
  TableContainer,
  TableCell,
  IconButton,
} from '@material-ui/core';
import axios from "axios";
import { i18n, withTranslation } from "../../i18n";
import Moment from "react-moment";
import { buildApiUrl } from "../../utils/api";
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import { routerPush } from "../../utils/router";

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  newButton: {
    marginLeft: theme.spacing(2)
  }
});

let ScopeTypeRulesTable = (props) => {
  const { t, classes, rows } = props;
  const locale = i18n.language;

  return (
    <Paper className={classes.root}>
      <TableContainer>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Tipo de Ámbito</TableCell>
              <TableCell>Tipo de Cobertura</TableCell>
              <TableCell>Tipo de Medida</TableCell>
              <TableCell>Rango</TableCell>
              <TableCell>Fecha de creación</TableCell>
              <TableCell>Fecha de modificación</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.scope_type ? row.scope_type : 'Cualquiera'}</TableCell>
                <TableCell>{row.measurement_content_type}</TableCell>
                <TableCell>{row.change_type}</TableCell>
                <TableCell>{row.valid_min} - {row.valid_max}</TableCell>
                <TableCell><Moment locale={locale} fromNow>{row.created_at}</Moment></TableCell>
                <TableCell><Moment locale={locale} fromNow>{row.updated_at}</Moment></TableCell>
                <TableCell align="right">
                  <Tooltip title="Editar">
                    <IconButton
                      onClick={() => routerPush(`/admin/scope-type-rules/${row.id}`)}
                      aria-label="Editar regla"
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

ScopeTypeRulesTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

ScopeTypeRulesTable = withStyles(styles)(ScopeTypeRulesTable);
ScopeTypeRulesTable = withTranslation(["me", "common"])(ScopeTypeRulesTable);

class ScopeTypeRulesListContent extends React.Component {
  state = {
    rows: [],
    loaded: false,
  };

  async componentDidMount() {
    this.fetchData();
  }

  async fetchData() {
    const { token } = this.props;

    try {
      const response = await axios.get(buildApiUrl("/alerts/scope-type-rules"), {
        headers: { Authorization: token }
      })
      this.setState({ rows: response.data });
    } catch (err) {
      console.error(err);
      this.props.enqueueSnackbar('Failed to get scope type rules', { variant: "error" })
      this.setState({ rows: [] });
    }
  }

  render() {
    const { classes } = this.props;
    const { rows } = this.state;

    return (
      <div className={classes.root}>
        <Typography
          variant="h6"
          className={classes.title}
          gutterBottom
        >
          Reglas de parámetro
          <Button
            onClick={() => routerPush("/admin/scope-type-rules/new")}
            className={classes.newButton}
            startIcon={<AddIcon />}
          >Nueva regla</Button>
        </Typography>
        <ScopeTypeRulesTable rows={rows} />
      </div >
    );
  }
}

ScopeTypeRulesListContent.propTypes = {
  classes: PropTypes.object.isRequired,
};

ScopeTypeRulesListContent = withStyles(styles)(ScopeTypeRulesListContent);
ScopeTypeRulesListContent = withSnackbar(ScopeTypeRulesListContent);

export default ScopeTypeRulesListContent;
