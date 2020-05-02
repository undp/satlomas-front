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
  TableHead,
  TableRow,
  TableContainer,
  TableCell,
  Toolbar,
  Tooltip,
} from '@material-ui/core';
import axios from "axios";
import { i18n } from "../../i18n";
import Moment from "react-moment";
import { buildApiUrl } from "../../utils/api";
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import { routerPush } from "../../utils/router";

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  button: {
    marginLeft: theme.spacing(2)
  }
});

let ParameterRulesTable = (props) => {
  const { classes, rows, columns } = props;

  function createRow(elem) {
    const locale = i18n.language;
    let row = [];
    let dates_set = new Set().add("created_at").add("updated_at")
    for (var key in elem) {
      if (dates_set.has(key)) {
        row.push(<TableCell key={key}><Moment locale={locale}>{elem[key]}</Moment></TableCell>)
      }
      else {
        row.push(<TableCell key={key}>{elem[key].toString()}</TableCell>)
      }
    }
    return row;
  }

  return (
    <Paper className={classes.root}>
      <TableContainer>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              {columns.map(column => <TableCell key={column}>{column}</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id}>
                {createRow(row)}
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

class ParameterRulesListContent extends React.Component {
  state = {
    cols: [],
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

      if (response.data.length > 0) {
        const cols = Object.keys(response.data[0]);
        this.setState({ rows: response.data, cols });
      } else {
        this.setState({ rows: [], cols: [] });
      }
    } catch (err) {
      console.error(err);
      this.props.enqueueSnackbar('Failed to get parameter rules', { variant: "error" })
      this.setState({ rows: [], cols: [] });
    }
  }

  render() {
    const { classes } = this.props;
    const { rows, cols } = this.state;

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
            className={classes.button}
            startIcon={<AddIcon />}
          >Nueva regla</Button>
        </Typography>
        <ParameterRulesTable classes={classes} rows={rows} columns={cols} />
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
