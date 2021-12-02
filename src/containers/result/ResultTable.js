import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

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

const classes = ["red", "orange", "lime", "green", "blue", "purple"];
const useStyles = makeStyles(() => ({
  red: {
    backgroundColor: "#f06292",
  },
  orange: {
    backgroundColor: "#ff8a65",
  },
  lime: {
    color: "black",
    backgroundColor: "#eeff41",
  },
  green: {
    color: "black",
    backgroundColor: "#c1ff7a",
  },
  blue: {
    backgroundColor: "#66cfff",
  },
  purple: {
    backgroundColor: "#9670ff",
  },
}));

const getType = (list) => {
  const ret = [];
  let classCount = 0;
  for (let i = 0; i < list.length; i += 1) {
    if (i > 0 && list[i].courseID !== list[i - 1].courseID) classCount += 1;
    ret.push(classes[classCount % classes.length]);
  }
  return ret;
};

export default function ResultTable({ result }) {
  const courseStyle = useStyles();
  const type = getType(result);
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
          {result.map(({ _id, courseID, name, ranking }, i) => (
            <TableRow key={_id}>
              <TableCell className={courseStyle[type[i]]}>{courseID}</TableCell>
              <TableCell className={courseStyle[type[i]]}>{name}</TableCell>
              <TableCell className={courseStyle[type[i]]}>{ranking}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

ResultTable.propTypes = {
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
