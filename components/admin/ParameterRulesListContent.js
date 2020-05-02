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

let ParameterRulesTable = (props) => {
  const { t, classes, rows } = props;
  const locale = i18n.language;

  return (
    <Paper className={classes.root}>
      <TableContainer>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Estación</TableCell>
              <TableCell>Parámetro</TableCell>
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
                <TableCell>{row.station ? row.station.name : 'Cualquiera'}</TableCell>
                <TableCell>{t(`parameters.${row.parameter}`)}</TableCell>
                <TableCell>{row.valid_min} - {row.valid_max}{row.is_absolute ? ` (absoluto)` : ''}</TableCell>
                <TableCell><Moment locale={locale} fromNow>{row.created_at}</Moment></TableCell>
                <TableCell><Moment locale={locale} fromNow>{row.updated_at}</Moment></TableCell>
                <TableCell align="right">
                  <Tooltip title="Editar">
                    <IconButton
                      onClick={() => routerPush(`/admin/parameter-rules/${row.id}`)}
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

ParameterRulesTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

ParameterRulesTable = withStyles(styles)(ParameterRulesTable);
ParameterRulesTable = withTranslation(["me", "common"])(ParameterRulesTable);

class ParameterRulesListContent extends React.Component {
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
      const response = await axios.get(buildApiUrl("/alerts/parameter-rules"), {
        headers: { Authorization: token }
      })
      this.setState({ rows: response.data });
    } catch (err) {
      console.error(err);
      this.props.enqueueSnackbar('Failed to get parameter rules', { variant: "error" })
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
            onClick={() => routerPush("/admin/parameter-rules/new")}
            className={classes.newButton}
            startIcon={<AddIcon />}
          >Nueva regla</Button>
        </Typography>
        <ParameterRulesTable rows={rows} />
      </div >
    );
  }
}

ParameterRulesListContent.propTypes = {
  classes: PropTypes.object.isRequired,
};

ParameterRulesListContent = withStyles(styles)(ParameterRulesListContent);
ParameterRulesListContent = withSnackbar(ParameterRulesListContent);

export default ParameterRulesListContent;
