import { Button, MenuItem, Stack, TextField } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { DatePicker } from "@mui/x-date-pickers";


function AddEvent({ name, setName, date, setDate, programCoordinator, setProgramCoordinator }) {
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

  // const dateNow = new Date();
  // const year = dateNow.getFullYear();
  // const monthWithOffset = (dateNow.getUTCMonth() + 1).toString();
  // const month = monthWithOffset.length < 2 ? `0${monthWithOffset}` : monthWithOffset;
  // const date1 = dateNow.getUTCDate().toString().length < 2 ? `0${dateNow.getUtcDate()}` : dateNow.getUTCDate();
  // const defaultDate = `${year}-${month}-${date1}`;

  return (
    <>
      {/* <Card variant="outlined" style={{ width: 400, padding: 20 }}> */}
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
        <TextField
          onChange={(e) => {
            setProgramCoordinator(e.target.value)
          }}
          fullWidth={true}
          id="outlined-basic"
          label="Program Coordinator"
          variant="outlined"
        ></TextField>
      </Stack>
    </>
  )
}
export function postEvent(name, date, programCoordinator) {
  return axios({
    method: "post",
    url: "http://localhost:3000/event",
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    },
    data: {
      name: name,
      date: date,
      programCoordinator: programCoordinator
    }
  });
}
export default AddEvent;

