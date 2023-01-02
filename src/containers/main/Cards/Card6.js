import React from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import AssistantPhotoIcon from "@material-ui/icons/AssistantPhoto";
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
  },
  text: {
    fontSize: "16px",
    padding: "5%",
    opacity: ".8",
    lineHeight: "２",
    letterSpacing: "1.2px",
  },
}));
const message = `今年的演算法採用與指考分發演算法相似的Stable Marriage Problem，即學生與課程選項都有各自的志願。課程志願產生流程：`;
export default function Card6() {
  const classes = useStyles();
  return (
    <Grid container style={{ padding: "10px" }}>
      <Grid item className={classes.gridStyle}>
        <Avatar component={AssistantPhotoIcon} className={classes.avatar} />
        <Typography className={classes.subtitle}>補充</Typography>
      </Grid>
      <Grid
        item
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography className={classes.paragraph}>{message}</Typography>
        <div style={{ margin: "3% 5% 3% 5%" }}>
          <Typography className={classes.text}>
            １. 每個人的起始優先度是 0
          </Typography>
          <Typography className={classes.text}>
            2. 優先度會受到該選項的志願序影響，如果你將課程中的某個選項設為第X志願，你的優先度將會減X(簡單來說，志願放越前面越容易上)
          </Typography>
          <Typography className={classes.text}>
            3. 如果遇到有高年級優先的課，根據你是 X 年級優先度加 X (4
            年級以上算 4 年級)
          </Typography>
          <Typography className={classes.text}>
            4. 如果是大 X 優先而且你是大 X，則您的優先度加 1。
          </Typography>
          <Typography className={classes.text}>
            5. 依上述規則產生該課程/實驗的優先度列表，若有一群學生的優先度相同則用random隨機排序。
          </Typography>
          <Typography className={classes.text}>
            6. 依照Stable Marriage Problem的方式進行分發。
          </Typography>
        </div>
      </Grid>
    </Grid>
  );
}
