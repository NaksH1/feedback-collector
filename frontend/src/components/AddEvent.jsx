import { Autocomplete, Button, MenuItem, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
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
  const [value, setValue] = useState();
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState();

  useEffect(() => {
    axios({
      method: 'get',
      url: 'http://localhost:3000/admin/',
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    }).then(async (resp) => {
      const newOptions = await resp.data.admins.map((admin) => {
        return ({
          name: admin.name,
          id: admin._id
        })
      })
      setOptions(newOptions);
      // setValue(newOptions[1])
    })
  }, []);

  // useEffect(() => {
  //   setValue(options[0]);
  // }, [options])

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
        <Autocomplete
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            setProgramCoordinator(value.id);
          }}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          id="controllable-states-demo"
          options={options}
          getOptionLabel={(option) => option.name}
          sx={{ width: 350 }}
          renderInput={(params) => <TextField {...params} label="Program Coordinator" />}
        />
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
