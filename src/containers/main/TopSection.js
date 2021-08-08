import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectSession } from "../../slices/sessionSlice";
import { Element, scroller } from "react-scroll";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import DownArrow from "./downarrow.js";
import moment from "moment";
import PickTime from "./SetTimeButton.js";
import { OpentimeAPI } from "../../api";
/**
 * This is Main Page
 */
export default function Top() {
  //get start time and end time
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await OpentimeAPI.getOpentime();
        setStart(res.data.start);
        setEnd(res.data.end);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [start,end]); // [] only run the first time

  const { authority } = useSelector(selectSession);
  //count left time
  const [leftDays, setLeftDays] = useState("00");
  const [leftHours, setLeftHours] = useState("00");
  const [leftMinutes, setLeftMinutes] = useState("00");
  const [leftSeconds, setLeftSeconds] = useState("00");
  
  let timer = useRef();
  

  // let interval = useRef();
  const countDown = () => {
    //intervalId
      timer = setInterval(() => {
      const now = new Date().getTime();
      const gap = end * 1000 - now;

      const second = 1000;
      const minute = second * 60;
      const hour = minute * 60;
      const day = hour * 24;

      const textDay = Math.floor(gap / day);
      const textHour = Math.floor((gap % day) / hour);
      const textMinute = Math.floor((gap % hour) / minute);
      const textSecond = Math.floor((gap % minute) / second);

      if (gap < 0) {
        alert("Time's up! You cannot preselect courses any more!")
        clearInterval(timer);
      } else {
        setLeftDays(textDay);
        setLeftHours(textHour);
        setLeftMinutes(textMinute);
        setLeftSeconds(textSecond);
      }
    }, 1000);
    };
  useEffect(() => {
    countDown();
    return () => {
      if (timer) clearInterval(timer);
    };
  },[end]);

  var moment = require("moment");

  const useStyles = makeStyles(() => ({
    root: {
      flexGrow: 1,
      width: "100%",
      height: "90vh",
    },
    paper: {
      background: "rgb(0,0,0,.0)",
      boxShadow: "none",
    },
    text: {
      margin: "auto",

      textAlign: "start",
      textDecoration: "underline",
      width: "80%",
    },
    time: {
      margin: "auto",
      color: "#F5DE83",
      textAlign: "end",
      width: "70%",
      fontWeight: "400",
    },
  }));

  const scrollToNextSection = () => {
    scroller.scrollTo("explanation", { smooth: true, duration: 1500 });
  };
  const classes = useStyles();
  return (
    <Element name="title">
      <div className={classes.root}>
        {authority===2 && <PickTime handleSetStart={setStart} handleSetEnd={setEnd}/>}
        <Grid
          container
          direction="column"
          style={{
            // boxShadow: "0 0 15px #f3d42e inset",
            padding: "10px",
            margin: "auto",
            marginTop: "5%",
            width: "90%",
            maxWidth: "500px",
            maxHeight: "500px",
          }}
        >
          <Paper className={classes.paper}>
            <Grid item style={{ marginTop: "20%", marginLeft: "5%" }}>
              <Typography
                gutterBottom
                variant="h5"
                className={classes.text}
                style={{ opacity: ".5", textDecoration: "none" }}
              >
                NTUEE
              </Typography>
              <Typography
                gutterBottom
                variant="h4"
                className={classes.text}
                style={{ marginBottom: "20px" }}
              >
                Pre-selection
              </Typography>
              <Typography gutterBottom variant="h6" className={classes.time}>
                開始: {moment(start * 1000).format("YYYY-MM-DD HH:mm:ss")}
              </Typography>
              <Typography gutterBottom variant="h6" className={classes.time}>
                結束: {moment(end * 1000).format("YYYY-MM-DD HH:mm:ss")}
              </Typography>
              <Typography gutterBottom variant="h6" className={classes.time}>
                剩餘: {leftDays}天{leftHours}小時{leftMinutes}分{leftSeconds}秒
              </Typography>
            </Grid>
          </Paper>
        </Grid>
        <div
          onClick={scrollToNextSection}
          style={{ margin: "auto", maxWidth: "46px", marginTop: "12%" }}
        >
          <DownArrow />
        </div>
      </div>
    </Element>
  );
}
