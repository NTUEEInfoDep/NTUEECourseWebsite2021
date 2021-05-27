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
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import DoneIcon from "@material-ui/icons/DoneAllTwoTone";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Papa from "papaparse";
import { Hidden, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    maxWidth: "1000px",
    padding: "35px",
    "& > *": {
      margin: "auto",
    },
  },
  input: {
    display: "none",
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  // grid: {
  //   padding: "10px",
  // },
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
    console.log(newStudent);
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
      setFile(efile);
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
    <Container className={classes.root}>
      <Grid
        container
        spacing={1}
        justify="center"
        alignItems="center"
        direction="row"
      >
        <Hidden smDown>
          <Grid item md={3}>
            <Grid
              container
              spacing={2}
              justify="center"
              alignItems="flex-start"
              direction="column"
            >
              <Grid item>
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
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleUpdate()}
                  startIcon={<CloudUploadIcon />}
                >
                  Update
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  component="span"
                  onClick={() => handleTest()}
                >
                  Test
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Hidden>
        <Hidden mdUp>
          <Grid item sm={12}>
            <Grid
              container
              spacing={2}
              justify="center"
              alignItems="flex-start"
              direction="column"
            >
              <Grid item>
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
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleUpdate()}
                  startIcon={<CloudUploadIcon />}
                >
                  Update
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Hidden>
        <Grid item sm={12} md={9}>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="student data">
              <TableHead>
                <TableRow key="title">
                  <TableCell>index</TableCell>
                  {loaded &&
                    data[0].map((col) => (
                      <TableCell key={col} align="right">
                        {col}
                      </TableCell>
                    ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {loaded ? (
                  data.slice(1).map((row, index) => (
                    <TableRow key={row[0]}>
                      <TableCell align="left">{index + 1}</TableCell>
                      {row.map((col) => (
                        <TableCell key={col} align="right">
                          {col}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow key={0}>
                    <TableCell align="center">No Student Data</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Hidden smDown>
          <Grid item md={3} />
        </Hidden>
        <Grid item sm={12} md={9}>
          <Typography variant="h6">Add Single Student</Typography>
          <Grid
            container
            spacing={1}
            justify="flex-start"
            alignItems="flex-start"
            direction="row"
          >
            <Grid item>
              <Input
                value={newStudent[0]}
                name="add-id"
                placeholder="userID"
                onChange={(e) => {
                  const items = newStudent;
                  items[0] = e.target.value;
                  setNewStudent(items);
                }}
              />
            </Grid>
            <Grid item>
              <Input
                value={newStudent[1]}
                name="add-name"
                placeholder="name"
                onChange={(e) => {
                  const items = newStudent;
                  items[1] = e.target.value;
                  setNewStudent(items);
                }}
              />
            </Grid>
            <Grid item>
              <Input
                value={newStudent[2]}
                name="add-grade"
                placeholder="grade"
                onChange={(e) => {
                  const items = newStudent;
                  items[2] = e.target.value;
                  setNewStudent(items);
                }}
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => onAddStudent()}
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
