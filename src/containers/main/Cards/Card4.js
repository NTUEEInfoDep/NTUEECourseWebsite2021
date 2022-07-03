import React from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import BatteryCharging80Icon from "@material-ui/icons/BatteryCharging60";
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
    color: "white",
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
    padding: "8px",
    opacity: ".8",
    lineHeight: "1.5",
    letterSpacing: "1px",
  },
}));
const message = `唯有意願修自動控制實驗的學生必須填寫。`;
export default function Card4() {
  const classes = useStyles();
  return (
    <Grid container style={{ padding: "10px" }}>
      <Grid item className={classes.gridStyle}>
        <Avatar component={BatteryCharging80Icon} className={classes.avatar} />
        <Typography className={classes.subtitle}>
          自動控制實驗先修調查
        </Typography>
      </Grid>
      <Grid
        item
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography className={classes.paragraph}>{message}</Typography>
        <Typography className={classes.text}>
          * 先修課程：與控制相關的課程（不局限於本系所開授的控制系統）
        </Typography>
        <Typography className={classes.text}>
          * 以Google表單的方式進行調查，需填寫修課學期、開課系所、課程名稱。
        </Typography>
        <Typography className={classes.text}>
          Google表單:{" "}
          <a
            href={"https://forms.gle/UpdCJZUpSHemwEeC6"}
            style={{ overflow: "hidden", color: "#b2ebf2" }}
          >
            {"https://forms.gle/UpdCJZUpSHemwEeC6"}
          </a>
        </Typography>
      </Grid>
    </Grid>
  );
}
