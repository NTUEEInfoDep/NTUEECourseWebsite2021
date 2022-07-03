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
  Typography,
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
  table: {
    maxWidth: "1000px",
    margin: "auto",
    maxHeight: "60vh",
  },
  text: {
    textAlign: "center",
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

export default function SampleTable({
  selectionData,
  resultData,
  id2Name,
  preselects,
}) {
  const courseStyle = useStyles();
  const type = getType(selectionData);

  return selectionData.length === 0 ? (
    <Typography variant="h3" className={courseStyle.text}>
      No chosen courses
    </Typography>
  ) : (
    <TableContainer component={Paper} className={courseStyle.table}>
      <Table size="small" stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell>Course Name</TableCell>
            <TableCell align="center">Option Name</TableCell>
            <TableCell align="center">Ranking</TableCell>
            <TableCell align="center">Result</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {selectionData.map(({ _id, courseID, name, ranking }, i) => (
            <TableRow key={_id}>
              <TableCell className={courseStyle[type[i]]}>
                {id2Name[courseID]}
              </TableCell>
              <TableCell className={courseStyle[type[i]]} align="center">
                {name}
              </TableCell>
              <TableCell className={courseStyle[type[i]]} align="center">
                {ranking}
              </TableCell>
              <TableCell className={courseStyle[type[i]]} align="center">
                {resultData[courseID]
                  ? resultData[courseID].indexOf(name) > -1
                    ? "✔"
                    : ""
                  : ""}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
