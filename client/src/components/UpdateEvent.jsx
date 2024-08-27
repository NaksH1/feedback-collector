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
  const [programName, setProgramName] = useState([])
  useEffect(() => {
    axios({
      method: 'get',
      url: `${process.env.REACT_APP_BACKEND_URL}/event/eventlist`,
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    }).then((resp) => {
      if (programName.length < 14) {
        for (const event of resp.data.eventList) {
          programName.push({
            value: event,
            label: event
          })
        }
      }
    });
  }, [event]);

  useEffect(() => {
    if (event) {
      setName(event.name);
      setDate(dayjs(event.date));
      setProgramCoordinator(event.programCoordinator || null);
    }
    axios({
      method: 'get',
      url: `${process.env.REACT_APP_BACKEND_URL}/admin/`,
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
      url: `${process.env.REACT_APP_BACKEND_URL}/event/${event._id}`,
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
    <Stack spacing={2} direction="column" alignItems="center" justifyContent="center" sx={{ width: 350, marginTop: '4vh', marginLeft: '4vw' }}>
      <TextField
        value={name}
        onChange={(e) => { setName(e.target.value) }}
        select
        fullWidth
        id="outlined-controlled"
        label="Name"
        variant="outlined"
        SelectProps={{
          MenuProps: {
            PaperProps: {
              style: { maxHeight: '20vh', overflowY: 'auto' }
            }
          }
        }}
      >
        {programName?.map((option) => {
          return <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        })}
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
