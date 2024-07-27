import { Button, MenuItem, Stack, TextField } from "@mui/material";
import { useState } from "react";
import axios from "axios";


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
        <TextField
          onChange={(e) => {
            setDate(e.target.value)
          }}
          fullWidth={true}
          id="outlined-basic"
          label="Date"
          variant="outlined"
        ></TextField>
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
      {/* </Card> */}
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

