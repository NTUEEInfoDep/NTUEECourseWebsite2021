import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

import Grid from "@material-ui/core/Grid";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Hidden,
  Typography,
  Snackbar,
} from "@material-ui/core";

import { Alert } from "@material-ui/lab";

import Container from "@material-ui/core/Container";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import Papa from "papaparse";

import StudentTable from "./StudentTable";

import { StudentDataAPI } from "../../api";

const characters =
  "ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnpqrstuvwxyz123456789"; // no O, o, 0
const charactersLength = characters.length;
const passwordLength = 8;

const genPassword = () => {
  let result = "";
  for (let i = 0; i < passwordLength; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    maxWidth: "1000px",
    padding: "0px",
    "& > *": {
      margin: "auto",
    },
  },
  input: {
    display: "none",
  },
}));

/**
 * This is Student Data Page
 */
export default function StudentData() {
  const classes = useStyles();

  const [data, setData] = React.useState([]);
  const [loaded, setLoaded] = React.useState(false);
  const [filename, setFilename] = React.useState("");
  const [uploaded, setUploaded] = React.useState(false);
  const [addOpen, setAddOpen] = React.useState(false);
  const [addMultipleOpen, setAddMultipleOpen] = React.useState(false);
  const [csv, setCsv] = React.useState("");
  const [editId, setEditId] = React.useState("");
  const [selected, setSelected] = React.useState([]);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleteIds, setDeleteIds] = React.useState([]);
  const [regenerateOpen, setRegenerateOpen] = React.useState(false);
  const [invalidRegenerate, setInvalidRegenerate] = React.useState(false);
  const [alert, setAlert] = React.useState({});
  const [errors, setErrors] = React.useState({
    id: false,
    name: false,
    grade: false,
    authority: false,
  });
  const [errorsMsg, setErrorsMsg] = React.useState({
    id: "",
    name: "",
    grade: "",
    authority: "",
  });
  const [newStudentMultiple, setNewStudentMultiple] = React.useState({
    id: "",
    name: "",
    grade: "",
    authority: "",
  });
  const [newStudent, setNewStudent] = React.useState({
    id: "",
    name: "",
    grade: "",
    authority: "",
  });

  const showAlert = (severity, msg) => {
    setAlert({ open: true, severity, msg });
  };

  const handleStudentDataReload = async () => {
    try {
      setData((await StudentDataAPI.getStudentData()).data);
    } catch (err) {
      showAlert("error", "Failed to load student data.");
    }
  };

  useEffect(() => {
    handleStudentDataReload();
  }, []);

  const testRepeatId = (id) => {
    return data.map((e) => e.id.toLowerCase()).includes(id.toLowerCase());
  };

  const handleUploadCsv = async (efile) => {
    // console.log(efile);
    if (efile) {
      Papa.parse(efile, {
        skipEmptyLines: true,
        complete(results) {
          let valid = true;
          let repeat = false;
          results.data.slice(1).forEach((student) => {
            if (
              !/^(b|r|d)\d{8}$/i.test(student[0]) ||
              !student[1] ||
              !/^\d+$/.test(student[2])
            ) {
              valid = false;
              console.log(student);
            }
            if (testRepeatId(student[0])) {
              repeat = true;
              console.log(student);
            }
          });
          if (valid && !repeat) {
            const newData = results.data.slice(1).reduce((obj, cur) => {
              return obj.concat([
                {
                  id: cur[0],
                  name: cur[1],
                  grade: Number(cur[2]),
                  authority: 0,
                },
              ]);
            }, []);
            setNewStudentMultiple(newData);
            setLoaded(true);
            // console.log("Multiple student data loaded");
            // console.log(newData);
            setFilename(efile.name);
            return;
          }
          if (!valid && !repeat) {
            showAlert("error", "Invalid student data format.");
          }
          if (valid && repeat) {
            showAlert("error", "Student UserId repeat.");
          }
          if (!valid && repeat) {
            showAlert(
              "error",
              "Invalid student data format & Student UserId repeat."
            );
          }
          setNewStudentMultiple({
            id: "",
            name: "",
            grade: "",
            authority: "",
          });
          setLoaded(false);
          setFilename("");
        },
      });
    }
  };

  const handleOpenAddMultiple = () => {
    // console.log("handleOpenAddMultiple");
    setUploaded(false);
    setAddMultipleOpen(true);
    setNewStudentMultiple({
      id: "",
      name: "",
      grade: "",
      authority: "",
    });
    setLoaded(false);
    setFilename("");
  };

  const handleCloseAddMultiple = () => {
    // console.log("handleCloseAddMultiple");
    setAddMultipleOpen(false);
  };

  const handleOpenAdd = () => {
    // console.log("handleOpenAdd");
    setNewStudent({
      id: "",
      name: "",
      grade: "",
      authority: "",
    });
    setErrors({
      id: false,
      name: false,
      grade: false,
      authority: false,
    });
    setErrorsMsg({
      id: "",
      name: "",
      grade: "",
      authority: "",
    });
    setAddOpen(true);
  };

  const handleCloseAdd = () => {
    // console.log("handleCloseAdd");
    setNewStudent({
      id: "",
      name: "",
      grade: "",
      authority: "",
    });
    setErrors({
      id: false,
      name: false,
      grade: false,
      authority: false,
    });
    setErrorsMsg({
      id: "",
      name: "",
      grade: "",
      authority: "",
    });
    setAddOpen(false);
  };

  const handleOpenEdit = (id) => {
    // console.log("handleOpenEdit");
    setEditId(id);
    // console.log(id);
    const student = data.find((e) => e.id === id);
    setNewStudent({
      id: student.id,
      name: student.name,
      grade: String(student.grade),
      authority: String(student.authority),
    });
    setErrors({
      id: false,
      name: false,
      grade: false,
      authority: false,
    });
    setErrorsMsg({
      id: "",
      name: "",
      grade: "",
      authority: "",
    });
    setAddOpen(true);
  };

  const handleCloseEdit = () => {
    // console.log("handleCloseEdit");
    setEditId("");
    setNewStudent({
      id: "",
      name: "",
      grade: "",
      authority: "",
    });
    setErrors({
      id: false,
      name: false,
      grade: false,
      authority: false,
    });
    setErrorsMsg({
      id: "",
      name: "",
      grade: "",
      authority: "",
    });
    setAddOpen(false);
  };

  const handleOpenDelete = (ids) => {
    setDeleteIds(ids);
    setDeleteOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteOpen(false);
  };

  const handleOpenRegenerate = () => {
    if (
      data
        .filter((e) => selected.includes(e.id))
        .filter((e) => e.authority === 2).length !== 0
    ) {
      setInvalidRegenerate(true);
    } else {
      setInvalidRegenerate(false);
    }
    setRegenerateOpen(true);
  };

  const handleCloseRegenerate = () => {
    setRegenerateOpen(false);
  };

  const onIdChange = (e) => {
    setNewStudent({
      ...newStudent,
      id: e.target.value,
    });
  };

  const onNameChange = (e) => {
    setNewStudent({
      ...newStudent,
      name: e.target.value,
    });
  };

  const onGradeChange = (e) => {
    setNewStudent({
      ...newStudent,
      grade: e.target.value,
    });
  };

  const onAuthorityChange = (e) => {
    setNewStudent({
      ...newStudent,
      authority: e.target.value,
    });
  };

  const handleAddMultipleStudents = async () => {
    // console.log("handleAddMultipleStudents");
    if (loaded) {
      const newData = newStudentMultiple.map((student) => {
        const password = genPassword();
        return { ...student, password };
      });
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

        setCsv(Papa.unparse(newData));
        showAlert("success", "Add multiple student data complete.");
      } catch (err) {
        showAlert("error", "Failed to Add multiple student data.");
      }
    }
  };

  const download = (filename, text) => {
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`
    );
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };

  const handleDownloadPassword = () => {
    // console.log("download password");
    download("datas.csv", csv);
  };

  const handleDownload = () => {
    // console.log(csv);
    download("datas.csv", csv);
  };

  const handleGeneratePassword = async () => {
    // console.log("generate password");
    const newData = data
      .filter((e) => selected.includes(e.id))
      .map((student) => {
        const password = genPassword();
        return { ...student, password };
      });
    // console.log(`delete in regenerate: `);
    // console.log(selected);
    try {
      await StudentDataAPI.deleteStudentData(selected);
    } catch (err) {
      showAlert("error", "Failed to Delete student data in generate password.");
      handleCloseRegenerate();
      return;
    }
    // console.log("delete student data finish in regenerate");
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
    } catch (err) {
      showAlert("error", "Failed to Post student data when generate password.");
      handleCloseRegenerate();
      return;
    }
    showAlert("success", "Generate password complete.");
    // console.log("post student data finish in regeneration");
    setData(data.filter((e) => !selected.includes(e.id)).concat(newData));
    setCsv(Papa.unparse(newData));
    handleCloseRegenerate();
    setSelected([]);
  };

  const judgeNewStudent = () => {
    // console.log(newStudent);
    let error = false;
    let newErrors = errors;
    let newErrorsMsg = errorsMsg;
    if (!newStudent.id) {
      newErrors = { ...newErrors, id: true };
      newErrorsMsg = { ...newErrorsMsg, id: "id should not be empty" };
      error = true;
    } else if (!/^(b|r|d)\d{8}$/i.test(newStudent.id)) {
      newErrors = { ...newErrors, id: true };
      newErrorsMsg = { ...newErrorsMsg, id: "id invalid format" };
      error = true;
    } else if (testRepeatId(newStudent.id)) {
      newErrors = { ...newErrors, id: true };
      newErrorsMsg = { ...newErrorsMsg, id: "repeat userId" };
      error = true;
    } else {
      newErrors = { ...newErrors, id: false };
      newErrorsMsg = { ...newErrorsMsg, id: "" };
    }
    if (!newStudent.name) {
      newErrors = { ...newErrors, name: true };
      newErrorsMsg = { ...newErrorsMsg, name: "name should not be empty" };
      error = true;
    } else {
      newErrors = { ...newErrors, name: false };
      newErrorsMsg = { ...newErrorsMsg, name: "" };
    }
    if (!newStudent.grade) {
      newErrors = { ...newErrors, grade: true };
      newErrorsMsg = { ...newErrorsMsg, grade: "grade should not be empty" };
      error = true;
    } else if (!/^\d+$/.test(newStudent.grade)) {
      newErrors = { ...newErrors, grade: true };
      newErrorsMsg = { ...newErrorsMsg, grade: "grade should be a number" };
      error = true;
    } else {
      newErrors = { ...newErrors, grade: false };
      newErrorsMsg = { ...newErrorsMsg, grade: "" };
    }
    if (!newStudent.authority) {
      newErrors = { ...newErrors, authority: true };
      newErrorsMsg = {
        ...newErrorsMsg,
        authority: "authority should not be empty",
      };
      error = true;
    } else if (!/^[012]$/.test(newStudent.authority)) {
      newErrors = { ...newErrors, authority: true };
      newErrorsMsg = {
        ...newErrorsMsg,
        authority: "authority should be a 0, 1 or 2",
      };
      error = true;
    } else {
      newErrors = { ...newErrors, authority: false };
      newErrorsMsg = { ...newErrorsMsg, authority: "" };
    }
    setErrors(newErrors);
    setErrorsMsg(newErrorsMsg);
    return error;
  };

  const handleAddStudent = async () => {
    const error = judgeNewStudent();

    if (!error) {
      const password = genPassword();
      try {
        await StudentDataAPI.postStudentData([
          {
            userID: newStudent.id,
            grade: Number(newStudent.grade),
            password,
            name: newStudent.name,
            authority: Number(newStudent.authority),
          },
        ]);
        setData(data.concat({ ...newStudent, password }));
        setNewStudent({
          id: "",
          name: "",
          grade: "",
          authority: "",
        });
        handleCloseAdd();
        showAlert("success", "Add student data success.");
      } catch {
        handleCloseAdd();
        showAlert("error", "Failed to Add student data.");
      }
    }
  };

  const handleEditStudent = async () => {
    const error = judgeNewStudent();
    if (!error) {
      const password = genPassword();
      try {
        StudentDataAPI.deleteStudentData([editId]);
      } catch (err) {
        showAlert("error", "Failed to Delete student data in Edit.");
        handleCloseAdd();
        return;
      }
      // console.log("delete student data finish in edit");

      try {
        await StudentDataAPI.postStudentData([
          {
            userID: newStudent.id,
            grade: Number(newStudent.grade),
            password,
            name: newStudent.name,
            authority: Number(newStudent.authority),
          },
        ]);
        // console.log("post student data finish in edit");
        // console.log(`student id: ${newStudent.id}`);
        // console.log(`password id: ${password}`);
        setData(
          data
            .filter((e) => e.id !== editId)
            .concat({ ...newStudent, password })
        );
        // console.log({
        //  userID: newStudent.id,
        //  grade: Number(newStudent.grade),
        //  password,
        //  name: newStudent.name,
        //  authority: Number(newStudent.authority),
        // });

        setNewStudent({
          id: "",
          name: "",
          grade: "",
          authority: "",
        });
        handleCloseAdd();
        showAlert("success", "Edit student data success.");
      } catch (err) {
        showAlert("error", "Failed to post student data in Edit.");
        handleCloseAdd();
      }
    }
  };

  const handleDeleteStudent = async () => {
    try {
      await StudentDataAPI.deleteStudentData(deleteIds);
      setData(data.filter((student) => !deleteIds.includes(student.id)));
      // console.log("delete student data finish : ");
      // console.log(deleteIds);
      setDeleteIds([]);
      setSelected([]);
      handleCloseDelete();
      showAlert("success", "delete student data success.");
    } catch (err) {
      showAlert("error", "Failed to delete student data.");
      handleCloseDelete();
    }
  };

  return (
    <Container className={classes.root}>
      <Dialog
        aria-labelledby="simple-dialog-title"
        disableBackdropClick
        open={addOpen}
        onClose={handleCloseAdd}
      >
        {editId === "" ? (
          <DialogTitle id="simple-dialog-title">Add Single Student</DialogTitle>
        ) : (
          <DialogTitle id="simple-dialog-title">
            Edit Single Student
          </DialogTitle>
        )}
        <DialogContent>
          <TextField
            id="userID"
            label="userID"
            type="text"
            fullWidth
            value={newStudent.id}
            error={errors.id}
            onChange={onIdChange}
            helperText={errorsMsg.id}
          />
          <TextField
            id="name"
            label="name"
            type="text"
            fullWidth
            value={newStudent.name}
            error={errors.name}
            onChange={onNameChange}
            helperText={errorsMsg.name}
          />
          <TextField
            id="grade"
            label="grade"
            type="text"
            fullWidth
            value={newStudent.grade}
            error={errors.grade}
            onChange={onGradeChange}
            helperText={errorsMsg.grade}
          />
          <TextField
            id="authority"
            label="authority"
            type="text"
            fullWidth
            value={newStudent.authority}
            error={errors.authority}
            onChange={onAuthorityChange}
            helperText={errorsMsg.authority}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={editId === "" ? handleCloseAdd : handleCloseEdit}>
            Cancel
          </Button>
          <Button
            onClick={editId === "" ? handleAddStudent : handleEditStudent}
            variant="contained"
            color="primary"
          >
            {editId === "" ? "Add" : "Edit"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        aria-labelledby="simple-dialog-title"
        disableBackdropClick
        open={deleteOpen}
        onClose={handleCloseDelete}
      >
        <DialogTitle id="simple-dialog-title">
          Are you sure to delete {deleteIds.length} students?
        </DialogTitle>
        <DialogContent>
          {deleteOpen ? (
            data
              .filter((e) => deleteIds.includes(e.id))
              .map((e) => e.id)
              .map((id) => (
                <Typography key={id}>
                  {`id: ${data.find((e) => e.id === id).id}, 
              name: ${data.find((e) => e.id === id).name},
              grade: ${data.find((e) => e.id === id).grade},
              authority: ${data.find((e) => e.id === id).authority}`}
                </Typography>
              ))
          ) : (
            <></>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancel</Button>
          <Button
            onClick={handleDeleteStudent}
            variant="contained"
            color="primary"
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
        {uploaded ? (
          <DialogTitle id="simple-dialog-title">Upload Completed</DialogTitle>
        ) : (
          <DialogTitle id="simple-dialog-title">
            Add multiple students from csv file
          </DialogTitle>
        )}
        <DialogContent>
          {uploaded ? (
            <Button
              variant="contained"
              color="primary"
              component="span"
              onClick={handleDownload}
            >
              Download password
            </Button>
          ) : (
            <label htmlFor="contained-button-file">
              <input
                accept=".csv"
                className={classes.input}
                id="contained-button-file"
                type="file"
                onChange={(e) => handleUploadCsv(e.target.files[0])}
              />
              <Button variant="outlined" color="primary" component="span">
                Select csv file
              </Button>
            </label>
          )}
          {loaded && !uploaded ? filename : ""}
        </DialogContent>
        <DialogActions>
          {uploaded ? (
            <Button
              onClick={handleCloseAddMultiple}
              variant="contained"
              color="primary"
            >
              Finish
            </Button>
          ) : (
            <>
              <Button onClick={handleCloseAddMultiple}>Cancel</Button>
              {loaded ? (
                <Button
                  onClick={handleAddMultipleStudents}
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
      <Dialog
        aria-labelledby="simple-dialog-title"
        disableBackdropClick
        open={regenerateOpen}
        onClose={handleCloseRegenerate}
      >
        {invalidRegenerate ? (
          <DialogTitle id="simple-dialog-title">
            These student are invalid to regenerate password?
          </DialogTitle>
        ) : (
          <DialogTitle id="simple-dialog-title">
            Are you sure to Regenerate password of {selected.length} students?
          </DialogTitle>
        )}
        <DialogContent>
          {invalidRegenerate
            ? data
                .filter((e) => selected.includes(e.id))
                .filter((e) => e.authority === 2)
                .map((e) => (
                  <Typography key={e.id}>
                    {`id: ${e.id}, 
              name: ${e.name},
              grade: ${e.grade},
              authority: ${e.authority}`}
                  </Typography>
                ))
            : data
                .filter((e) => selected.includes(e.id))
                .map((e) => e.id)
                .map((id) => (
                  <Typography key={id}>
                    {`id: ${data.find((e) => e.id === id).id}, 
              name: ${data.find((e) => e.id === id).name},
              grade: ${data.find((e) => e.id === id).grade},
              authority: ${data.find((e) => e.id === id).authority}`}
                  </Typography>
                ))}
        </DialogContent>
        <DialogActions>
          {invalidRegenerate ? (
            <Button
              onClick={handleCloseRegenerate}
              variant="contained"
              color="primary"
            >
              Close
            </Button>
          ) : (
            <>
              <Button onClick={handleCloseRegenerate}>Cancel</Button>
              <Button
                onClick={handleGeneratePassword}
                variant="contained"
                color="primary"
              >
                Regenerate
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
      <Grid
        container
        spacing={1}
        justify="center"
        alignItems="flex-start"
        direction="row"
      >
        <Grid item sm={12}>
          <Grid
            container
            spacing={1}
            justify="flex-start"
            alignItems="flex-start"
            direction="row"
          >
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenAdd}
              >
                Add Single Student
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenAddMultiple}
              >
                Add Multiple Students
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleDownloadPassword}
                disabled={csv === ""}
              >
                Download Password
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenRegenerate}
                disabled={selected.length === 0}
              >
                Generate Password
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item sm={12}>
          <StudentTable
            data={data}
            handleEdit={handleOpenEdit}
            handleDelete={handleOpenDelete}
            selected={selected}
            setSelected={setSelected}
          />
        </Grid>
        {/* <Hidden smDown>
          <Grid item md={3} />
        </Hidden> */}
      </Grid>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={alert?.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert variant="filled" severity={alert?.severity}>
          {alert?.msg}
        </Alert>
      </Snackbar>
    </Container>
  );
}
