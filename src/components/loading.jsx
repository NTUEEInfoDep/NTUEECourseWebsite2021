import React from "react";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    justifyContent: "center",
    minHeight: "100vh",
  },
  progress: {
    marginTop: "30vh",
  },
});
const Loading = () => {
  const classes = useStyles();
  return (
    <Container component="div" maxWidth="lg">
      <CssBaseline />
      <Grid container className={classes.root}>
        <Grid item className={classes.progress}>
          <CircularProgress />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Loading;
