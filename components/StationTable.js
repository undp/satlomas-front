import React from 'react';
import axios from "axios";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Paper, TableCell, TableSortLabel } from '@material-ui/core';
import { buildApiUrl } from "../utils/api";
import { AutoSizer, Column, SortDirection, Table } from 'react-virtualized';
import _ from 'lodash';
import { withSnackbar } from 'notistack';

const styles = theme => ({
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

class StationTable extends React.Component {
  state = {
    loading: true,
    rows: [],
    columns: [],
  }

  componentDidMount() {
    const { parameters } = this.props;
    let columns = [{ width: 100, flexGrow: 1.0, label: 'Fecha', dataKey: 't', },]
    parameters.forEach(e => columns.push(
      { width: 80, flexGrow: 1.0, label: e.name, dataKey: e.id, }
    ));
    this.setState({ columns });
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps, this.props)) {
      this.fetchData();
    }
  }

  getSecondsFromTimeAndUnit(time, unit) {
    switch (unit) {
      case "hour":
        return time * 1000 * 60 * 60;
      case "day":
        return time * 1000 * 60 * 60 * 24;
      case "week":
        return time * 1000 * 60 * 60 * 24 * 7;
      case "month":
        return time * 1000 * 60 * 60 * 24 * 30;
      case "year":
        return time * 1000 * 60 * 60 * 24 * 365;
      default:
        throw `Invalid time unit: ${unit}`;
    }
  }

  calculateTimeRange(mode, params) {
    switch (mode) {
      case "realtime": {
        const { now, lastTime } = params;
        const [time, unit] = lastTime.split("-");
        const seconds = this.getSecondsFromTimeAndUnit(time, unit);
        return [new Date(now - seconds), now];
      }
      case "historic": {
        const { start, end } = params;
        return [start, end];
      }
      default:
        throw "invalid time range mode";
    }
  }

  async fetchData() {
    const {
      stationId,
      parameters,
      mode,
      timeRangeParams,
      groupingInterval,
      aggregationFunc,
    } = this.props;

    const [start, end] = this.calculateTimeRange(mode, timeRangeParams);
    let parameter = "";
    parameters.forEach(e => parameter = parameter.concat(e.id).concat(","));
    parameter = parameter.substring(0, parameter.length - 1);
    const params = {
      station: stationId,
      parameter: parameter,
      start,
      end,
      grouping_interval: groupingInterval,
      aggregation_func: aggregationFunc,
    };
    console.log(params);
    try {
      const response = await axios.get(buildApiUrl("/measurements/summary"), {
        params,
      });
      console.log(response);
      const formattedRows = this.formatRows(response.data);
      this.setState({ rows: formattedRows, loading: false });
    } catch (err) {
      console.error(err);
      this.props.enqueueSnackbar(`Failed to get table data`, {
        variant: "error",
      });
    }
  }

  formatRows = (rows) => {
    return rows.map(row => {
      let formattedRow = {}
      Object.entries(row).map(([k, v]) => {
        console.log([k, v])
        formattedRow[k] = +(+v).toFixed(2)
      })
      return { ...formattedRow, t: row.t }
    })
  }

  render() {
    const { rows, columns, loading } = this.state;

    return (
      <>
        <Paper style={{ height: '80vh', width: '100%' }}>
          {!loading && (
            <WrappedVirtualizedTable
              rowCount={rows.length}
              rowGetter={({ index }) => rows[index]}
              onRowClick={event => console.log(event)}
              columns={columns}
            />
          )}
        </Paper>
      </>
    );
  }
}

StationTable = withSnackbar(StationTable);

export default StationTable