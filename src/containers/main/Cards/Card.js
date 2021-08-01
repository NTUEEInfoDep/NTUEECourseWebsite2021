import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  title: {
    padding: "10px",
    textAlign: "center",
  },
  avatar: {
    margin: "0 15px",
    color: "white",
    width: theme.spacing(4),
    height: theme.spacing(4),
    // width:'10%',
  },
  gridStyle: {
    marginTop:"20%",
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    // padding: "5px 0px"
  },
  subtitle: {
    // color: "white",
    marginBottom: "5%",
    textAlign: "center",
    fontSize: "1.2rem",
  },
  paragraph: {
    width: "100%",
    color: "white",
    textAlign: "start",
    fontSize: "16px",
    padding: "10px",
    opacity: ".8",
    lineHeight: "1.8",
    textIndent: "32px",
    letterSpacing: "1px",
  },
}));

export default function Card(props) {
  const classes = useStyles();
  const { message, title, icon } = props;
  return (
    <Grid container style={{ padding: "10px" }}>
      <Grid item className={classes.gridStyle}>
        <Avatar component={icon} className={classes.avatar} />
        <Typography className={classes.subtitle}>{title}</Typography>
      </Grid>
      <Grid item>
        <Typography className={classes.paragraph}>{message}</Typography>
      </Grid>
    </Grid>
  );
}
