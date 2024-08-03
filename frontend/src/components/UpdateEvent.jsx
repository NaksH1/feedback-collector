import { Autocomplete, Button, MenuItem, Stack, TextField } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import { useLocation } from "react-router-dom";

function UpdateCard({ event, setEvent }) {
  const [name, setName] = useState('');
  const [date, setDate] = useState(dayjs());
  const [programCoordinator, setProgramCoordinator] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (event) {
      setName(event.name);
      setDate(dayjs(event.date));
      setProgramCoordinator(event.programCoordinator || null);
    }
  }, [event]);

  useEffect(() => {
    axios({
      method: 'get',
      url: 'http://localhost:3000/admin/',
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    }).then((resp) => {
      const newOptions = resp.data.admins.map((admin) => ({
        name: admin.name,
        id: admin._id
      }));
      setOptions(newOptions);
      if (event && event.programCoordinator) {
        setProgramCoordinator(newOptions.find((option) => option.id === event.programCoordinator._id));
      }
    });
  }, [event]);

  const programNames = [
    { value: 'Bhava Spandana', label: 'Bhava Spandana' },
    { value: 'Shoonya Intensive', label: 'Shoonya Intensive' },
    { value: 'Inner Engineering Retreat', label: 'Inner Engineering Retreat' }
  ];

  const updateEvent = (e) => {
    e.preventDefault();
    const updatedEvent = {
      ...event,
      name,
      date,
      programCoordinator
    };
    setEvent(updatedEvent);
    axios({
      method: "put",
      url: `http://localhost:3000/event/${event._id}`,
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      data: updatedEvent
    }).then((res) => {
      window.location.reload();
      console.log(res.data);
    });
  };

  return (
    <Stack spacing={2} direction="column" alignItems="center" justifyContent="center" sx={{ marginTop: 12, marginLeft: 20, width: 350 }}>
      <TextField
        onChange={(e) => setName(e.target.value)}
        fullWidth
        select
        label="Name"
        variant="outlined"
        value={name}
      >
        {programNames.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <DatePicker
        fullWidth
        onChange={setDate}
        label="Start Date"
        value={date}
        sx={{ width: 350 }}
        slotProps={{ textField: { helperText: 'Date format: MM/DD/YYYY' } }}
      />
      <Autocomplete
        value={programCoordinator}
        onChange={(event, newValue) => setProgramCoordinator(newValue)}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
        id="controllable-states-demo"
        options={options}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        sx={{ width: 350 }}
        renderInput={(params) => <TextField {...params} label="Program Coordinator" />}
      />
      <Button variant="outlined" onClick={updateEvent}>Update</Button>
    </Stack>
  );
}

export default UpdateCard;
