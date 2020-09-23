import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import {
  Breadcrumbs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  Checkbox,
} from "@material-ui/core";
import FolderIcon from "@material-ui/icons/Folder";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Moment from "react-moment";
import { i18n } from "../../i18n";
import TableRowSkeleton from "../TableRowSkeleton";

function humanFileSize(bytes, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + " " + units[u];
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Nombre de Archivo",
  },
  { id: "mtime", numeric: false, disablePadding: false, label: "Modificado" },
  { id: "size", numeric: true, disablePadding: false, label: "Tamaño" },
];

function FileListTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all files" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

FileListTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
  },
  pathBreadcrumb: {
    cursor: "pointer",
  },
  lastPathBreadcrumb: {
    color: theme.palette.text.disabled,
  },
}));

const FileListTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { path, onChangePath, numSelected } = props;

  let pathParts = path.split("/");
  pathParts = pathParts.slice(0, pathParts.length - 1).map((p) => `${p}/`);

  const handlePartClick = (partIndex) => {
    // If clicked part is the last part, ignore click (current directory)
    if (partIndex === pathParts.length - 1) return;
    const path = pathParts.slice(0, partIndex + 1).join("");
    onChangePath(path);
  };

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} seleccionados
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {path ? (
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              aria-label="breadcrumb"
            >
              {pathParts.map((part, i) => {
                const lastPart = i === pathParts.length - 1;
                return (
                  <Typography
                    key={i}
                    color="textPrimary"
                    className={
                      lastPart
                        ? classes.lastPathBreadcrumb
                        : classes.pathBreadcrumb
                    }
                    onClick={() => handlePartClick(i)}
                  >
                    {part}
                  </Typography>
                );
              })}
            </Breadcrumbs>
          ) : (
            <span>Listado de archivos</span>
          )}
        </Typography>
      )}
    </Toolbar>
  );
};

FileListTableToolbar.propTypes = {
  path: PropTypes.string,
  numSelected: PropTypes.number.isRequired,
  onChangePath: PropTypes.func,
};

FileListTableToolbar.defaultProps = {
  path: null,
  onChangePath: () => {},
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  folderIcon: {
    margin: 9,
  },
  row: {
    cursor: "pointer",
  },
}));

function TableRowPreviousDir(props) {
  const classes = useStyles();
  const { path, onChangePath } = props;

  const handleClick = () => {
    const parts = path.split("/");
    const newPath = parts.slice(0, parts.length - 2).join("/") + "/";
    onChangePath(newPath);
  };

  return (
    <TableRow
      hover
      onClick={handleClick}
      role="checkbox"
      tabIndex={-1}
      className={classes.row}
    >
      <TableCell padding="checkbox">
        <FolderIcon className={classes.folderIcon} />
      </TableCell>
      <TableCell component="th" id=".." scope="row" padding="none">
        ..
      </TableCell>
      <TableCell />
      <TableCell align="right" />
    </TableRow>
  );
}

TableRowPreviousDir.propTypes = {
  path: PropTypes.string.isRequired,
  onChangePath: PropTypes.func.isRequired,
};

function FileListTable(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const { loading, disabled, path, rows, onChangePath, onSelectFiles } = props;
  const locale = i18n.language;

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.filter((n) => !n.isdir).map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (_event, row) => {
    const { name, isdir } = row;

    // If row is a directory, call onChangePath because user
    // wants to enter directory...
    if (isdir) {
      onChangePath(`${path}${name}/`);
      return;
    }

    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  React.useEffect(() => {
    setPage(0); // Rows changed, reset page
  }, [rows]);

  React.useEffect(() => {
    onSelectFiles(path, selected);
  }, [selected]);

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <FileListTableToolbar
          path={path}
          disabled={disabled}
          numSelected={selected.length}
          onChangePath={onChangePath}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="file list"
          >
            <FileListTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {loading && <TableRowSkeleton cols={4} />}
              {!loading && path !== "/" && (
                <TableRowPreviousDir path={path} onChangePath={onChangePath} />
              )}
              {!loading &&
                stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.name);
                    const labelId = `file-list-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.name}
                        selected={isItemSelected}
                        className={classes.row}
                      >
                        <TableCell padding="checkbox">
                          {row.isdir ? (
                            <FolderIcon className={classes.folderIcon} />
                          ) : (
                            <Checkbox
                              checked={isItemSelected}
                              inputProps={{ "aria-labelledby": labelId }}
                            />
                          )}
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {row.name}
                        </TableCell>
                        <TableCell>
                          <Moment unix locale={locale} fromNow>
                            {row.mtime}
                          </Moment>
                        </TableCell>
                        <TableCell align="right">
                          {!row.isdir && humanFileSize(row.size)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

FileListTable.propTypes = {
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  path: PropTypes.string,
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      mtime: PropTypes.number,
      size: PropTypes.number,
      isdir: PropTypes.bool,
    })
  ),
  onChangePath: PropTypes.func,
  onSelectFiles: PropTypes.func,
};

FileListTable.defaultProps = {
  loading: false,
  disabled: false,
  path: "/",
  rows: [],
  onChangePath: () => {},
  onSelectFiles: () => {},
};

export default FileListTable;
