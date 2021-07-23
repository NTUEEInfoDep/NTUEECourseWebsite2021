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
  const [addOpen, setAddOpen] = React.useState(false);
  const [editId, setEditId] = React.useState("");
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

  // const handleUpload = async (efile) => {
  //   if (efile) {
  //     Papa.parse(efile, {
  //       skipEmptyLines: true,
  //       complete(results) {
  //         const newData = results.data.reduce((obj, cur) => {
  //           return obj.concat([
  //             { id: cur[0], name: cur[1], grade: cur[2], authority: cur[3] },
  //           ]);
  //         }, []);
  //         setData(data.concat(newData));
  //         setLoaded(true);
  //       },
  //     });
  //   }
  // };

  // const handleDownload = () => {
  //   console.log("to be complete");
  // };

  const handleOpenAdd = () => {
    console.log("handleOpenAdd");
    setNewStudent({
      id: "",
      name: "",
      grade: "",
      authority: "",
    });
    setErrors({
      id: true,
      name: true,
      grade: true,
      authority: true,
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
    if (!e.target.value.length) {
      setErrors({ ...errors, id: true });
      setErrorsMsg({ ...errors, id: "id should not be empty" });
    } else {
      setErrors({ ...errors, id: false });
      setErrorsMsg({ ...errors, id: "" });
    }
  };

  const onNameChange = (e) => {
    setNewStudent({
      ...newStudent,
      name: e.target.value,
    });
    if (!e.target.value.length) {
      setErrors({ ...errors, name: true });
      setErrorsMsg({ ...errors, name: "name should not be empty" });
    } else {
      setErrors({ ...errors, name: false });
      setErrorsMsg({ ...errors, name: "" });
    }
  };

  const onGradeChange = (e) => {
    setNewStudent({
      ...newStudent,
      grade: e.target.value,
    });
    if (!e.target.value.length) {
      setErrors({ ...errors, grade: true });
      setErrorsMsg({ ...errors, grade: "grade should not be empty" });
    } else if (!/^\d+$/.test(e.target.value)) {
      setErrors({ ...errors, grade: true });
      setErrorsMsg({ ...errors, grade: "grade should be a number" });
    } else {
      setErrors({ ...errors, grade: false });
      setErrorsMsg({ ...errors, grade: "" });
    }
  };

  const onAuthorityChange = (e) => {
    setNewStudent({
      ...newStudent,
      authority: e.target.value,
    });
    if (!e.target.value.length) {
      setErrors({ ...errors, authority: true });
      setErrorsMsg({ ...errors, authority: "authority should not be empty" });
    } else if (!/^[012]$/.test(e.target.value)) {
      setErrors({ ...errors, authority: true });
      setErrorsMsg({ ...errors, authority: "authority should be a 0, 1 or 2" });
    } else {
      setErrors({ ...errors, authority: false });
      setErrorsMsg({ ...errors, authority: "" });
    }
    console.log(newStudent);
  };

  const handleAddStudent = () => {
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
  };

  const handleEditStudent = () => {
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
  };

  const handleDeleteStudent = () => {
    console.log(deleteIds);
    StudentDataAPI.deleteStudentData(deleteIds)
      .then(() => {
        setData(data.filter((student) => !deleteIds.includes(student.id)));
        console.log("delete student data finish : ");
        console.log(deleteIds);
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
            disabled={errors.id || errors.name || errors.grade}
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
          {deleteIds.map((id) => (
            <Typography key={id}>
              {`id: ${data.find((e) => e.id === id).id}, 
              name: ${data.find((e) => e.id === id).name},
              grade: ${data.find((e) => e.id === id).grade},
              authority: ${data.find((e) => e.id === id).authority}`}
            </Typography>
          ))}
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
      <Grid
        container
        spacing={1}
        justify="center"
        alignItems="flex-start"
        direction="row"
      >
        {/* <Grid item sm={12} md={3}>
          <Grid
            container
            spacing={2}
            justify="flex-start"
            alignItems="flex-start"
            direction="column"
          >
            <Grid item>
              <label htmlFor="contained-button-file">
                <input
                  accept=".csv"
                  className={classes.input}
                  id="contained-button-file"
                  type="file"
                  onChange={(e) => handleUpload(e.target.files[0])}
                />
                <Button variant="contained" color="primary" component="span">
                  Select csv file
                </Button>
              </label>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleDownload()}
                startIcon={<CloudDownloadIcon />}
              >
                Download csv
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                component="span"
                onClick={() => handleTest()}
              >
                Test
              </Button>
            </Grid>
          </Grid>
        </Grid> */}
        {/* <Grid item sm={12} md={9}> */}
        <Grid item sm={12}>
          <StudentTable
            data={data}
            handleEdit={handleOpenEdit}
            handleDelete={handleOpenDelete}
          />
        </Grid>
        {/* <Hidden smDown>
          <Grid item md={3} />
        </Hidden> */}
        <Grid item sm={12} md={9}>
          {/* <Typography variant="h6">Add Single Student</Typography> */}
          <Grid
            container
            spacing={1}
            justify="flex-start"
            alignItems="flex-start"
            direction="row"
          >
            {/* ["id", "name", "grade"].map((e) => (
              <Grid item key={e}>
                <InputGrid
                  type={e}
                  newStudent={newStudent}
                  setNewStudent={setNewStudent}
                />
              </Grid>
            )) */}

            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenAdd}
              >
                Add Single Student
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
