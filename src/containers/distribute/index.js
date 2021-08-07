import React, { useState, useRef } from "react";
import clsx from "clsx";

// material-ui
import {
  Container,
  CssBaseline,
  Typography,
  Button,
  CircularProgress,
  Fade,
  Snackbar,
  Step,
  Stepper,
  StepContent,
  StepButton,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CallSplitIcon from "@material-ui/icons/CallSplit";
import GetAppIcon from "@material-ui/icons/GetApp";

// api
import { DistributeAPI } from "../../api";

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
}));

export default function Distribute() {
  const classes = useStyles();
  const resultBlobLinkRef = useRef();
  const statisticsBlobLinkRef = useRef();
  const [activeStep, setActiveStep] = useState(0);
  const [blobURL, setBlobURL] = useState("");
  const [preselectUploaded, setPreselectUploaded] = useState(false);
  const [preselectLoaded, setPreselectLoaded] = useState(false);
  const [preselectFilename, setPreselectFilename] = useState("");
  const [preselectData, setPreselectData] = useState([]);
  const [lastDristributeTime, setLastDistributeTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({});

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
    DistributeAPI.postDistribute()
      .then(() => {
        setLoading(true);
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
    if (efile) {
      Papa.parse(efile, {
        skipEmptyLines: true,
        complete(results) {
          let valid = true;
          results.data[0].forEach((student) => {
            if (!/^(b|r|d)\d{8}$/i.test(student)) {
              valid = false;
            }
          });
          if (valid) {
            setPreselectData(results.data[0]);
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
  return (
    <div>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h4">
            <div>Distribute</div>
          </Typography>
          <Stepper
            className={classes.root}
            nonLinear
            activeStep={activeStep}
            orientation="vertical"
          >
            <Step key="upload">
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
                  ( Format example: "B00000001,B00000002,B00000003" )
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
            </Step>
            <Step key="run">
              <StepButton
                icon={
                  <CallSplitIcon
                    className={clsx(classes.stepButton, {
                      [classes.active]: activeStep === 1,
                    })}
                  />
                }
                onClick={() => setActiveStep(1)}
              >
                <Typography component="h3" variant="h5">
                  2. Run Distribution
                </Typography>
              </StepButton>
              <StepContent>
                <Typography>
                  Please make sure all student data and course data are correct.
                  The previous distribution result will be OVERWRITTEN. Are you
                  sure to run Distribution Algorithm?
                </Typography>
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
                      color="secondary"
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
                      [classes.active]: activeStep === 2,
                    })}
                  />
                }
                onClick={() => setActiveStep(2)}
              >
                <Typography component="h3" variant="h5">
                  3. Download Results
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
