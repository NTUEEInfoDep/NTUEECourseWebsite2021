import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";

// material-ui
import {
  Container,
  CssBaseline,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fade,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Step,
  Stepper,
  StepContent,
  StepButton,
  TextField,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CallSplitIcon from "@material-ui/icons/CallSplit";
import GetAppIcon from "@material-ui/icons/GetApp";
import { Add } from "@material-ui/icons";
import example from "./preselectExample.png";

// api
import { DistributeAPI, CourseAPI, StudentDataAPI } from "../../api";

// upload csv
import Papa from "papaparse";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    padding: theme.spacing(4),
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  paper: {
    marginTop: theme.spacing(8),
    padding: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, .7)",
    borderRadius: "3%",
  },
  stepButton: {
    padding: "10px",
    marginLeft: "-10px",
    borderRadius: "50%",
    border: "1px solid",
  },
  button: {
    marginRight: theme.spacing(1),
  },
  resetButton: {
    marginRight: theme.spacing(1),
    backgroundColor: "rgba(255, 0, 0, .7)",
    color: "white"
  },
  input: {
    display: "none",
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
    flex: "0 0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  active: {
    borderRadius: "50%",
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  },
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "min(100%,400px)",
    maxHeight: "100%",
  },
}));
const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "Name",
    headerName: "Name",
    width: 150,
  },
];
export default function Distribute() {
  const classes = useStyles();
  const resultBlobLinkRef = useRef();
  const statisticsBlobLinkRef = useRef();
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [blobURL, setBlobURL] = useState("");
  const [preselectUploaded, setPreselectUploaded] = useState(false);
  const [preselectLoaded, setPreselectLoaded] = useState(false);
  const [preselectFilename, setPreselectFilename] = useState("");
  const [preselectData, setPreselectData] = useState([]);
  const [specifyData, setSpecifyData] = useState([]);
  const [addSpecifyOpened, setAddSpecifyOpened] = useState(false);
  const [addSpecifyCourse, setAddSpecifyCourse] = useState("");
  const [studentInput, setStudentInput] = useState("");
  const [lastDristributeTime, setLastDistributeTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({});
  const [resetSelectionOpened, setResetSelectionOpened] = useState(false);
  const [resetSelectionInput, setResetSelectionInput] = useState("");

  const handleGetDistribution = () => {
    DistributeAPI.getResult()
      .then(({ data }) => {
        setBlobURL(
          window.URL.createObjectURL(
            new Blob([data], { type: "application/csv" })
          )
        );
        resultBlobLinkRef.current.click();
      })
      .catch(() =>
        setAlert({
          open: true,
          severity: "error",
          msg: "Cannot download distribution result.",
        })
      );
  };

  const handleGetStatistics = () => {
    DistributeAPI.getStatistics()
      .then(({ data }) => {
        setBlobURL(
          window.URL.createObjectURL(
            new Blob([data], { type: "application/csv" })
          )
        );
        statisticsBlobLinkRef.current.click();
      })
      .catch(() =>
        setAlert({
          open: true,
          severity: "error",
          msg: "Cannot download distribution statistics.",
        })
      );
  };

  const handleRunDistribution = () => {
    setLoading(true);
    DistributeAPI.postDistribute()
      .then(() => {
        setAlert({
          open: true,
          severity: "success",
          msg: "Course distribution operation succeeded. Distribution result is available.",
        });
        setLastDistributeTime(Date().toLocaleString());
        handleNext();
      })
      .catch(() =>
        setAlert({
          open: true,
          severity: "error",
          msg: "Course distribution operation failed.",
        })
      )
      .finally(() => setLoading(false));
  };
  const handleUploadCsv = async (efile) => {
    const data = students.map((s) => s.id);
    let nonExist = [];
    if (efile) {
      Papa.parse(efile, {
        skipEmptyLines: true,
        complete(results) {
          let valid = true;
          let exist = true;
          console.log(results.data);
          results.data.forEach((student) => {
            if (!/^(b|r|d)\d{8}$/i.test(student[0])) {
              valid = false;
            }
            if (!data.includes(student[0].toUpperCase())) {
              exist = false;
              nonExist.push(student);
            }
          });
          if (valid && exist) {
            const newData = results.data.reduce((obj, cur) => {
              return obj.concat([cur[0].toUpperCase()]);
            }, []);
            setPreselectData(newData);
            setPreselectLoaded(true);
            setPreselectFilename(efile.name);
            return;
          }
          if (!valid) {
            setAlert({
              open: true,
              severity: "error",
              msg: "Invalid student data format.",
            });
          }
          if (!exist) {
            setAlert({
              open: true,
              severity: "error",
              msg: `No student data: ${nonExist.join(", ")}`,
            });
          }
        },
      });
    }
  };
  const handlePreselectUpload = async () => {
    if (preselectLoaded) {
      try {
        await DistributeAPI.putPreselect(preselectData);
        setPreselectUploaded(true);
        setPreselectLoaded(false);
        setAlert({
          open: true,
          severity: "success",
          msg: "Upload preselect student data complete.",
        });
      } catch (err) {
        setAlert({
          open: true,
          severity: "error",
          msg: "Failed to upload preselect student data.",
        });
      }
    }
  };
  const handleResetPreselectUpload = () => {
    setPreselectLoaded(false);
    setPreselectUploaded(false);
    setPreselectData([]);
    setPreselectFilename("");
  };
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleOpenAddSpecify = () => {
    setAddSpecifyOpened(true);
  };
  const handleCloseAddSpecify = () => {
    setAddSpecifyOpened(false);
    setAddSpecifyCourse("");
    setStudentInput("");
  };
  const handleAddSpecifyStudents = () => {
    const data = students.map((s) => s.id);
    const valueArray = studentInput.replace(/\s/g, "").toUpperCase().split(",");
    let nonExist = [];
    let valid = true;
    let exist = true;
    setStudentInput("");
    valueArray.forEach((student) => {
      if (!/^(b|r|d)\d{8}$/i.test(student)) {
        valid = false;
      }
      if (!data.includes(student)) {
        nonExist.push(student);
        exist = false;
      }
    });
    if (valid && exist) {
      handleAddSpecify(valueArray);
      return;
    }
    if (!valid) {
      setAlert({
        open: true,
        severity: "error",
        msg: "Invalid student data format.",
      });
    }
    if (!exist) {
      setAlert({
        open: true,
        severity: "error",
        msg: `No student data: ${nonExist.join(", ")}`,
      });
    }
  };
  const handleAddSpecify = (student) => {
    // console.log({ course_id: addSpecifyCourse, students: addSpecifyStudents });
    setSpecifyData([
      ...specifyData,
      {
        course_id: addSpecifyCourse,
        students: student,
      },
    ]);
    handleCloseAddSpecify();
  };
  const handleDeleteSpecify = (index) => {
    setSpecifyData([
      ...specifyData.slice(0, index),
      ...specifyData.slice(index + 1),
    ]);
  };
  const handleCoursesReload = async () => {
    try {
      setCourses((await CourseAPI.getCourses()).data);
    } catch (err) {
      setAlert({
        open: true,
        severity: "error",
        msg: "Failed to load courses.",
      });
    }
  };
  const handleStudentDataReload = async () => {
    try {
      setStudents((await StudentDataAPI.getStudentData()).data);
    } catch (err) {
      setAlert({
        open: true,
        severity: "error",
        msg: "Failed to load student data.",
      });
    }
  };
  const handleResetSelectionClose = () => {
    setResetSelectionOpened(false);
    setResetSelectionInput("");
  };
  const handleReset = () => {
    setLoading(true);
    DistributeAPI.resetSelection()
      .then(() => {
        setAlert({
          open: true,
          severity: "success",
          msg: "User selection data reset!",
        });
        setResetSelectionInput("");
        setResetSelectionOpened(false);
      })
      .catch(() =>
        setAlert({
          open: true,
          severity: "error",
          msg: "Fail to reset user selection data!",
        })
      )
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    handleCoursesReload();
    handleStudentDataReload();
  }, []);
  return (
    <div>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <div className={classes.paper}>
          <Grid container justifyContent="center">
            <Grid item xs={0} sm={3}></Grid>
            <Grid item xs={12} sm={6}>
              <Typography component="h1" variant="h4" align="center">
                <div>Distribute</div>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3} align="center">
              <Button
                variant="contained"
                className={classes.resetButton}
                onClick={()=>setResetSelectionOpened(true)}
              >
                Reset Selection
              </Button>
            </Grid>
          </Grid>
          <Stepper
            className={classes.root}
            nonLinear
            activeStep={activeStep}
            orientation="vertical"
          >
            {/* <Step key="upload">
              <StepButton
                icon={
                  <CloudUploadIcon
                    className={clsx(classes.stepButton, {
                      [classes.active]: activeStep === 0,
                    })}
                  />
                }
                onClick={() => setActiveStep(0)}
              >
                <Typography component="h3" variant="h5">
                  1. Upload Preselect
                </Typography>
              </StepButton>
              <StepContent>
                <Typography>
                  Please upload a cvs file with all the STUDENT IDs that are
                  preselected for "DC Lab".
                </Typography>
                <Typography>
                  Format example:
                  <img className={classes.img} src={example} />
                </Typography>
                <br />
                <Typography>
                  {preselectUploaded && preselectData.length
                    ? "Current preselect data:"
                    : ""}
                </Typography>
                {preselectUploaded
                  ? preselectData.map((id) => (
                    <Typography key={id}>{id}</Typography>
                  ))
                  : ""}
                <br />
                {preselectUploaded ? (
                  ""
                ) : (
                  <label htmlFor="contained-button-file">
                    <input
                      accept=".csv"
                      className={classes.input}
                      id="contained-button-file"
                      type="file"
                      onChange={(e) => handleUploadCsv(e.target.files[0])}
                    />
                    <Button variant="outlined" color="primary" component="span">
                      Select csv file
                    </Button>
                  </label>
                )}
                {preselectLoaded && !preselectUploaded
                  ? " " + preselectFilename
                  : ""}
                <div className={classes.actionsContainer}>
                  {preselectUploaded ? (
                    <>
                      <Button
                        className={classes.button}
                        onClick={handleResetPreselectUpload}
                      >
                        Select Another File
                      </Button>
                      <Button
                        onClick={handleNext}
                        variant="contained"
                        color="primary"
                      >
                        Done
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={handleNext} className={classes.button}>
                        Skip
                      </Button>
                      {preselectLoaded ? (
                        <Button
                          onClick={handlePreselectUpload}
                          variant="contained"
                          color="primary"
                        >
                          Upload
                        </Button>
                      ) : (
                        <> </>
                      )}
                    </>
                  )}
                </div>
              </StepContent>
            </Step> */}
            <Step key="run">
              <StepButton
                icon={
                  <CallSplitIcon
                    className={clsx(classes.stepButton, {
                      [classes.active]: activeStep === 0,
                    })}
                  />
                }
                onClick={() => setActiveStep(0)}
              >
                <Typography component="h3" variant="h5">
                  1. Run Distribution
                </Typography>
              </StepButton>
              <StepContent>
                <Typography>
                  The previous distribution result will be OVERWRITTEN. Please
                  make sure all student data and course data are correct.
                </Typography>
                {/* <Typography style={{ color: "#d32f2f" }}>
                  If specifying certain students for certain course is needed,
                  press "ADD" to fill in more details.
                </Typography>
                <br />
                <div>
                  <Typography style={{ fontSize: "20px", marginBottom: "5px" }}>
                    Specified Data
                  </Typography>
                  {specifyData.map((item, index) => (
                    <Chip
                      key={item.course_id}
                      label={`${item.course_id}(${item.students.length})`}
                      variant="outlined"
                      onDelete={() => handleDeleteSpecify(index)}
                      style={{ margin: "5px" }}
                    />
                  ))}
                  <Button
                    startIcon={<Add />}
                    variant="outlined"
                    size="small"
                    onClick={handleOpenAddSpecify}
                  >
                    Add
                  </Button>
                </div> */}
                {loading ? (
                  <div className={classes.actionsContainer}>
                    <Fade
                      in={loading}
                      style={{
                        transitionDelay: 0,
                      }}
                      unmountOnExit
                    >
                      <CircularProgress />
                    </Fade>
                  </div>
                ) : (
                  <div className={classes.actionsContainer}>
                    <Button className={classes.button} onClick={handleBack}>
                      Back
                    </Button>
                    <Button
                      onClick={handleRunDistribution}
                      variant="contained"
                      color="primary"
                    >
                      Run
                    </Button>
                  </div>
                )}
              </StepContent>
            </Step>
            <Step key="download">
              <StepButton
                icon={
                  <GetAppIcon
                    className={clsx(classes.stepButton, {
                      [classes.active]: activeStep === 1,
                    })}
                  />
                }
                onClick={() => setActiveStep(1)}
              >
                <Typography component="h3" variant="h5">
                  2. Download Results
                </Typography>
              </StepButton>
              <StepContent>
                {lastDristributeTime ? (
                  <Typography>
                    Last distribution: {lastDristributeTime}
                  </Typography>
                ) : (
                  ""
                )}
                <br />
                <div className={classes.actionsContainer}>
                  <Button
                    variant="outlined"
                    color="primary"
                    className={classes.button}
                    onClick={handleGetDistribution}
                  >
                    Download distribution result
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    className={classes.button}
                    onClick={handleGetStatistics}
                  >
                    Download distribution statistics
                  </Button>
                </div>
              </StepContent>
            </Step>
          </Stepper>
        </div>
      </Container>
      <Dialog
        maxWidth="sm"
        fullWidth
        disableBackdropClick
        open={addSpecifyOpened}
        onClose={() => setAddSpecifyOpened(false)}
      >
        <DialogTitle>Add Specification</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>Course ID</InputLabel>
            <Select
              fullWidth
              value={addSpecifyCourse}
              onChange={(e) => setAddSpecifyCourse(e.target.value)}
            >
              {courses.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography>Student</Typography>
          <TextField
            id="id"
            label="Add Student ID (ex: b00000000,b11111111)"
            type="text"
            fullWidth
            value={studentInput}
            onChange={(e) => setStudentInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button className={classes.button} onClick={handleCloseAddSpecify}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddSpecifyStudents}
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={resetSelectionOpened} onClose={handleResetSelectionClose} >
        <DialogTitle id="form-dialog-title">{"[WARNING] Reset Selection"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This operation will delete some sensitive data, including users' selection and distributed results. 
            To execute the operation, please type <b>Reset Selection</b> below.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="resetSelectionInput"
            label="Reset Selection"
            type="text"
            fullWidth
            value={resetSelectionInput}
            onChange={(e) => setResetSelectionInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResetSelectionClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleReset} disabled={resetSelectionInput !== "Reset Selection"} color="primary">
            Reset
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={alert?.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert variant="filled" severity={alert?.severity}>
          {alert?.msg}
        </Alert>
      </Snackbar>
      <a
        ref={resultBlobLinkRef}
        href={blobURL}
        download="result.csv"
        style={{ display: "none" }}
      >
        {" "}
      </a>
      <a
        ref={statisticsBlobLinkRef}
        href={blobURL}
        download="statistics.csv"
        style={{ display: "none" }}
      >
        {" "}
      </a>
    </div>
  );
}
