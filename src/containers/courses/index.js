import React, { useState, useEffect } from "react";

// material-ui
import { Grid, Toolbar, InputBase, Tabs, Tab, Paper } from "@material-ui/core";
import { fade, makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";

// components
import Course from "./course";
import Selection from "./selection";

const useStyles = makeStyles((theme) => ({
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const gradeData = [
  {
    grade: 1,
    text: "大一",
  },
  {
    grade: 2,
    text: "大二",
  },
  {
    grade: 3,
    text: "大三",
  },
  {
    grade: 0,
    text: "十選二實驗",
  },
];

/**
 * This is Courses Page
 */
export default function Courses() {
  const classes = useStyles();
  // get courses
  const grades = gradeData;
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    // const courseData = axios.get("/api/courses");
    // const gradeData = axios.get("/api/grades");
    // eslint-disable-next-line no-use-before-define
    const courseData = fakeCourseData;
    setCourses(courseData);
  }, []);

  // select grade
  const [selectedGrade, setSelectedGrade] = useState(null);
  const handleSelectGrade = (event, value) => {
    setSelectedGrade(value);
  };

  // select course
  const [selectedCourse, setSelectedCourse] = useState(null);
  const handleSelectCourse = (selectedID) => {
    setSelectedCourse(courses.find(({ courseID }) => courseID === selectedID));
  };

  return (
    <div>
      <Toolbar>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Search…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
          />
        </div>
      </Toolbar>
      <Tabs
        value={selectedGrade}
        onChange={handleSelectGrade}
        textColor="secondary"
        indicatorColor="secondary"
        variant="fullWidth"
      >
        {grades.map(({ grade, text }) => (
          <Tab key={grade} value={grade} label={text} />
        ))}
      </Tabs>
      <Grid container>
        {courses
          .filter((c) => c.grade === selectedGrade)
          .map(({ courseID, name }) => (
            <Grid item xs={6} sm={4} md={3}>
              <Course
                key={courseID}
                id={courseID}
                name={name}
                handleSelectCourse={handleSelectCourse}
              />
            </Grid>
          ))}
      </Grid>
      <Paper> {selectedCourse && <Selection course={selectedCourse} />} </Paper>
    </div>
  );
}

const fakeCourseData = [
  {
    courseID: 0,
    name: "演算法",
    grade: 3,
    options: ["老師A", "老師B"],
  },
  {
    courseID: 1,
    name: "電子學",
    grade: 2,
    options: ["老師C", "老師D"],
  },
  {
    courseID: 2,
    name: "網路多媒體實驗",
    grade: 0,
    options: ["老師E"],
  },
  {
    courseID: 3,
    name: "電磁學",
    grade: 2,
    options: ["老師F", "老師G", "老師H", "老師I", "老師J"],
  },
];
