import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Input from "@material-ui/core/Input";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import DoneIcon from "@material-ui/icons/DoneAllTwoTone";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Papa from "papaparse";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: "none",
  },
}));

const handleUpdate = () => {
  console.log("to be complete");
};

const CustomTableCell = ({ newStudent, idx, setNewStudent }) => {
  return (
    <>
      <TableCell align="right">
        <Input
          value={newStudent[idx]}
          name={String(idx)}
          onChange={(e) => {
            const items = newStudent;
            items[idx] = e.target.value;
            setNewStudent(items);
          }}
        />
      </TableCell>
    </>
  );
};

/**
 * This is Student Data Page
 */
export default function StudentData() {
  const classes = useStyles();

  const [file, setFile] = React.useState("");
  const [data, setData] = React.useState([["", "", ""]]);
  const [loaded, setLoaded] = React.useState(false);
  const [newStudent, setNewStudent] = React.useState([]);

  const handleTest = () => {
    console.log(data);
  };

  const handleUpload = async (efile) => {
    if (efile) {
      Papa.parse(efile, {
        skipEmptyLines: true,
        complete(results) {
          // console.log("Finished:", results.data);
          setData(results.data);
          setLoaded(true);
        },
      });
    }
  };

  const onAddStudent = () => {
    console.log(data);
    console.log(newStudent);
    console.log(data.concat([newStudent]));
    setData([...data, newStudent]);
    // setData(data.concat([newStudent]));
    setNewStudent([]);
  };

  return (
    <div className={classes.root}>
      <h1>This is Student Data Page</h1>
      {file && <h6>{`file name: ${file.name}`}</h6>}
      <label htmlFor="contained-button-file">
        <input
          accept=".csv"
          className={classes.input}
          id="contained-button-file"
          type="file"
          onChange={(e) => handleUpload(e.target.files[0])}
        />
        <Button variant="contained" color="primary" component="span">
          Select csv file
        </Button>
      </label>
      <Button
        variant="contained"
        color="primary"
        component="span"
        onClick={() => handleUpdate()}
        startIcon={<CloudUploadIcon />}
      >
        Update
      </Button>

      <Button
        variant="contained"
        color="primary"
        component="span"
        onClick={() => handleTest()}
      >
        Test
      </Button>

      {loaded ? (
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="student data">
            <TableHead>
              <TableRow key="title">
                <TableCell>index</TableCell>
                {data[0].map((col) => (
                  <TableCell key={col} align="right">
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(1).map((row, index) => (
                <TableRow key={row[0]}>
                  <TableCell align="left">{index + 1}</TableCell>
                  {row.map((col) => (
                    <TableCell key={col} align="right">
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              <TableRow key="add">
                <TableCell className={classes.selectTableCell}>
                  <IconButton aria-label="done" onClick={() => onAddStudent()}>
                    Add student
                    <DoneIcon />
                  </IconButton>
                </TableCell>
                <CustomTableCell {...{ newStudent, idx: 0, setNewStudent }} />
                <CustomTableCell {...{ newStudent, idx: 1, setNewStudent }} />
                <CustomTableCell {...{ newStudent, idx: 2, setNewStudent }} />
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No students data</Typography>
      )}
    </div>
  );
}
