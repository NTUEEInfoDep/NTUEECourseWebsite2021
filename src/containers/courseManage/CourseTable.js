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
  IconButton,
} from "@material-ui/core";
import {
  /* ArrowUpward, ArrowDownward, */
  Edit,
  Delete,
} from "@material-ui/icons";

export default function CourseTable({
  courses,
  typeData,
  // eslint-disable-next-line no-unused-vars
  reorderCourse,
  editCourse,
  deleteCourse,
}) {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Course ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Options</TableCell>
            <TableCell>Number</TableCell>
            <TableCell>Students</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {courses.map(
            (
              { id, name, type, description, options, number, students },
              _index
            ) => (
              <TableRow key={id}>
                <TableCell>{id}</TableCell>
                <TableCell>{name}</TableCell>
                <TableCell>
                  {typeData.find(({ id: ID }) => ID === type)?.text ?? ""}
                </TableCell>
                <TableCell>{description ? "✔" : ""}</TableCell>
                <TableCell>{options.length}</TableCell>
                <TableCell>{number}</TableCell>
                <TableCell>{students.length > 0 ? "✔" : ""}</TableCell>
                <TableCell>
                  {/* <IconButton
                  disabled={_index === 0}
                  onClick={() => reorderCourse(_index, -1)}
                >
                  <ArrowUpward />
                </IconButton>
                <IconButton
                  disabled={_index === courses.length - 1}
                  onClick={() => reorderCourse(_index, 1)}
                >
                  <ArrowDownward />
                </IconButton> */}
                  <IconButton onClick={() => editCourse(_index)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => deleteCourse(_index)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

CourseTable.propTypes = {
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      description: PropTypes.string,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          limit: PropTypes.number.isRequired,
          priority: PropTypes.number,
        })
      ).isRequired,
    })
  ).isRequired,
  typeData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    })
  ).isRequired,
  reorderCourse: PropTypes.func.isRequired,
  editCourse: PropTypes.func.isRequired,
  deleteCourse: PropTypes.func.isRequired,
};
