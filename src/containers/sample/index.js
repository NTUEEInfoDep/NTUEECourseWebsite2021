import React, { useState } from "react";
import { Typography, Button, Input, Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import { SampleAPI } from "../../api";
import SampleTable from "./SampleTable";
import UserTable from "./userTable";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

export default function Sample() {
  const [userData, setUserData] = useState(null);
  const [selectionData, setSelectionData] = useState([]);
  const [resultData, setResultData] = useState([]);
  const [value, setValue] = useState("");
  const [alert, setAlert] = useState({});

  const classes = useStyles();

  const handleSearch = () => {
    SampleAPI.getSample(value)
      .then((res) => {
        setUserData(res.data.userData);
        setSelectionData(res.data.selectionData);
        setResultData(res.data.results);
      })
      .catch(() => {
        setAlert({
          open: true,
          severity: "error",
          msg: "User not found",
        });
      });
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div className={classes.root}>
      <Input placeholder="StudentID" value={value} onChange={handleChange} />
      <Button variant="contained" color="primary" onClick={handleSearch}>
        Search
      </Button>
      {userData ? (
        <>
          <UserTable userData={userData} />
          <SampleTable selectionData={selectionData} resultData={resultData} />
        </>
      ) : (
        <></>
      )}

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
