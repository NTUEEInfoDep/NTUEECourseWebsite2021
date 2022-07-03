import React from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import BatteryChargingFullIcon from "@material-ui/icons/BatteryCharging60";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  title: {
    padding: "10px",
    textAlign: "center",
  },
  avatar: {
    margin: "0 15px",
    width: theme.spacing(4),
    height: theme.spacing(4),
    color: "white",
    // width:'10%',
  },
  gridStyle: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    marginTop: "10%",
    // padding: "25px 20px"
  },
  subtitle: {
    fontSize: "1.2rem",
    marginBottom: "5%",
    textAlign: "center",
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
  text: {
    color: "white",
    fontSize: "16px",
    opacity: ".8",
    lineHeight: "1.5",
    letterSpacing: "1px",
  },
}));
const message = `針對已選上實驗課的同學，進行時段分配。`;
export default function Card5() {
  const classes = useStyles();
  return (
    <Grid container style={{ padding: "10px", display: "flex", flexDirection: "column" }}>
      <Grid item className={classes.gridStyle}>
        <Avatar
          component={BatteryChargingFullIcon}
          className={classes.avatar}
        />
        <Typography className={classes.subtitle}>電磁波＆半導體時段</Typography>
      </Grid>
      <Grid
        item
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography className={classes.paragraph}>{message}</Typography>
        <div style={{ margin: "3% 13% 3% 13%" }}>
          <Typography className={classes.text}>
            電磁波：兩個時段各12人。
          </Typography>
          <Typography className={classes.text} style={{ textIndent: "12px" }}>
            １. 星期二 09:00～12:00
          </Typography>
          <Typography className={classes.text} style={{ textIndent: "12px" }}>
            ２. 星期三 09:00～12:00
          </Typography>
        </div>
        <div style={{ margin: "3% 13% 3% 15%" }}>
          <Typography className={classes.text}>
            半導體時段：兩個時段各5～7人。
          </Typography>
          <Typography className={classes.text} style={{ textIndent: "12px" }}>
            １. 星期一 18:00～21:00
          </Typography>
          <Typography className={classes.text} style={{ textIndent: "12px" }}>
            ２. 星期二 18:00～21:00
          </Typography>
        </div>
      </Grid>
    </Grid>
  );
}
