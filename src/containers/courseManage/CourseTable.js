import React from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
  ButtonGroup,
} from "@material-ui/core";

export default function CourseTable({ courses, typeData, reorderCourse }) {
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
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {courses.map(({ id, name, type, description, options }, _index) => (
            <TableRow key={id}>
              <TableCell padding="checkbox">{id}</TableCell>
              <TableCell>{name}</TableCell>
              <TableCell>
                {typeData.find(({ id }) => id === type)?.text ?? ""}
              </TableCell>
              <TableCell>{description.length ? "✔" : ""}</TableCell>
              <TableCell>{options.length}</TableCell>
              <TableCell spacing={1}>
                <ButtonGroup variant="outlined">
                  <Button
                    disabled={_index === 0}
                    onClick={() => reorderCourse(_index, -1)}
                  >
                    U
                  </Button>
                  <Button
                    disabled={_index === courses.length - 1}
                    onClick={() => reorderCourse(_index, 1)}
                  >
                    D
                  </Button>
                </ButtonGroup>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
