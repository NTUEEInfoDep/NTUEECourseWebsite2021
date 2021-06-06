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
import { Add } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

// components
import CourseTable from "./CourseTable";

// api
import { CourseAPI } from "../../api";

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
    id: "0",
    text: "十選二實驗",
  },
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
  const [courses, setCourses] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [course, setCourse] = useState(emptyCourse);
  const [newOption, setNewOption] = useState("");
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({});

  const handleOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setNewOption("");
    setErrors({});
    setDialogOpen(false);
  };

  const showAlert = (severity, msg) => {
    setAlert({ open: true, severity, msg });
  };

  const handleCourse = (event, key) => {
    setCourse({ ...course, [key]: event.target.value });
    if (event.target.value.length) setErrors({ ...errors, [key]: false });
  };

  const handleCourseOption = (event) => {
    setNewOption(event.target.value);
    setErrors({
      ...errors,
      newOption: !!course.options.find(
        (option) => option === event.target.value
      ),
    });
  };

  const handleCourseAddOption = () => {
    if (!newOption.length || errors.newOption) {
      if (errors.newOption)
        showAlert("warning", `The option ${newOption} is repeated.`);
      return;
    }
    setCourse({ ...course, options: [...course.options, newOption] });
    setNewOption("");
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
      setCourses(await CourseAPI.getCourses());
    } catch (err) {
      // showAlert("error", "Failed to load courses.");
    }
  };

  const handleCourseApply = async () => {
    const errs = {};
    ["id", "name", "type", "options"].forEach((key) => {
      errs[key] = !course[key]?.length;
    });
    setErrors({ ...errors, ...errs });
    if (Object.keys(errs).some((key) => errs[key])) {
      if (errs?.id) showAlert("warning", "Course ID is required.");
      else if (errs?.name) showAlert("warning", "Course Name is required.");
      else if (errs?.type) showAlert("warning", "Course Type is required.");
      else if (errs?.options)
        showAlert("warning", "At least one option required.");
      return;
    }
    try {
      if (currentId === "") {
        const response = await CourseAPI.postCourse(course);
        showAlert("success", `Course ${course.name} added.`);
        setCourses([...courses, response]);
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
    handleOpen();
  };

  const deleteCourse = (index) => {
    setCurrentId(courses[index].id);
    setCourse(courses[index]);
    setConfirmOpen(true);
  };

  useEffect(() => {
    handleCoursesReload();
    // eslint-disable-next-line no-use-before-define
    setCourses(dummyCourses);
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
          <TextField
            id="desc"
            label="Description (HTML)"
            type="text"
            fullWidth
            multiline
            value={course.description}
            onChange={(e) => handleCourse(e, "description")}
          />
          <DialogContentText className={classes.optionsTitle}>
            Options
          </DialogContentText>
          <div className={classes.options}>
            {course.options.map((option, _index) => (
              <Chip
                label={option}
                variant="outlined"
                color={option === newOption ? "secondary" : "default"}
                onDelete={() => handleCourseDelOption(_index)}
                padding={1}
                // color="primary"
              />
            ))}
          </div>
          <div className={classes.optionsAdd}>
            <TextField
              placeholder="Add Options..."
              value={newOption}
              error={errors.newOption}
              onChange={handleCourseOption}
              onKeyDown={(e) => {
                if (e.code === "Enter") handleCourseAddOption();
              }}
            />
            <Button
              startIcon={<Add />}
              variant="outlined"
              color="primary"
              size="small"
              onClick={handleCourseAddOption}
            >
              Add
            </Button>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
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
            Options: {course.options.join(",")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="primary">
            Cancel
          </Button>
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

const dummyCourses = [
  {
    id: "Ten-Select-Two",
    name: "十選二實驗",
    type: "0",
    description:
      '<p>(1) 請詳閱 <a href="https://bit.ly/3o0MrAb" target="_blank" style="color: #45bbff;">實驗規定</a>，攸關各位的權利。</p><p>(2)特別轉載半導體實驗規定： ★★大學畢業後欲投入半導體領域者，可保留名額  ★★實驗期間需全程戴口罩、穿實驗衣含無塵衣,且著裝後需能自由移動。  ★★需遵守政府、臺大及實驗室之公共安全規定。  ★★環安衛法律條文規定沒有英文部份,若有外藉生不懂中文,將請助教以英文口譯告知。  ★★Electrical Engineering Lab (semiconductor) safety rules: ★In the labs,  students are required to wear  masks and lab  coats /cleanroom suits, and can be able to move freely with the  coats/suits.  ★★All persons in labs must follow the related safety regulations required by the labs, NTU, and the government.  ★★Enrolled international students  will be informed by teaching assistants orally in case that the English regulations/statutes of occupational health and safety, and environmental protection are not officially available.</p><p>(3) 數電請進入 <a href="https://forms.gle/kJowuD9SynDYQpjB6" target="_blank" style="color: #45bbff;">此表單</a> 報名。</p>',
    options: [
      "電力電子",
      "自動控制",
      "嵌入式系統",
      "電磁波",
      "半導體",
      "通信專題",
      "網路與多媒體",
      "生醫工程",
      "光電",
    ],
  },
  {
    id: "Electronic-Circuit",
    name: "電路學",
    type: "1",
    description: "",
    options: ["老師A", "老師B", "老師C", "老師D", "老師E"],
  },
  {
    id: "Electronics-two",
    name: "電子學（二）",
    type: "2",
    description: "",
    options: ["老師F", "老師G", "老師H", "老師I"],
  },
  {
    id: "Electormagnetics-two",
    name: "電磁學二",
    type: "2",
    description: "",
    options: ["老師J", "老師K", "老師L", "老師M", "老師N"],
  },
  {
    id: "Signals-Systems",
    name: "信號與系統",
    type: "2",
    description: "",
    options: ["老師O", "老師P", "老師Q", "老師R"],
  },
  {
    id: "Probability-Statistics",
    name: "機率與統計",
    type: "2",
    description: "",
    options: ["老師S", "老師T", "老師U"],
  },
  {
    id: "Algorithm",
    name: "演算法",
    type: "3",
    description: "",
    options: ["老師V"],
  },
];
