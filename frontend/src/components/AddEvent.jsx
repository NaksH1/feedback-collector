import { Alert, Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Snackbar, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";


function AddEvent({ open, setOpen, setEvents, handleClose, setEventAdded }) {
  const [name, setName] = useState('Bhava Spandana');
  const [date, setDate] = useState(dayjs());
  const [programCoordinator, setProgramCoordinator] = useState();
  const programName = [
    {
      value: 'Bhava Spandana',
      label: 'Bhava Spandana'
    },
    {
      value: 'Shoonya Intensive',
      label: 'Shoonya Intensive'
    },
    {
      value: 'Inner Engineering Retreat',
      label: 'Inner Engineering Retreat'
    }
  ];
  const [options, setOptions] = useState();

  useEffect(() => {
    axios({
      method: 'get',
      url: 'http://localhost:3000/admin/',
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    }).then(async (resp) => {
      setOptions(resp.data.admins);
      setProgramCoordinator(resp.data.admins[0]);
    })
  }, []);
  const handleSubmit = () => {
    axios({
      method: "post",
      url: "http://localhost:3000/event",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      data: {
        name: name,
        date: date,
        programCoordinator: programCoordinator._id
      }
    }).then((resp) => {
      handleClose();
      setEventAdded(true);
      setEvents((preEvent) => [...preEvent, resp.data.event]);
    })
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Enter Event Details</DialogTitle>
        <DialogContent>
          <Stack spacing={2} direction="column" alignItems="center" justifyContent="center" sx={{ width: 350 }}>
            <TextField
              onChange={(e) => {
                setName(e.target.value)
              }}
              select
              fullWidth={true}
              id="outlined-controlled"
              label="Name"
              variant="outlined">
              {programName.map((option) => {
                return <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              })}
            </TextField>
            <DatePicker
              fullWidth={true}
              onChange={(newValue) => (setDate(newValue))}
              label="Start Date"
              value={date}
              sx={{ width: 350 }}
              slotProps={{
                textField: {
                  helperText: 'Date format : MM/DD/YYYY',
                },
              }}
            ></DatePicker>
            <Autocomplete
              value={programCoordinator}
              onChange={(event, newValue) => {
                setProgramCoordinator(newValue);
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              id="controllable-states-demo"
              options={options}
              getOptionLabel={(option) => option.name}
              sx={{ width: 350 }}
              renderInput={(params) => <TextField {...params} label="Program Coordinator" />}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>

          <Button variant="outlined" onClick={handleSubmit}>Submit</Button>

        </DialogActions>
      </Dialog>
    </>
  )
}
export default AddEvent;
