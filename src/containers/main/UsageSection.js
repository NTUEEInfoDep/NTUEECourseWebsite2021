import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import usagegif from "./NTUEE-usage.gif";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(10),
    margin: "10% auto",
    backgroundColor: "rgba(0,0,0,.7)",
    // boxShadow: "0 0 15px #f3d42e inset",
    maxWidth: 900,
    width: "90%",
    borderRadius: "3%",
  },
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
  },
}));

export default function Usage() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid
          container
          spacing={2}
          direction="row"
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <Grid item xs>
            <Typography
              gutterBottom
              variant="h5"
              style={{ textAlign: "center" }}
            >
              使用說明
            </Typography>
            <Typography
              gutterBottom
              variant="subtitle2"
              style={{ textAlign: "center" }}
            >
              Usage
            </Typography>
          </Grid>
          <Grid item>
            <img
              className={classes.img}
              alt="HowToUse"
              src={usagegif}
            />
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}
