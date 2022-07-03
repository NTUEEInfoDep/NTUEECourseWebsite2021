import React from "react";

// material-ui
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  table: {
    maxWidth: "1000px",
    margin: "auto",
    marginBottom: "10px",
  },
}));

export default function UserTable({ userData }) {
  const { userID, name, grade } = userData;
  const userStyle = useStyles();

  return (
    <TableContainer component={Paper} className={userStyle.table}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">ID</TableCell>
            <TableCell align="center">Name</TableCell>
            <TableCell align="center">Grade</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell align="center">{userID}</TableCell>
            <TableCell align="center">{name}</TableCell>
            <TableCell align="center">{grade}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
