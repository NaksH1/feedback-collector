import { Button, Card, MenuItem, Stack, TextField } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";

function UpdateCard(prop) {
  const [name, setName] = useState('');
  const [date, setDate] = useState(dayjs());
  const [programCoordinator, setProgramCoordinator] = useState('');
  useEffect(() => {
    setName(prop.event.name);
    setDate(dayjs(prop.event.date));
    setProgramCoordinator(prop.event.programCoordinator);
  }, [prop.event]);

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

  function updateEvent(event) {
    event.preventDefault();
    prop.setEvent(preEvent => ({
      ...preEvent,
      name: name,
      date: date,
      programCoordinator: programCoordinator
    }));
    axios({
      method: "put",
      url: 'http://localhost:3000/event/' + prop.event._id,
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      data: {
        name: name,
        date: date,
        programCoordinator: programCoordinator
      }
    }).then((res) => {
      console.log(res.data)
    });
  }

  return (
    <>
      {/* <Card variant="outlined" alignItems="center" justifyContent="center" sx={{ width: 200, padding: 20 }} > */}
      <Stack spacing={2} direction="column" alignItems="center" justifyContent="center" sx={{ marginTop: 12, marginLeft: 20, width: 350 }}>
        <TextField
          onChange={(e) => {
            setName(e.target.value)
          }}
          fullWidth={true}
          select
          id="outlined-basic"
          label="Name"
          variant="outlined"
          value={name}
        >
          {programName.map((option) => {
            return (<MenuItem key={option.label} value={option.value}>
              {option.label}
            </MenuItem>
            )
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
          value={programCoordinator}
        ></TextField>
        <Button variant="outlined" onClick={updateEvent}>Update</Button>
      </Stack>
      {/* </Card> */}
    </>
  )
}

export default UpdateCard;
