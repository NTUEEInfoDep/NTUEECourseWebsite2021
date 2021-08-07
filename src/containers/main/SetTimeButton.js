import "date-fns";
import React, { useState } from "react";
import { alpha } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import moment from "moment";
import Button from "@material-ui/core/Button";
import { DialogTitle, Dialog } from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
import { OpentimeAPI } from "../../api";
import MomentUtils from "@date-io/moment";
import TextField from "@material-ui/core/TextField";

export default function PickTime(handleSetStart, handleSetEnd) {
  var moment = require("moment");
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleSave = async () => {
        setOpen(false);
        if ((!start) && (!end)) {
            return
        }
        try {  
          await OpentimeAPI.putOpentime(Math.round(start.valueOf()/1000),Math.round(end.valueOf()/1000))
          handleSetStart(Math.round(start.valueOf()/1000))
          handleSetEnd(Math.round(end.valueOf()/1000))
          console.log('start', start.valueOf())
        } catch (err) {
          console.error(err);
        }
      }  
    
    
  const handleClickOpen = () => {
    setOpen(true);
  };
  return (
    <div>
      <Button onClick={handleClickOpen} variant="outlined" color="primary">
       Set Time
      </Button>
      <Dialog
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
      >
        <MuiPickersUtilsProvider libInstance={moment} utils={DateFnsUtils}>
          <Grid container justifyContent="center" alignItems="center">
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <DialogTitle id="dialog-title" style={{ marginBottom: "-2%" }}>
                Reset
              </DialogTitle>
              <Grid container justifyContent="center" direction="column">
                <div
                  style={{
                    paddingLeft: "10%",
                    fontSize: "20px",
                    opacity: ".9",
                    textDecoration: "dotted 3px underline #E5C1C4",
                    // paddingBottom: "3%"
                  }}
                >
                  Start
                </div>
                <DateTimePicker
                  style={{
                    padding: "5%",
                    marginTop: "-2%"
                  }}
                  value={start}
                  onChange={(newTime)=>{
                      setStart(newTime)
                  }}
                  // renderInput={(props) => <TextField {...props} />}
                />
              </Grid>
              <Grid container direction="column">
                <div
                  style={{
                    paddingLeft: "10%",
                    paddingTop: "2%",
                    fontSize: "20px",
                    opacity: ".9",
                    textDecoration: "dotted 3px underline #E5C1C4",
                  }}
                >
                  End
                </div>
                <DateTimePicker
                  style={{
                    padding: "5%"
                  }}
                  value={end}
                  onChange={(newTime)=>{
                      setEnd(newTime)
                  }}
                  // renderInput={(props) => <TextField {...props} />}
                />
              </Grid>
            </Grid>
            <br />
            <br />
            <Grid container justifyContent="center" style={{ margin: "3% 0" }}>
              <Button
                style={{ padding: "5px", margin: "auto" }}
                onClick={handleClose}
                color="primary"
              >
                Cancel
              </Button>
              <Button
                style={{ padding: "5px", margin: "auto" }}
                onClick={handleSave}
                color="primary"
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </MuiPickersUtilsProvider>
      </Dialog>
    </div>
  );
}