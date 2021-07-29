import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import BatteryCharging60Icon from "@material-ui/icons/BatteryCharging60";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  title: {
    padding: "10px",
    textAlign: "center"
  },
  avatar: {
    margin: "0 15px",
    color:'white',
    width: theme.spacing(4),
    height: theme.spacing(4)
    // width:'10%',
  },
  gridStyle: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center"
    // padding: "25px 20px"
  },
  subtitle: {
    color: "white",
    fontSize: "1.2rem",
    marginBottom: "5px",
    textAlign: "center"
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
    margin:'auto',//文字塊居中?
  },
  text: {
    color: "white",
    fontSize: "16px",
    padding: "8px",
    opacity: ".8",
    lineHeight: ".5",
    letterSpacing: "1px"
  }
}));
const message = `依照想選的實驗課程，排列志願序。根據系上規定，學生應修習不同類二門。詳細課程規定請參閱學術部公告。抽籤作業流程：`;
export default function Card2() {
  const classes = useStyles();
  return (
    <Grid
      container
      style={{ padding: "10px" }}
    >
      <Grid item className={classes.gridStyle}>
        <Avatar component={BatteryCharging60Icon} className={classes.avatar} />
        <Typography className={classes.subtitle}>十選二實驗</Typography>
      </Grid>
      <Grid
        item
        style={{
          display: "flex",
          flexDirection: "column"
        }}
      >
        <Typography className={classes.paragraph}>{message}</Typography>
        <Typography className={classes.text}>步驟一：數電實驗抽籤</Typography>
        <Typography className={classes.text}>步驟二：九實驗志願抽籤</Typography>
      </Grid>
    </Grid>
  );
}