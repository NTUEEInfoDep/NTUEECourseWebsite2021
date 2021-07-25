import React, { useState, useEffect } from "react";

// material-ui
import {
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Snackbar,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Add, Edit } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

// components
import CourseTable from "./CourseTable";

// api
import { CourseAPI } from "../../api";

//MdEditor
import MDEditor from "@uiw/react-md-editor";
import "./mdeditor.css";

const useStyles = makeStyles((theme) => ({
  optionsTitle: {
    margin: `${theme.spacing(1)}px 0 0 0`,
  },
  options: {
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
  optionsAdd: {
    margin: `${theme.spacing(1)}px 0 0 0`,
  },
}));

const typeData = [
  {
    id: "1",
    text: "大一必修",
  },
  {
    id: "2",
    text: "大二必修",
  },
  {
    id: "3",
    text: "大三必修",
  },
  {
    id: "4",
    text: "大四必修",
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

const priorityData = [
  { id: 0, text: "無" },
  { id: 1, text: "大一" },
  { id: 2, text: "大二" },
  { id: 3, text: "大三" },
  { id: 4, text: "大四" },
  { id: 5, text: "大三大四" },
  { id: -1, text: "高年級" },
];

/**
 * Course Management Page
 */
export default function CourseManage() {
  const classes = useStyles();
  // courses
  const emptyCourse = {
    id: "",
    name: "",
    type: "",
    description: "",
    options: [],
  };
  const emptyOption = {
    name: "",
    limit: "",
    priority: "",
  };
  const [courses, setCourses] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [course, setCourse] = useState(emptyCourse);
  const [newOption, setNewOption] = useState(emptyOption);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({});
  const [mdescription, setMDescription] = useState("");

  const handleOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setNewOption(emptyOption);
    setErrors({});
    setDialogOpen(false);
    setMDescription("");
  };

  const showAlert = (severity, msg) => {
    setAlert({ open: true, severity, msg });
  };

  const handleCourse = (event, key) => {
    setCourse({ ...course, [key]: event.target.value });
    if (event.target.value.length) setErrors({ ...errors, [key]: false });
  };

  const handleCourseOption = (event, key) => {
    if (key === "limit" && event.target.value.replace(/[^\d]/g, "") !== "") {
      setNewOption({
        ...newOption,
        [key]: Number(event.target.value.replace(/[^\d]/g, ""), 10),
      });
    } else {
      if (key !== "limit") {
        setNewOption({ ...newOption, [key]: event.target.value });
      } else {
        setNewOption({ ...newOption, [key]: "" });
      }
    }
    setErrors({
      ...errors,
      newOption: !!course.options.find(
        (option) => option.name === event.target.value
      ),
    });
  };

  const handleCourseAddOption = () => {
    if (newOption.name === "") {
      showAlert("warning", `Name is required.`);
      return;
    }
    if (errors.newOption) {
      if (errors.newOption)
        showAlert("warning", `The option ${newOption.name} is repeated.`);
      return;
    }
    if (newOption.limit === "") {
      showAlert("warning", `Limit is required.`);
      return;
    }
    if (newOption.priority === "") {
      showAlert("warning", `Priority is required.`);
      return;
    }
    setCourse({
      ...course,
      options: [...course.options, newOption],
    });
    setNewOption(emptyOption);
  };

  const handleCourseDelOption = (index) => {
    if (course.options[index] === newOption)
      setErrors({
        ...errors,
        newOption: false,
      });
    setCourse({
      ...course,
      options: [
        ...course.options.slice(0, index),
        ...course.options.slice(index + 1),
      ],
    });
  };

  const handleCoursesReload = async () => {
    try {
      setCourses((await CourseAPI.getCourses()).data);
    } catch (err) {
      showAlert("error", "Failed to load courses.");
    }
  };

  const handleCourseApply = async () => {
    const errs = {};
    ["id", "name", "type", "description", "options"].forEach((key) => {
      errs[key] = !course[key]?.length;
    });
    setErrors({ ...errors, ...errs });
    if (Object.keys(errs).some((key) => errs[key])) {
      if (errs?.id) showAlert("warning", "Course ID is required.");
      else if (errs?.name) showAlert("warning", "Course Name is required.");
      else if (errs?.type) showAlert("warning", "Course Type is required.");
      else if (errs?.description)
        showAlert("warning", "Course Description is required.");
      else if (errs?.options)
        showAlert("warning", "At least one option is required.");
      return;
    }
    try {
      if (currentId === "") {
        await CourseAPI.postCourse(course);
        showAlert("success", `Course ${course.name} added.`);
        handleCoursesReload();
        handleClose();
      } else {
        await CourseAPI.putCourse({
          ...course,
          id: currentId,
        });
        showAlert("success", `Course ${course.name} modified.`);
        handleCoursesReload();
        handleClose();
      }
    } catch (err) {
      showAlert("error", "Operation failed.");
      handleCoursesReload();
    }
  };

  const handleCourseDelete = async () => {
    try {
      await CourseAPI.deleteCourse(currentId);
      showAlert("success", `Course ${course.name} deleted.`);
      setCourses(courses.filter((c) => c.id !== currentId));
      setConfirmOpen(false);
    } catch (err) {
      showAlert("error", "Deletion failed.");
      handleCoursesReload();
    }
  };

  const reorderCourse = (index, offset) => {
    const excluded = [...courses.slice(0, index), ...courses.slice(index + 1)];
    const position = index + offset;
    setCourses([
      ...excluded.slice(0, position),
      courses[index],
      ...excluded.slice(position),
    ]);
  };

  const addCourse = () => {
    setCurrentId("");
    setCourse(emptyCourse);
    handleOpen();
  };

  const editCourse = (index) => {
    setCurrentId(courses[index].id);
    setCourse(courses[index]);
    setMDescription(courses[index].description);
    handleOpen();
  };

  const deleteCourse = (index) => {
    setCurrentId(courses[index].id);
    setCourse(courses[index]);
    setConfirmOpen(true);
  };

  useEffect(() => {
    setCourse({ ...course, description: mdescription });
  }, [mdescription]);

  useEffect(() => {
    handleCoursesReload();
  }, []);

  return (
    <div>
      <Grid container spacing={3} direction="row">
        <Grid item sm={12}>
          <Button onClick={addCourse} variant="contained" color="primary">
            Add Course
          </Button>
        </Grid>
        <Grid item sm={12}>
          <CourseTable
            courses={courses}
            typeData={typeData}
            reorderCourse={reorderCourse}
            editCourse={editCourse}
            deleteCourse={deleteCourse}
          />
        </Grid>
      </Grid>
      <Dialog
        maxWidth="md"
        fullWidth
        disableBackdropClick
        open={dialogOpen}
        onClose={handleClose}
      >
        <DialogTitle>{currentId === "" ? "Add" : "Edit"} Course</DialogTitle>
        <DialogContent>
          <TextField
            id="id"
            label="Course ID"
            type="text"
            fullWidth
            value={course.id}
            error={errors.id}
            disabled={currentId !== ""}
            onChange={(e) => handleCourse(e, "id")}
          />
          <TextField
            id="name"
            label="Course Name"
            type="text"
            fullWidth
            value={course.name}
            error={errors.name}
            onChange={(e) => handleCourse(e, "name")}
          />
          <FormControl fullWidth>
            <InputLabel>Course Type</InputLabel>
            <Select
              fullWidth
              value={course.type}
              error={errors.type}
              onChange={(e) => handleCourse(e, "type")}
            >
              {typeData.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.text}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* <TextField
            id="desc"
            label="Description (HTML)"
            type="text"
            fullWidth
            multiline
            value={course.description}
            error={errors.description}
            onChange={(e) => handleCourse(e, "description")}
          /> */}

          <DialogContentText className={classes.optionsTitle} >
            Options
          </DialogContentText>
          <div className={classes.options}>
            {course.options.map((option, _index) => (
              <Chip
                key={option.name}
                label={option.name}
                variant="outlined"
                color={option === newOption ? "secondary" : "default"}
                onDelete={() => handleCourseDelOption(_index)}
                padding={1}
              />
            ))}
          </div>
          <div className={classes.optionsAdd} style={{ marginTop: "3px" }}>
            <TextField
              placeholder="name"
              value={newOption.name}
              error={errors.newOption}
              onChange={(e) => handleCourseOption(e, "name")}
              onKeyDown={(e) => {
                if (e.code === "Enter") handleCourseAddOption();
              }}
            />
            <TextField
              placeholder="limit"
              value={newOption.limit}
              error={errors.newOption}
              style={{ width: "50px", marginLeft: "20px" }}
              onChange={(e) => handleCourseOption(e, "limit")}
              onKeyDown={(e) => {
                if (e.code === "Enter") handleCourseAddOption();
              }}
            />
            <FormControl
              className={classes.formControl}
              style={{ marginLeft: "20px", marginTop: "-16px" }}
            >
              <InputLabel>priority</InputLabel>
              <Select
                value={newOption.priority}
                error={errors.newOption}
                onChange={(e) => handleCourseOption(e, "priority")}
                style={{ width: "100px" }}
              >
                {priorityData.map((priority) => (
                  <MenuItem key={priority.id} value={priority.id}>
                    {priority.text}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              startIcon={<Add />}
              variant="outlined"
              size="small"
              onClick={handleCourseAddOption}
              style={{ marginLeft: "10px" }}
            >
              Add
            </Button>
          </div>
          <DialogContentText className={classes.optionsTitle} style={{ marginTop: "10px" }}>
            Description
          </DialogContentText>
          <div className="editor">
            <MDEditor value={mdescription} onChange={setMDescription} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleCourseApply}
            variant="contained"
            color="primary"
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        maxWidth="md"
        fullWidth
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      >
        <DialogTitle>Delete Course {course.name}?</DialogTitle>
        <DialogContent>
          <DialogContentText className={classes.optionsTitle}>
            Are you sure you want to delete the course {course.name}?<br />
            This action is IRREVOCABLE.
            <br />
            <br />
            ID: {course.id}
            <br />
            Type: {typeData.find((type) => type.id === course.type)?.text}
            <br />
            Options: {course.options.length}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCourseDelete}
            variant="contained"
            color="secondary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={alert?.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert variant="filled" severity={alert?.severity}>
          {alert?.msg}
        </Alert>
      </Snackbar>
    </div>
  );
}
