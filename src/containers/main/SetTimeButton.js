import "date-fns";
import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import moment from "moment";
import Button from "@material-ui/core/Button";
import { DialogTitle, Dialog } from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import { OpentimeAPI } from "../../api";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker
} from "@material-ui/pickers";

export default function PickTime( {handleSetStart, handleSetEnd} ) {
  var moment = require("moment");
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleSave = async () => {
        if ((!end) || (!start)){
          alert('You should keyin both start and end time!')
          return
        }
          
        if ((start > end) && start && end){
            alert('Start should be before end!')
            return
        }
        try {  
          await OpentimeAPI.putOpentime(Math.round(start.valueOf()/1000),Math.round(end.valueOf()/1000))
          handleSetStart(Math.round(start.valueOf()/1000))
          handleSetEnd(Math.round(end.valueOf()/1000))
          setOpen(false);
        } catch (err) {
          console.error(err);
          alert(err)
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
        <DialogTitle
          id="dialog-title"
          style={{ marginBottom: "-10%", textAlign: "center" }}
        >
          Reset
        </DialogTitle>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid
            container
            direction="column"
            alignItems="center"
            style={{ padding: "0 6% 0 6%", margin: "auto" }}
          >
            <KeyboardDateTimePicker
              margin="normal"
              id="date-picker-dialog1"
              label="Start"
              format="MM/dd/yyyy hh:mm:ss a"
              value={start}
              onChange={(newTime) => {
                setStart(newTime);
              }}
              KeyboardButtonProps={{
                "aria-label": "change date"
              }}
            />
            <KeyboardDateTimePicker
              margin="normal"
              id="date-picker-dialog2"
              label="End"
              format="MM/dd/yyyy hh:mm:ss a"
              value={end}
              onChange={(newTime) => {
                setEnd(newTime);
              }}
              KeyboardButtonProps={{
                "aria-label": "change date"
              }}
            />
          </Grid>
        </MuiPickersUtilsProvider>
        <Grid container justifyContent="center" style={{ margin: "5% 0 3% 0" }}>
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
      </Dialog>
    </div>
  );
}