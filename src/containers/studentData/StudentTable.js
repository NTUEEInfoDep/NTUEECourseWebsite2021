import React from "react";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TablePagination from "@material-ui/core/TablePagination";
import Typography from "@material-ui/core/Typography";
import TableHead from "@material-ui/core/TableHead";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TableRow from "@material-ui/core/TableRow";
import Toolbar from "@material-ui/core/Toolbar";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import Input from "@material-ui/core/Input";
import PropTypes from "prop-types";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

import { CopyToClipboard } from "react-copy-to-clipboard";

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
  { id: "id", numeric: false, disablePadding: true, label: "id" },
  { id: "name", numeric: false, disablePadding: true, label: "name" },
  { id: "grade", numeric: false, disablePadding: true, label: "grade" },
  {
    id: "authority",
    numeric: false,
    disablePadding: true,
    label: "authority",
  },
  { id: "password", numeric: false, disablePadding: true, label: "password" },
];

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelectedInPage,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead className={classes.head}>
      <TableRow>
        <TableCell padding="none" className={classes.headCell}>
          <Checkbox
            indeterminate={
              numSelectedInPage > 0 && numSelectedInPage < rowCount
            }
            checked={rowCount > 0 && numSelectedInPage === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all desserts" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            className={(classes.headCell, classes.grade)}
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              className={classes.sortlabel}
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
        <TableCell className={classes.headCell} />
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.oneOfType([PropTypes.object]).isRequired,
  numSelectedInPage: PropTypes.number.isRequired,
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
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const {
    rootClasses,
    numSelected,
    search,
    setSearch,
    handleDelete,
    setPage,
    authority,
  } = props;

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  return (
    <Toolbar
      className={
        (clsx(classes.root, {
          [classes.highlight]: numSelected > 0,
        }),
        rootClasses.toolbar)
      }
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Students
        </Typography>
      )}
      <Input
        value={search}
        name="search bar"
        placeholder="id or name"
        onChange={(e) => {
          handleSearch(e);
        }}
      />
      {numSelected > 0 ? (
        <Tooltip title="Delete" placement="bottom">
          <span>
            <IconButton
              aria-label="delete"
              onClick={() => handleDelete()}
              disabled={authority !== 2}
            >
              <DeleteIcon />
            </IconButton>
          </span>
        </Tooltip>
      ) : (
        <></>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  rootClasses: PropTypes.oneOfType([PropTypes.object]).isRequired,
  numSelected: PropTypes.number.isRequired,
  search: PropTypes.string.isRequired,
  setSearch: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  container: {
    maxHeight: 440,
  },
  toolbar: {
    minHeight: "50px",
  },
  table: {
    minWidth: 500,
    padding: 0,
  },
  sortlabel: {
    margin: 0,
  },
  headCell: {},
  grade: {},
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
  tablecell: {
    padding: 0,
  },
  checkbox: {
    padding: "5px",
  },
  icon: {
    padding: 0,
  },
  copy: {
    borderRadius: "10px",
    backgroundColor: "#424242",
    color: "#ffffff",
    boxShadow: "0px 0px 0px 0px rgba(0,0,0,0.3)",
  },
}));

export default function StudentTable({
  data,
  handleEdit,
  handleDelete,
  selected,
  setSelected,
  showAlert,
  authority,
}) {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);
  const [search, setSearch] = React.useState("");

  //
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const studentFilter = (e) => {
    return search
      ? e.name.toUpperCase().startsWith(search.toUpperCase()) ||
          e.id.toUpperCase().startsWith(search.toUpperCase())
      : true;
  };

  //
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const nowSelecteds = data
        .filter((e) => studentFilter(e))
        .map((n) => n.id);
      const newSelecteds = nowSelecteds.filter((id) => !selected.includes(id));
      if (newSelecteds.length === 0) {
        setSelected(selected.filter((id) => !nowSelecteds.includes(id)));
      } else {
        setSelected(selected.concat(newSelecteds));
      }
      return;
    }
    setSelected([]);
  };

  //
  const handleClick = (event, name) => {
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

  // change page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // change rows per page
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // select
  const isSelected = (name) => selected.indexOf(name) !== -1;

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          rootClasses={classes}
          numSelected={selected.length}
          search={search}
          setSearch={setSearch}
          setPage={setPage}
          handleDelete={() => {
            handleDelete(selected);
          }}
          authority={authority}
        />
        <TableContainer className={classes.container}>
          <Table
            stickyHeader
            className={classes.table}
            aria-labelledby="tableTitle"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelectedInPage={
                data
                  .filter((e) => studentFilter(e))
                  .map((n) => n.id)
                  .filter((id) => selected.includes(id)).length
              }
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data.filter((e) => studentFilter(e)).length}
            />
            <TableBody>
              {stableSort(data, getComparator(order, orderBy))
                .filter((e) => studentFilter(e))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      {/* <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? "right" : "left"}
                        padding={headCell.disablePadding ? "none" : "default"}
                        sortDirection={orderBy === headCell.id ? order : false}
                      /> */}
                      <TableCell className={classes.tablecell}>
                        <Checkbox
                          onClick={(event) => handleClick(event, row.id)}
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": labelId }}
                          className={classes.checkbox}
                        />
                      </TableCell>
                      <TableCell
                        key={headCells[0].id}
                        align={headCells[0].numeric ? "right" : "left"}
                        padding={
                          headCells[0].disablePadding ? "none" : "default"
                        }
                        component="th"
                        id={row.id}
                        scope="row"
                        className={classes.tablecell}
                      >
                        {row.id}
                      </TableCell>
                      <TableCell
                        key={headCells[1].id}
                        align={headCells[1].numeric ? "right" : "left"}
                        padding={
                          headCells[1].disablePadding ? "none" : "default"
                        }
                        className={classes.tablecell}
                      >
                        {row.name}
                      </TableCell>
                      <TableCell
                        key={headCells[2].id}
                        align={headCells[2].numeric ? "right" : "left"}
                        padding={
                          headCells[2].disablePadding ? "none" : "default"
                        }
                        className={classes.tablecell}
                      >
                        {row.grade}
                      </TableCell>
                      <TableCell
                        key={headCells[3].id}
                        align={headCells[3].numeric ? "right" : "left"}
                        padding={
                          headCells[3].disablePadding ? "none" : "default"
                        }
                        className={classes.tablecell}
                      >
                        {row.authority}
                      </TableCell>
                      <TableCell
                        key={headCells[4].id}
                        align={headCells[4].numeric ? "right" : "left"}
                        padding={
                          headCells[4].disablePadding ? "none" : "default"
                        }
                        className={classes.tablecell}
                      >
                        {row.password ? (
                          <CopyToClipboard text={row.password}>
                            <button
                              type="button"
                              className={classes.copy}
                              onClick={() => {
                                showAlert("info", "Copy password.");
                              }}
                            >
                              {row.password}
                            </button>
                          </CopyToClipboard>
                        ) : (
                          <></>
                        )}
                      </TableCell>
                      <TableCell className={classes.tablecell}>
                        <IconButton
                          onClick={() => handleEdit(row.id)}
                          className={classes.icon}
                          disabled={selected.length !== 0 || authority !== 2}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete([row.id])}
                          className={classes.icon}
                          disabled={selected.length !== 0 || authority !== 2}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[50, 100, 200, 400]}
          component="div"
          count={data.filter((e) => studentFilter(e)).length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

StudentTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      grade: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      authority: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      password: PropTypes.string,
    })
  ).isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  selected: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  setSelected: PropTypes.func.isRequired,
};
