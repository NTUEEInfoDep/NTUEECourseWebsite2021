import React from "react";
// import PropTypes from "prop-types";
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

const classes = ["odd", "even"];
const useStyles = makeStyles(() => ({
  odd: {
    backgroundImage: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
  },
  even: {
    backgroundImage: "linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)",
  },
  table: {
    width: "70%",
    minWidth: "500px",
    margin: "auto",
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

export default function ResultTable({ result, id2Name }) {
  const courseStyle = useStyles();
  const type = getType(result);
  return (
    <TableContainer component={Paper} className={courseStyle.table}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Course Name</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Ranking</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {result.map(({ _id, courseID, name, ranking }, i) => (
            <TableRow key={_id} className={courseStyle[type[i]]}>
              <TableCell>{id2Name[courseID]}</TableCell>
              <TableCell>{name}</TableCell>
              <TableCell>{ranking}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// ResultTable.propTypes = {
//   result: PropTypes.arrayOf(
//     PropTypes.shape({
//       _id: PropTypes.string.isRequired,
//       courseID: PropTypes.string.isRequired,
//       name: PropTypes.string.isRequired,
//       ranking: PropTypes.number.isRequired,
//       userId: PropTypes.string,
//       __v: PropTypes.number,
//     })
//   ).isRequired,
// };
