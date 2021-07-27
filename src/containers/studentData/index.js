import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

import Input from "@material-ui/core/Input";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Hidden,
  Typography,
} from "@material-ui/core";

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

// function InputGrid({ type, newStudent, setNewStudent }) {
//   return (
//     <Input
//       value={newStudent[type]}
//       name={type}
//       placeholder={type}
//       onChange={(e) => {
//         setNewStudent({
//           ...newStudent,
//           [type]: e.target.value,
//         });
//       }}
//     />
//   );
// }

/**
 * This is Student Data Page
 */
export default function StudentData() {
  const classes = useStyles();

  const [data, setData] = React.useState([]);
  const [loaded, setLoaded] = React.useState(false);
  const [uploaded, setUploaded] = React.useState(false);
  const [addOpen, setAddOpen] = React.useState(false);
  const [addMultipleOpen, setAddMultipleOpen] = React.useState(false);
  const [csv, setCsv] = React.useState("");
  const [editId, setEditId] = React.useState("");
  const [selected, setSelected] = React.useState([]);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleteIds, setDeleteIds] = React.useState([]);
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

  useEffect(() => {
    // const courseData = fakeCourseData;
    StudentDataAPI.getStudentData()
      .then((res) => {
        setData(res.data);
      })
      .catch(() => {});
  }, []);

  // const handleTest = () => {
  //   console.log(data);
  // };

  const handleUploadCsv = async (efile) => {
    if (efile) {
      Papa.parse(efile, {
        skipEmptyLines: true,
        complete(results) {
          const newData = results.data.slice(1).reduce((obj, cur) => {
            return obj.concat([
              { id: cur[0], name: cur[1], grade: cur[2], authority: cur[3] },
            ]);
          }, []);
          setNewStudentMultiple(newData);
          // loaded should be completed
          setLoaded(true);
          console.log("Multiple student data loaded");
          console.log(newData);
        },
      });
    }
  };

  // const handleDownload = () => {
  //   console.log("to be complete");
  // };

  const handleOpenAddMultiple = () => {
    console.log("handleOpenAddMultiple");
    setUploaded(false);
    setAddMultipleOpen(true);
    setNewStudentMultiple({
      id: "",
      name: "",
      grade: "",
      authority: "",
    });
  };

  const handleCloseAddMultiple = () => {
    console.log("handleCloseAddMultiple");
    setAddMultipleOpen(false);
  };

  const handleOpenAdd = () => {
    console.log("handleOpenAdd");
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
    console.log("handleCloseAdd");
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
    console.log("handleOpenEdit");
    setEditId(id);
    console.log(id);
    const student = data.find((e) => e.id === id);
    setNewStudent({
      id: student.id,
      name: student.name,
      grade: student.grade,
      authority: student.authority,
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
    console.log("handleCloseEdit");
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

  const handleAddMultipleStudents = () => {
    console.log("handleAddMultipleStudents");
    if (loaded) {
      const newData = newStudentMultiple.map((student) => {
        const password = genPassword();
        return { ...student, password };
      });
      console.log("start post datas");
      StudentDataAPI.postStudentData(
        newData.map((student) => {
          return {
            userID: student.id,
            grade: Number(student.grade),
            password: student.password,
            name: student.name,
            authority: Number(student.authority),
          };
        })
      )
        .then(() => {
          console.log("finish post");
          setUploaded(true);
          setData(data.concat(newData));
          console.log(newData);
          console.log(data);

          setNewStudentMultiple({
            id: "",
            name: "",
            grade: "",
            authority: "",
          });
        })
        .then(() => {
          setCsv(Papa.unparse(newData));
        });
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
    console.log("download password");
    download("datas.csv", csv);
  };

  const handleDownload = () => {
    console.log(csv);
    download("datas.csv", csv);
  };

  const handleGeneratePassword = () => {
    console.log("generate password");
    const newData = data
      .filter((e) => selected.includes(e.id))
      .map((student) => {
        const password = genPassword();
        return { ...student, password };
      });
    console.log(`delete in regenerate: `);
    console.log(selected);
    StudentDataAPI.deleteStudentData(selected)
      .then(() => {
        console.log("delete student data finish in regenerate");
        StudentDataAPI.postStudentData(
          newData.map((student) => {
            return {
              userID: student.id,
              grade: Number(student.grade),
              password: student.password,
              name: student.name,
              authority: Number(student.authority),
            };
          })
        )
          .then(() => {
            console.log("post student data finish in regeneration");
            setData(
              data.filter((e) => !selected.includes(e.id)).concat(newData)
            );
          })
          .then(() => {
            setCsv(Papa.unparse(newData));
          })
          .catch(() => {});
      })
      .catch(() => {});
  };

  const judgeNewStudent = () => {
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

  const handleAddStudent = () => {
    const error = judgeNewStudent();

    if (!error) {
      const password = genPassword();
      setData(data.concat({ ...newStudent, password }));
      StudentDataAPI.postStudentData([
        {
          userID: newStudent.id,
          grade: Number(newStudent.grade),
          password,
          name: newStudent.name,
          authority: Number(newStudent.authority),
        },
      ])
        .then(() => {
          console.log("post student data finish new");
        })
        .catch(() => {});
      setNewStudent({
        id: "",
        name: "",
        grade: "",
        authority: "",
      });
      handleCloseAdd();
    }
  };

  const handleEditStudent = () => {
    const error = judgeNewStudent();
    if (!error) {
      const password = genPassword();
      setData(
        data.filter((e) => e.id !== editId).concat({ ...newStudent, password })
      );
      StudentDataAPI.deleteStudentData([editId])
        .then(() => {
          console.log("delete student data finish in edit");
          StudentDataAPI.postStudentData([
            {
              userID: newStudent.id,
              grade: Number(newStudent.grade),
              password,
              name: newStudent.name,
              authority: Number(newStudent.authority),
            },
          ])
            .then(() => {
              console.log("post student data finish in edit");
              console.log(`student id: ${newStudent.id}`);
              console.log(`password id: ${password}`);
            })
            .catch(() => {});
        })
        .catch(() => {});

      console.log({
        userID: newStudent.id,
        grade: Number(newStudent.grade),
        password,
        name: newStudent.name,
        authority: Number(newStudent.authority),
      });

      setNewStudent({
        id: "",
        name: "",
        grade: "",
        authority: "",
      });
      handleCloseAdd();
    }
  };

  const handleDeleteStudent = () => {
    setDeleteIds([]);
    StudentDataAPI.deleteStudentData(deleteIds)
      .then(() => {
        setDeleteOpen(false);
        setData(data.filter((student) => !deleteIds.includes(student.id)));
        console.log("delete student data finish : ");
        console.log(deleteIds);
        setSelected([]);
      })
      .catch(() => {});
  };

  return (
    <Container className={classes.root}>
      <Dialog
        aria-labelledby="simple-dialog-title"
        disableBackdropClick
        open={addOpen}
        onClose={handleCloseAdd}
      >
        <DialogTitle id="simple-dialog-title">Add Single Student</DialogTitle>
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
            deleteIds.map((id) => (
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
              <Button variant="contained" color="primary" component="span">
                Select csv file
              </Button>
            </label>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddMultiple}>Cancel</Button>
          {uploaded ? (
            <Button
              onClick={handleCloseAddMultiple}
              variant="contained"
              color="primary"
            >
              Finish
            </Button>
          ) : (
            <Button
              onClick={handleAddMultipleStudents}
              variant="contained"
              color="primary"
            >
              Upload
            </Button>
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
                variant="contained"
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
                onClick={handleGeneratePassword}
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
    </Container>
  );
}
