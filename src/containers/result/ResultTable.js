import React from "react";
import PropTypes from "prop-types";

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

export default function CourseTable({ result }) {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Course ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Ranking</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {result.map(({ _id, courseID, name, ranking }) => (
            <TableRow key={_id}>
              <TableCell>{courseID}</TableCell>
              <TableCell>{name}</TableCell>
              <TableCell>{ranking}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

CourseTable.propTypes = {
  result: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      courseID: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      ranking: PropTypes.number.isRequired,
      userId: PropTypes.string,
      __v: PropTypes.number,
    })
  ).isRequired,
};
