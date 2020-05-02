import React from 'react';
import axios from "axios";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Paper, TableCell, TableSortLabel } from '@material-ui/core';
import { buildApiUrl } from "../../utils/api";
import { AutoSizer, Column, SortDirection, Table } from 'react-virtualized';
import _ from 'lodash';
import { withSnackbar } from 'notistack';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  table: {
    fontFamily: theme.typography.fontFamily,
  },
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  tableRow: {
    cursor: 'pointer',
  },
  tableRowHover: {
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
  },
  tableCell: {
    flex: 1,
  },
  noClick: {
    cursor: 'initial',
  },
});

class MuiVirtualizedTable extends React.PureComponent {
  getRowClassName = ({ index }) => {
    const { classes, rowClassName, onRowClick } = this.props;

    return classNames(classes.tableRow, classes.flexContainer, rowClassName, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null,
    });
  };

  cellRenderer = ({ cellData, columnIndex = null }) => {
    const { columns, classes, rowHeight, onRowClick } = this.props;
    return (
      <TableCell
        component="div"
        className={classNames(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick == null,
        })}
        variant="body"
        style={{ height: rowHeight }}
        align={(columnIndex != null && columns[columnIndex].numeric) || false ? 'right' : 'left'}
      >
        {cellData}
      </TableCell>
    );
  };

  headerRenderer = ({ label, columnIndex, dataKey, sortBy, sortDirection }) => {
    const { headerHeight, columns, classes, sort } = this.props;
    const direction = {
      [SortDirection.ASC]: 'asc',
      [SortDirection.DESC]: 'desc',
    };

    const inner =
      !columns[columnIndex].disableSort && sort != null ? (
        <TableSortLabel active={dataKey === sortBy} direction={direction[sortDirection]}>
          {label}
        </TableSortLabel>
      ) : (
          label
        );

    return (
      <TableCell
        component="div"
        className={classNames(classes.tableCell, classes.flexContainer, classes.noClick)}
        variant="head"
        style={{ height: headerHeight }}
        align={columns[columnIndex].numeric || false ? 'right' : 'left'}
      >
        {inner}
      </TableCell>
    );
  };

  render() {
    const { classes, columns, ...tableProps } = this.props;
    return (
      <AutoSizer>
        {({ height, width }) => (
          <Table
            className={classes.table}
            height={height}
            width={width}
            {...tableProps}
            rowClassName={this.getRowClassName}
          >
            {columns.map(({ cellContentRenderer = null, className, dataKey, ...other }, index) => {
              let renderer;
              if (cellContentRenderer != null) {
                renderer = cellRendererProps =>
                  this.cellRenderer({
                    cellData: cellContentRenderer(cellRendererProps),
                    columnIndex: index,
                  });
              } else {
                renderer = this.cellRenderer;
              }

              return (
                <Column
                  key={dataKey}
                  headerRenderer={headerProps =>
                    this.headerRenderer({
                      ...headerProps,
                      columnIndex: index,
                    })
                  }
                  className={classNames(classes.flexContainer, className)}
                  cellRenderer={renderer}
                  dataKey={dataKey}
                  {...other}
                />
              );
            })}
          </Table>
        )}
      </AutoSizer>
    );
  }
}

MuiVirtualizedTable.propTypes = {
  classes: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      cellContentRenderer: PropTypes.func,
      dataKey: PropTypes.string.isRequired,
      width: PropTypes.number.isRequired,
    }),
  ).isRequired,
  headerHeight: PropTypes.number,
  onRowClick: PropTypes.func,
  rowClassName: PropTypes.string,
  rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
  sort: PropTypes.func,
};

MuiVirtualizedTable.defaultProps = {
  headerHeight: 56,
  rowHeight: 56,
};

const WrappedVirtualizedTable = withStyles(styles)(MuiVirtualizedTable);


class AlertsTable extends React.Component {
  state = {
    loading: true,
    rows: [],
    columns: [
      { width: 120, flexGrow: 1.0, label: "Fecha y hora", dataKey: "created_at" },
      { width: 120, flexGrow: 1.0, label: "Tipo de regla", dataKey: "rule_content_type" },
      { width: 120, flexGrow: 1.0, label: "Regla", dataKey: "rule_id" },
      { width: 120, flexGrow: 1.0, label: "Tipo de medida", dataKey: "measurement_content_type" },
    ],
  }

  async componentDidMount() {
    await this.fetchData();
  }

  prepareRows(data) {
    let rows = [];
    for (let i = 0; i < data.length; i++) {
      rows.push(data[i])
    }
    return rows
  }

  async fetchData() {
    const { token } = this.props;
    const response = await axios.get(buildApiUrl("/alerts"), { headers: { Authorization: token } });
    console.log(response);
    if (response.data.length > 0) {
      this.setState({ loading: false, rows: this.prepareRows(response.data) });
    }
    else {
      this.setState({ loading: false, rows: [] });
    }
  }

  render() {
    const { classes } = this.props;
    const { loading, rows, columns } = this.state;

    return (
      <div className={classes.root}>
        <Typography
          variant="h6"
          className={classes.title}
          gutterBottom
        >
          Alertas
        </Typography>
        <Paper>
          {!loading && (
            <WrappedVirtualizedTable
              rowCount={rows.length}
              rowGetter={({ index }) => rows[index]}
              columns={columns}
            />
          )}
        </Paper>
      </div>
    );
  }
}

AlertsTable = withSnackbar(AlertsTable);
AlertsTable = withStyles(styles)(AlertsTable);

export default AlertsTable