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

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  newButton: {
    marginLeft: theme.spacing(2)
  }
});

let ScopeRulesTable = (props) => {
  const { t, classes, rows } = props;
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
                <TableCell>{row.scope ? row.scope.name : 'Cualquiera'}</TableCell>
                <TableCell>{row.measurement_content_type}</TableCell>
                <TableCell>{row.change_type}</TableCell>
                <TableCell>{row.valid_min} - {row.valid_max}</TableCell>
                <TableCell><Moment locale={locale} fromNow>{row.created_at}</Moment></TableCell>
                <TableCell><Moment locale={locale} fromNow>{row.updated_at}</Moment></TableCell>
                <TableCell align="right">
                  <Tooltip title="Editar">
                    <IconButton
                      onClick={() => routerPush(`/admin/scope-rules/${row.id}`)}
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

ScopeRulesTable = withStyles(styles)(ScopeRulesTable);
ScopeRulesTable = withTranslation(["me", "common"])(ScopeRulesTable);

const ScopeRulesListContent = ({ token }) => (
  <RulesListContent
    token={token}
    ruleType="scope"
    title="Reglas por Ámbito"
    tableComponent={<ScopeRulesTable />} />
);

export default ScopeRulesListContent;