import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  table_cell: {
    padding: "11px",
  },
}));

export default function StudentTable({ data, loaded }) {
  const classes = useStyles();
  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="student data">
        <TableHead>
          <TableRow key="title">
            <TableCell className={classes.table_cell}>index</TableCell>
            {["userID", "name", "grade"].map((e) => (
              <TableCell key={e} align="right" className={classes.table_cell}>
                {e}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {data.length !== 0 ? (
            data.map((row, index) => (
              <TableRow key={row.userID}>
                <TableCell align="left" className={classes.table_cell}>
                  {index + 1}
                </TableCell>
                {Object.values(row).map((col) => (
                  <TableCell
                    key={col}
                    align="right"
                    className={classes.table_cell}
                  >
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow key={0}>
              <TableCell align="center">No Student Data</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
