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
  Typography,
  Snackbar,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Add, Edit } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";

// components
import MDEditor from "@uiw/react-md-editor";
import Papa from "papaparse";
import CourseTable from "./CourseTable";

import { selectSession } from "../../slices/sessionSlice";
// api
import { CourseAPI, StudentDataAPI, DistributeAPI } from "../../api";

// MdEditor
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
    id: "Ten-Select-Two",
    text: "十選二實驗",
  },
  {
    id: "EE-Lab",
    text: "電電實驗",
  },
];

const priorityData = [
  { id: "none", text: "無" },
  { id: "higher-grade-first", text: "高年級優先" },
  { id: "grades", text: "特定年級優先" },
  { id: "guarantee-third-grade", text: "大三保證" },
  { id: "guarantee-fourth-grade", text: "大四保證" },
  { id: "preselect", text: "預選" },
  { id: "", text: "無" },
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
    number: 1,
    students: [],
  };
  const emptyOption = {
    name: "",
    limit: "",
    priority_type: "",
    priority_value: 0,
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
  const [editOption, setEditOption] = useState(0);
  const [grades, setGrades] = useState([]);

  const [uploaded, setUploaded] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const [filename, setFilename] = React.useState("");
  const [singlePreselect, setSinglePreselect] = useState("");
  const [newStudentMultiple, setNewStudentMultiple] = React.useState({
    id: "",
    name: "",
    grade: "",
    authority: "",
  });

  const [students, setStudents] = useState([]);
  const [addMultipleOpen, setAddMultipleOpen] = React.useState(false);
  const [preselectUploaded, setPreselectUploaded] = useState(false);
  const [preselectLoaded, setPreselectLoaded] = useState(false);
  const [preselectFilename, setPreselectFilename] = useState("");
  const [preselectData, setPreselectData] = useState([]);
  const [addSingleOpen, setAddSingleOpen] = useState(false);

  const handleOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setNewOption(emptyOption);
    setErrors({});
    setDialogOpen(false);
    setMDescription("");
    setEditOption(0);
  };

  const showAlert = (severity, msg) => {
    setAlert({ open: true, severity, msg });
  };

  const handleCourse = (event, key) => {
    if (key === "number" && event.target.value.replace(/[^\d]/g, "") !== "") {
      setCourse({
        ...course,
        [key]: Number(event.target.value.replace(/[^\d]/g, ""), 10),
      });
      // if (Number(event.target.value.replace(/[^\d]/g, ""), 10) === 0) {
      //   setErrors({ ...errors, [key]: true });
      // } else {
      //   setErrors({ ...errors, [key]: false });
      // }
    } else {
      setCourse({ ...course, [key]: event.target.value });
    }
    if (event.target.value.length) setErrors({ ...errors, [key]: false });
  };

  const handleCourseOption = (event, key) => {
    if (key === "limit" && event.target.value.replace(/[^\d]/g, "") !== "") {
      setNewOption({
        ...newOption,
        [key]: Number(event.target.value.replace(/[^\d]/g, ""), 10),
      });
    } else if (
      key === "priority_value" &&
      event.target.value.replace(/[^\d]/g, "") !== ""
    ) {
      setNewOption({
        ...newOption,
        [key]: Number(event.target.value.replace(/[^\d]/g, ""), 10),
      });
    } else if (key !== "limit") {
      setNewOption({ ...newOption, [key]: event.target.value });
    } else {
      setNewOption({ ...newOption, [key]: "" });
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
    if (index === editOption - 1) {
      setNewOption(emptyOption);
      setEditOption(0);
    }
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
    ["id", "name", "type", "options"].forEach((key) => {
      errs[key] = !course[key]?.length;
    });
    if (!course.number || course.number === 0) {
      errs.number = true;
    }
    setErrors({ ...errors, ...errs });
    if (Object.keys(errs).some((key) => errs[key])) {
      if (errs?.id) showAlert("warning", "Course ID is required.");
      else if (errs?.name) showAlert("warning", "Course Name is required.");
      else if (errs?.type) showAlert("warning", "Course Type is required.");
      // else if (errs?.description)
      //   showAlert("warning", "Course Description is required.");
      else if (errs?.number)
        showAlert(
          "warning",
          "Limitation selected courses number must be larger than 0"
        );
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

  const handleEditOption = (index) => {
    setEditOption(index + 1);
    setNewOption(course.options[index]);
  };

  const handleModifyOption = (index) => {
    if (newOption.name === "") {
      showAlert("warning", `Name is required.`);
      return;
    }
    if (errors.newOption) {
      showAlert("warning", `The option ${newOption.name} is repeated.`);
      return;
    }
    if (newOption.limit === "") {
      showAlert("warning", `Limit is required.`);
      return;
    }
    if (newOption.priority_type === "") {
      showAlert("warning", `Priority_type is required.`);
      return;
    }
    setCourse({
      ...course,
      options: [
        ...course.options.slice(0, index),
        newOption,
        ...course.options.slice(index + 1),
      ],
    });
    setNewOption(emptyOption);
    setEditOption(0);
  };

  // handler for add multiple student dialog
  const handleOpenAddMultiple = () => {
    // console.log("handleOpenAddMultiple");
    setUploaded(false);
    setNewStudentMultiple({
      id: "",
      name: "",
      grade: "",
      authority: "",
    });
    setLoaded(false);
    setFilename("");
    // setPreselectData([]);
    setAddMultipleOpen(true);
  };
  const handleCloseAddMultiple = () => {
    // console.log("handleCloseAddMultiple");
    setUploaded(false);
    setNewStudentMultiple({
      id: "",
      name: "",
      grade: "",
      authority: "",
    });
    setLoaded(false);
    setFilename("");
    // setPreselectData([]);
    setAddMultipleOpen(false);
  };

  // handler for add single student dialog
  const handleOpenAddSingle = () => {
    // console.log("handleOpenAddMultiple");
    setSinglePreselect("");
    // setPreselectData([]);
    setAddSingleOpen(true);
  };
  const handleCloseAddSingle = () => {
    // console.log("handleOpenAddMultiple");
    setSinglePreselect("");
    // setPreselectData([]);
    setAddSingleOpen(false);
  };

  const handleAddMultipleStudents = async () => {
    // console.log("handleAddMultipleStudents");
    if (loaded) {
      const newData = newStudentMultiple.map((student) => {
        const password = genPassword();
        return { ...student, password };
      });
      // console.log(newData);
      // console.log("start post datas");
      try {
        await StudentDataAPI.postStudentData(
          newData.map((student) => {
            return {
              userID: student.id,
              grade: Number(student.grade),
              password: student.password,
              name: student.name,
              authority: Number(student.authority),
            };
          })
        );
        // console.log("finish post");
        setUploaded(true);
        setData(data.concat(newData));
        // console.log(newData);
        // console.log(data);

        setNewStudentMultiple({
          id: "",
          name: "",
          grade: "",
          authority: "",
        });

        setLoaded(false);
        const csvData = [];
        newData.forEach((e) => {
          csvData.push({
            userID: e.id,
            name: e.name,
            grade: e.grade,
            password: e.password,
          });
        });
        setCsv(Papa.unparse(csvData));
        showAlert("success", "Add multiple student data complete.");
      } catch (err) {
        showAlert("error", "Failed to Add multiple student data.");
      }
    }
  };
  // upload preselect csv
  const handleUploadCsv = async (efile) => {
    const data = students.map((s) => s.id);
    const nonExist = [];
    if (efile) {
      Papa.parse(efile, {
        skipEmptyLines: true,
        complete(results) {
          let valid = true;
          let exist = true;
          console.log(results.data);
          results.data.forEach((student) => {
            if (!/^(b|r|d)\d{8}$/i.test(student[0])) {
              valid = false;
            }
            if (!data.includes(student[0].toUpperCase())) {
              exist = false;
              nonExist.push(student);
            }
          });
          if (valid && exist) {
            const newData = results.data.reduce((obj, cur) => {
              return obj.concat([cur[0].toUpperCase()]);
            }, []);
            setPreselectData(newData);
            setPreselectLoaded(true);
            setPreselectFilename(efile.name);
            return;
          }
          if (!valid) {
            setAlert({
              open: true,
              severity: "error",
              msg: "Invalid student data format.",
            });
          }
          if (!exist) {
            setAlert({
              open: true,
              severity: "error",
              msg: `No student data: ${nonExist.join(", ")}`,
            });
          }
        },
      });
    }
  };
  const handlePreselectUpload = async () => {
    if (preselectLoaded) {
      try {
        await DistributeAPI.putPreselect(preselectData);
        setPreselectUploaded(true);
        setPreselectLoaded(false);
        setAlert({
          open: true,
          severity: "success",
          msg: "Upload preselect student data complete.",
        });
      } catch (err) {
        setAlert({
          open: true,
          severity: "error",
          msg: "Failed to upload preselect student data.",
        });
      }
    }
  };
  const handleResetPreselectUpload = () => {
    setPreselectLoaded(false);
    setPreselectUploaded(false);
    setPreselectData([]);
    setPreselectFilename("");
  };

  // get students data from backend
  const handleStudentDataReload = async () => {
    try {
      setStudents((await StudentDataAPI.getStudentData()).data);
    } catch (err) {
      setAlert({
        open: true,
        severity: "error",
        msg: "Failed to load student data.",
      });
    }
  };

  useEffect(() => {
    setCourse({ ...course, description: mdescription });
  }, [mdescription]);

  useEffect(() => {
    handleCoursesReload();
    handleStudentDataReload();
  }, []);

  useEffect(() => {
    setGrades([]);
  }, [newOption.priority_type]);

  useEffect(() => {
    if (grades.length > 0) {
      setNewOption({ ...newOption, priority_value: grades });
    }
  }, [grades]);

  return (
    <div>
      <Grid container spacing={3} direction="row">
        <Grid item sm={12}>
          <Button onClick={addCourse} variant="outlined" color="primary">
            Add Course
          </Button>
          <Button
            onClick={handleOpenAddMultiple}
            variant="outlined"
            color="primary"
            style={{ marginLeft: "10px" }}
          >
            Add csv for 數電實驗預選
          </Button>
          <Button
            onClick={handleOpenAddSingle}
            variant="outlined"
            color="primary"
            style={{ marginLeft: "10px" }}
          >
            Add single Preselect
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
            id="number"
            label="Limitation selected courses number"
            type="number"
            fullWidth
            value={course.number}
            error={errors.number}
            onChange={(e) => handleCourse(e, "number")}
          />

          <DialogContentText className={classes.optionsTitle}>
            Options
          </DialogContentText>
          <div className={classes.options}>
            {course.options.map((option, _index) => (
              <Chip
                key={option.name}
                label={
                  `${option.name} ; ${option.limit}人 ; ${
                    priorityData.find(
                      ({ id: ID }) => ID === option.priority_type
                    )?.text
                  } ; ${
                    option.priority_type === "preselect"
                      ? option.priority_value.length
                      : option.priority_value
                  }` ?? ""
                }
                variant="outlined"
                color={option === newOption ? "secondary" : "default"}
                onDelete={() => handleCourseDelOption(_index)}
                padding={1}
                onClick={() => handleEditOption(_index)}
              />
            ))}
          </div>
          <div className={classes.optionsAdd} style={{ marginTop: "3px" }}>
            <TextField
              placeholder="名字"
              value={newOption.name}
              error={errors.newOption}
              onChange={(e) => handleCourseOption(e, "name")}
              onKeyDown={(e) => {
                if (e.code === "Enter") {
                  !editOption
                    ? handleCourseAddOption()
                    : handleModifyOption(editOption - 1);
                }
              }}
            />
            <TextField
              placeholder="人數限制"
              value={newOption.limit}
              error={errors.newOption}
              style={{ width: "100px", marginLeft: "20px" }}
              onChange={(e) => handleCourseOption(e, "limit")}
            />
            <FormControl
              className={classes.formControl}
              style={{ marginLeft: "20px", marginTop: "-16px" }}
            >
              <InputLabel>優先年級</InputLabel>
              <Select
                value={newOption.priority_type}
                error={errors.newOption}
                onChange={(e) => handleCourseOption(e, "priority_type")}
                style={{ width: "100px" }}
              >
                {priorityData.map((priority_type) => {
                  if (priority_type.id !== "") {
                    return (
                      <MenuItem key={priority_type.id} value={priority_type.id}>
                        {priority_type.text}
                      </MenuItem>
                    );
                  }
                })}
              </Select>
            </FormControl>
            <AdditionalFormControl
              newOption={newOption}
              handleCourseOption={handleCourseOption}
              errors={errors}
              grades={grades}
              setGrades={setGrades}
              setNewOption={setNewOption}
            />
            {!editOption ? (
              <Button
                startIcon={<Add />}
                variant="outlined"
                size="small"
                onClick={handleCourseAddOption}
                style={{ marginLeft: "20px" }}
              >
                Add
              </Button>
            ) : (
              <Button
                startIcon={<Edit />}
                variant="outlined"
                size="small"
                onClick={() => handleModifyOption(editOption - 1)}
                style={{ marginLeft: "20px" }}
              >
                Modify
              </Button>
            )}
            {true ? (
              <Button
                startIcon={<Edit />}
                variant="outlined"
                size="small"
                onClick={handleOpenAddMultiple}
                style={{ marginLeft: "20px" }}
              >
                Add Preselection(csv)
              </Button>
            ) : (
              <></>
            )}
          </div>
          <DialogContentText
            className={classes.optionsTitle}
            style={{ marginTop: "10px" }}
          >
            Description(Markdown)
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

      <Dialog
        aria-labelledby="simple-dialog-title"
        disableBackdropClick
        open={addMultipleOpen}
        onClose={handleCloseAddMultiple}
      >
        {preselectUploaded ? (
          <DialogTitle id="simple-dialog-title">Upload Completed</DialogTitle>
        ) : (
          <DialogTitle id="simple-dialog-title">
            Add multiple students from csv file
          </DialogTitle>
        )}
        <DialogContent>
          <Typography>
            {preselectUploaded && preselectData.length
              ? "Current preselect data:"
              : ""}
          </Typography>
          {preselectUploaded
            ? preselectData.map((id) => <Typography key={id}>{id}</Typography>)
            : ""}
          <br />
          {preselectUploaded ? (
            ""
          ) : (
            <label htmlFor="contained-button-file">
              <input
                accept=".csv"
                className={classes.input}
                id="contained-button-file"
                type="file"
                style={{ display: "none" }}
                onChange={(e) => handleUploadCsv(e.target.files[0])}
              />
              <Button variant="outlined" color="primary" component="span">
                Select csv file
              </Button>
            </label>
          )}
          {preselectLoaded && !preselectUploaded ? ` ${preselectFilename}` : ""}
        </DialogContent>
        <DialogActions>
          {preselectUploaded ? (
            <>
              <Button
                className={classes.button}
                onClick={handleResetPreselectUpload}
              >
                Select Another File
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCloseAddMultiple}
              >
                Done
              </Button>
            </>
          ) : (
            <>
              <Button
                className={classes.button}
                onClick={handleCloseAddMultiple}
              >
                Cancel
              </Button>
              {preselectLoaded ? (
                <Button
                  onClick={handlePreselectUpload}
                  variant="contained"
                  color="primary"
                >
                  Upload
                </Button>
              ) : (
                <> </>
              )}
            </>
          )}
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

function AdditionalFormControl(props) {
  const { newOption, handleCourseOption, errors, grades, setGrades } = props;
  const handleGrades = (event) => {
    if (event.target.checked) {
      const gradeCopy = [...grades, event.target.value];
      gradeCopy.sort(function (a, b) {
        return a - b;
      });
      setGrades(gradeCopy);
    } else {
      setGrades(grades.filter((g) => g !== event.target.value));
    }
  };
  if (newOption !== undefined) {
    if (newOption.priority_type === "grades") {
      return (
        <span>
          <FormControlLabel
            control={<Checkbox />}
            value={1}
            label="大一"
            onChange={handleGrades}
            labelPlacement="top"
          />
          <FormControlLabel
            control={<Checkbox />}
            value={2}
            label="大二"
            onChange={handleGrades}
            labelPlacement="top"
          />
          <FormControlLabel
            control={<Checkbox />}
            value={3}
            label="大三"
            onChange={handleGrades}
            labelPlacement="top"
          />
          <FormControlLabel
            control={<Checkbox />}
            value={4}
            label="大四"
            onChange={handleGrades}
            labelPlacement="top"
          />
        </span>
      );
    }
    if (
      newOption.priority_type === "guarantee-third-grade" ||
      newOption.priority_type === "guarantee-fourth-grade"
    ) {
      return (
        <TextField
          placeholder="優先人數"
          defalut={0}
          type="number"
          value={newOption.priority_value}
          error={errors.newOption}
          style={{ width: "100px", marginLeft: "20px" }}
          onChange={(event) => handleCourseOption(event, "priority_value")}
        />
      );
    }

    return null;
  }
  return null;
}
