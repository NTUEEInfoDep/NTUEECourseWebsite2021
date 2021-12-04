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

const classes = ["white", "gray"];
const useStyles = makeStyles(() => ({
  white: {
    backgroundColor: "#aaaaaa",
    color: "black",
  },
  gray: {
    backgroundColor: "#444444",
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

export default function sampleTable({ selectionData, resultData }) {
  const courseStyle = useStyles();
  const type = getType(selectionData);

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Course ID</TableCell>
            <TableCell>Option Name</TableCell>
            <TableCell>Ranking</TableCell>
            <TableCell>Result</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {selectionData.map(({ _id, courseID, name, ranking }, i) => (
            <TableRow key={_id}>
              <TableCell className={courseStyle[type[i]]}>{courseID}</TableCell>
              <TableCell className={courseStyle[type[i]]}>{name}</TableCell>
              <TableCell className={courseStyle[type[i]]}>{ranking}</TableCell>
              <TableCell className={courseStyle[type[i]]}>
                {name === resultData[courseID] ? "✔" : ""}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
