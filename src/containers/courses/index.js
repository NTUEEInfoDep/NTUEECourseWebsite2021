import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
// material-ui
import { Grid, Toolbar, InputBase, Tabs, Tab, Paper } from "@material-ui/core";
import { fade, makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";

// components
import { useSelector } from "react-redux";
import Course from "./course";
import Selection from "../selection";

// api
import { CourseAPI } from "../../api";

// session
import { selectSession } from "../../slices/sessionSlice";

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
    id: "1",
    text: "大一",
  },
  {
    id: "2",
    text: "大二",
  },
  {
    id: "3",
    text: "大三",
  },
  {
    id: "Ten-Select-Two",
    text: "十選二實驗",
  },
  {
    id: "EE-Lab",
    text: "電電實驗",
  },
];

/**
 * This is Courses Page
 */
export default function Courses() {
  const classes = useStyles();
  const history = useHistory();
  // get courses
  const grades = gradeData;
  const { userID } = useSelector(selectSession);
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    // const courseData = fakeCourseData;
    CourseAPI.getCourses()
      .then((res) => {
        setCourses(res.data);
      })
      .catch(() => {});
  }, []);
  // select grade
  //const [selectedGrade, setSelectedGrade] = useState("1");
  /*const handleSelectGrade = (event, value) => {
    setSelectedGrade(value);
  };*/

  // select course
  const [selectedCourse, setSelectedCourse] = useState(null);
  // const handleSelectCourse = (selectedID) => {
  //   setSelectedCourse(courses.find(({ id }) => id === selectedID));
  // };
  const handleSelectCourse = (selectedID) => {
    history.push(`/selection/${selectedID}`); // setSelectedCourse(courses.find(({ id }) => id === selectedID));
  };

  return (
    <div>
      {grades.map(({ id, text }) =>
        courses.filter(
          (c) =>
            c.type === id && (!c.students.length || c.students.includes(userID))
        ).length ? (
          <>
            <p>{text}</p>
            <Grid container>
              {courses
                .filter(
                  (c) =>
                    c.type === id &&
                    (!c.students.length || c.students.includes(userID))
                )
                .map(({ id, name }) => (
                  <Grid item xs={6} sm={4} md={3} key={id}>
                    <Course
                      id={id}
                      name={name}
                      handleSelectCourse={handleSelectCourse}
                    />
                  </Grid>
                ))}
            </Grid>
            <Paper>
              {" "}
              {selectedCourse && <Selection course={selectedCourse} />}{" "}
            </Paper>
          </>
        ) : (
          <></>
        )
      )}
    </div>
  );
}

/*{ <Toolbar>
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
      </Toolbar> }
      <div>
        <Tabs
          value={selectedGrade}
          onChange={handleSelectGrade}
          textColor="secondary"
          indicatorColor="secondary"
          variant="scrollable"
        >
          {grades.map(({ id, text }) => (
            <Tab
              key={id}
              value={id}
              label={text}
              style={{ padding: "0px 0px 0px 0px", width: "20%" }}
            />
          ))}
        </Tabs>
      </div>*/

const fakeCourseData = [
  {
    id: "0",
    name: "演算法",
    type: "3",
    description: "",
    options: ["老師A", "老師B"],
  },
  {
    id: "1",
    name: "電子學",
    type: "2",
    description: "",
    options: ["老師C", "老師D"],
  },
  {
    id: "2",
    name: "網路多媒體實驗",
    type: "0",
    description: "",
    options: ["老師E"],
  },
  {
    id: "3",
    name: "電磁學",
    type: "2",
    description: "",
    options: ["老師F", "老師G", "老師H", "老師I", "老師J"],
  },
];
