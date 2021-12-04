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

export default function userTable({ userData }) {
  const { userID, name, grade } = userData;
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Grade</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>{userID}</TableCell>
            <TableCell>{name}</TableCell>
            <TableCell>{grade}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
