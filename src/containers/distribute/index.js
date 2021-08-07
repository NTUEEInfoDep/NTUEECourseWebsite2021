import React, { useState, useRef } from "react";

// material-ui
import {
  Container,
  CssBaseline,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Step,
  Stepper,
  StepLabel,
  StepContent,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";

// api
import { DistributeAPI } from "../../api";

// upload csv
import Papa from "papaparse";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    padding: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: "5%",
  },
  button: {
    margin: theme.spacing(4, 0, 0),
  },
  input: {
    display: "none",
  },
}));

export default function Distribute() {
  const classes = useStyles();
  const resultBlobLinkRef = useRef();
  const statisticsBlobLinkRef = useRef();

  const [blobURL, setBlobURL] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [preselectUploadOpen, setPreselectUploadOpen] = useState(false);
  const [preselectUploaded, setPreselectUploaded] = useState(false);
  const [preselectLoaded, setPreselectLoaded] = useState(false);
  const [preselectFilename, setPreselectFilename] = useState("");
  const [preselectData, setPreselectData] = useState([]);
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
      .then(() =>
        setAlert({
          open: true,
          severity: "success",
          msg: "Course distribution operation succeeded. Distribution result is available.",
        })
      )
      .catch(() =>
        setAlert({
          open: true,
          severity: "error",
          msg: "Course distribution operation failed.",
        })
      )
      .finally(() => setConfirmOpen(false));
  };

  const handleOpenPreselectUpload = () => {
    setPreselectFilename("");
    setPreselectUploadOpen(true);
  };
  const handleClosePreselectUpload = () => {
    setPreselectUploadOpen(false);
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
  return (
    <div>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            <div>Distribute</div>
          </Typography>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            className={classes.button}
            onClick={handleOpenPreselectUpload}
          >
            Upload Preselect
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            className={classes.button}
            onClick={() => setConfirmOpen(true)}
          >
            Run distribution algorithm
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            className={classes.button}
            onClick={handleGetDistribution}
          >
            Download distribution result
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            className={classes.button}
            onClick={handleGetStatistics}
          >
            Download distribution statistics
          </Button>
        </div>
      </Container>
      <Dialog
        open={preselectUploadOpen}
        onClose={() => setPreselectUploadOpen(false)}
      >
        <DialogTitle>Upload Preselect</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please upload a cvs file with all the STUDENT IDs that are
            preselected for "DC Lab". (Format example:
            "B00000001,B00000002,B00000003")
          </DialogContentText>
          <Typography>
            {preselectUploaded && preselectData.length
              ? "Current preselect data:"
              : ""}
          </Typography>
          {preselectUploaded
            ? preselectData.map((id) => <Typography key={id}>{id}</Typography>)
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
          {preselectLoaded && !preselectUploaded ? " " + preselectFilename : ""}
          <DialogActions>
            {preselectUploaded ? (
              <>
                <Button onClick={handleResetPreselectUpload}>
                  Select Another File
                </Button>
                <Button
                  onClick={handleClosePreselectUpload}
                  variant="contained"
                  color="primary"
                >
                  Done
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleClosePreselectUpload}>Cancel</Button>
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
          </DialogActions>
        </DialogContent>
      </Dialog>
      <Dialog
        maxWidth="md"
        fullWidth
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      >
        <DialogTitle>Run Course Distribution Algorithm?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The previous result will be OVERWRITTEN.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={handleRunDistribution}
            variant="contained"
            color="secondary"
          >
            Run
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
