import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

import Input from "@material-ui/core/Input";
import Grid from "@material-ui/core/Grid";

import Container from "@material-ui/core/Container";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import Papa from "papaparse";
import { Hidden, Typography } from "@material-ui/core";
import StudentTable from "./StudentTable";

const useStyles = makeStyles(() => ({
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
}));

function InputGrid({ type, newStudent, setNewStudent }) {
  return (
    <Input
      value={newStudent[type]}
      name={type}
      placeholder={type}
      onChange={(e) => {
        setNewStudent({
          ...newStudent,
          [type]: e.target.value,
        });
      }}
    />
  );
}

/**
 * This is Student Data Page
 */
export default function StudentData() {
  const classes = useStyles();

  const [data, setData] = React.useState([]);
  const [loaded, setLoaded] = React.useState(false);
  const [newStudent, setNewStudent] = React.useState({
    userID: "",
    name: "",
    grade: "",
  });

  const handleTest = () => {
    console.log(data);
  };

  const handleUpload = async (efile) => {
    if (efile) {
      Papa.parse(efile, {
        skipEmptyLines: true,
        complete(results) {
          const newData = results.data.reduce((obj, cur) => {
            return obj.concat([
              { userID: cur[0], name: cur[1], grade: cur[2] },
            ]);
          }, []);
          setData(data.concat(newData));
          setLoaded(true);
        },
      });
    }
  };

  const handleUpdate = () => {
    console.log("to be complete");
  };

  const handleDownload = () => {
    console.log("to be complete");
  };

  const onAddStudent = () => {
    setData(data.concat(newStudent));
    setNewStudent({
      userID: "",
      name: "",
      grade: "",
    });
  };

  return (
    <Container className={classes.root}>
      <Grid
        container
        spacing={1}
        justify="center"
        alignItems="flex-start"
        direction="row"
      >
        <Grid item sm={12} md={3}>
          <Grid
            container
            spacing={2}
            justify="flex-start"
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
                onClick={() => handleDownload()}
                startIcon={<CloudDownloadIcon />}
              >
                Download csv
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
        <Grid item sm={12} md={9}>
          <StudentTable data={data} loaded={loaded} />
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
            {["userID", "name", "grade"].map((e) => (
              <Grid item>
                <InputGrid
                  type={e}
                  newStudent={newStudent}
                  setNewStudent={setNewStudent}
                />
              </Grid>
            ))}

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
