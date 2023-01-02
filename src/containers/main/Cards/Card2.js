import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import BatteryCharging60Icon from "@material-ui/icons/BatteryCharging60";
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
    marginTop: "10%",
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    // padding: "25px 20px"
  },
  subtitle: {
    color: "white",
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
    // margin:'auto',//文字塊居中?
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
const message = `選擇有興趣的實驗，並設置志願序。可設置0~9個志願序 (不含數電實驗)，所有志願序都有可能選上。數電實驗另開Google表單，3人組隊報名。表單開放時間與預選系統相同。所有學生至多選上2門實驗，包含數電實驗。根據系上規定，學生應於修業年限內修習不同類二門。詳細實驗規定請參閱學術部公告。抽籤作業流程：`;
export default function Card2() {
  const classes = useStyles();
  return (
    <Grid container style={{ padding: "10px" }}>
      <Grid item className={classes.gridStyle}>
        <Avatar component={BatteryCharging60Icon} className={classes.avatar} />
        <Typography className={classes.subtitle}>十選二實驗</Typography>
      </Grid>
      <Grid
        item
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography className={classes.paragraph}>{message}</Typography>
        <Typography className={classes.text} style={{ paddingLeft: "25px" }}>
          步驟一：數電實驗抽籤
        </Typography>
        <Typography className={classes.text} style={{ paddingLeft: "25px" }}>
          步驟二：九實驗志願抽籤
        </Typography>
        <br />
        <Typography className={classes.text}>
          十選二實驗規定:{" "}
          <a
            href={"https://reurl.cc/oQgz4Q"}
            style={{ overflow: "hidden", color: "#b2ebf2" }}
          >
            {"https://reurl.cc/oQgz4Q"}
          </a>
        </Typography>
        <Typography className={classes.text}>
          課程表:{" "}
          <a
            href={"https://reurl.cc/yME1lq"}
            style={{ overflow: "hidden", color: "#b2ebf2" }}
          >
            {"https://reurl.cc/yME1lq"}
          </a>
        </Typography>
      </Grid>
    </Grid>
  );
}
