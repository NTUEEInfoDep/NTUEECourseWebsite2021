import React, { useState } from "react";
import { Button, Input, Snackbar, Stack } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import { SampleAPI } from "../../api";
import SampleTable from "./SampleTable";
import UserTable from "./userTable";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

export default function Sample() {
  const [userData, setUserData] = useState(null);
  const [selectionData, setSelectionData] = useState([]);
  const [resultData, setResultData] = useState({});
  const [id2Name, setId2Name] = useState({});
  const [preselects, setPreselects] = useState({});
  const [value, setValue] = useState("");
  const [alert, setAlert] = useState({});

  const classes = useStyles();

  const handleSearch = () => {
    SampleAPI.getSample(value)
      .then((res) => {
        setUserData(res.data.userData);
        setSelectionData(res.data.selectionData);
        setResultData(res.data.results);
        setId2Name(res.data.coursesId2Name);
        setPreselects(res.data.preselects);
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
    <div>
      <div className={classes.root}>
        <Input placeholder="StudentID" value={value} onChange={handleChange} />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>
      </div>
      {userData ? (
        <>
          <UserTable userData={userData} />
          <SampleTable
            selectionData={selectionData}
            resultData={resultData}
            id2Name={id2Name}
            preselects={preselects}
          />
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
