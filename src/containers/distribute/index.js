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
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";

// api
import { DistributeAPI } from "../../api";

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
}));

export default function Distribute() {
  const classes = useStyles();
  const resultBlobLinkRef = useRef();
  const statisticsBlobLinkRef = useRef();

  const [blobURL, setBlobURL] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
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
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            className={classes.button}
            onClick={() => setConfirmOpen(true)}
          >
            Run distribution algorithm
          </Button>
        </div>
      </Container>
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
