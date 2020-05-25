import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
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
import { i18n, withTranslation } from "../../i18n";
import Moment from "react-moment";
import EditIcon from '@material-ui/icons/Edit';
import { routerPush } from "../../utils/router";
import RulesListContent from "./RulesListContent";
import { withSnackbar } from 'notistack';
import axios from "axios";
import { buildApiUrl } from "../../utils/api";

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  newButton: {
    marginLeft: theme.spacing(2)
  }
});

const getScopeName = (scopes, id) => {
  if (!id) return 'Cualquiera';
  if (!scopes) return '';
  const scope = scopes[id];
  if (!scope) return '';
  return `${scope.scope_type} - ${scope.name}`
}

let ScopeRulesTable = (props) => {
  const { t, classes, scopes, rows } = props;
  const locale = i18n.language;

  return (
    <Paper className={classes.root}>
      <TableContainer>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Ámbito</TableCell>
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
                <TableCell>{getScopeName(scopes, row.scope)}</TableCell>
                <TableCell>{t(`measurement_content_type.${row.measurement_content_type}`)}</TableCell>
                <TableCell>{t(`change_type.${row.change_type}`)}</TableCell>
                <TableCell>{row.valid_min} - {row.valid_max}</TableCell>
                <TableCell><Moment locale={locale} fromNow>{row.created_at}</Moment></TableCell>
                <TableCell><Moment locale={locale} fromNow>{row.updated_at}</Moment></TableCell>
                <TableCell align="right">
                  <Tooltip title="Editar">
                    <IconButton
                      onClick={() => routerPush(`/user/scope-rules/${row.id}`)}
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

ScopeRulesTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

ScopeRulesTable = withTranslation(["me", "common"])(ScopeRulesTable);
ScopeRulesTable = withStyles(styles)(ScopeRulesTable);

class ScopeRulesListContent extends React.Component {
  state = {
    scopes: {}
  }

  componentDidMount() {
    this.fetchScopes()
  }

  async fetchScopes() {
    try {
      // Fetch all scopes, skipping geometry field
      const response = await axios.get(buildApiUrl("/scopes/"), { params: { skipgeom: 1 } });
      const scopesArray = response.data;
      let scopes = {};
      for (let i = 0; i < scopesArray.length; i++) {
        const scope = scopesArray[i];
        scopes[scope.id] = scope;
      }
      this.setState({ scopes });
    } catch (err) {
      console.error(err);
      this.props.enqueueSnackbar("Failed to get scopes", { variant: 'error' });
    }
  }

  render() {
    const { token } = this.props;
    const { scopes } = this.state;

    return (
      <RulesListContent
        token={token}
        ruleType="scope"
        title="Reglas por Ámbito"
        tableComponent={<ScopeRulesTable scopes={scopes} />} />
    );
  }
}

ScopeRulesListContent = withSnackbar(ScopeRulesListContent);

export default ScopeRulesListContent;
