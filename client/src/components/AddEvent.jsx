import { Alert, Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Snackbar, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import CloseIcon from '@mui/icons-material/Close';

function AddEvent({ open, setOpen, setEvents, handleClose, setEventAdded, filterEvents, selectedYear, selectedWeek }) {
  const [name, setName] = useState('Bhava Spandana');
  const [nameIfOther, setNameIfOther] = useState('');
  const [date, setDate] = useState(dayjs());
  const [programCoordinator, setProgramCoordinator] = useState();
  const [eventList, setEventList] = useState();
  const [programName, setProgramName] = useState([]);
  const [options, setOptions] = useState();

  useEffect(() => {
    axios({
      method: 'get',
      url: `${import.meta.env.VITE_BACKEND_URL}/event/eventlist`,
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    }).then((resp) => {
      setEventList(resp.data.eventList);
      if (programName.length < 14) {
        for (const event of resp.data.eventList) {
          programName.push({
            value: event,
            label: event
          })
        }
      }
      console.log(programName)
    })
    axios({
      method: 'get',
      url: `${import.meta.env.VITE_BACKEND_URL}/user/`,
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    }).then((resp) => {
      setOptions(resp.data.admins);
      setProgramCoordinator(resp.data.admins[0]);
    })
  }, []);
  const handleSubmit = () => {
    axios({
      method: "post",
      url: `${import.meta.env.VITE_BACKEND_URL}/event`,
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      data: {
        name: name === 'Other' ? nameIfOther : name,
        date: date,
        programCoordinator: programCoordinator._id
      }
    }).then((resp) => {
      handleClose();
      setEventAdded(true);
      setEvents((prevEvents) => {
        const updatedEvents = [...prevEvents, resp.data.event];
        filterEvents(selectedYear, selectedWeek, updatedEvents);
        return updatedEvents;
      });
    })
  }
  const handleOtherNameChange = (e) => {
    if (eventList.includes(e.target.value)) {
      setName(e.target.value);
    }
    else {
      setNameIfOther(e.target.value);
    }
  }
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: '#b39167', color: '#fff', fontWeight: 'bold' }} >Program Details</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute', right: 8, top: 8, color: '#fff'
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent sx={{ padding: '20px' }}>
          <Stack spacing={2} direction="column" alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
            <TextField
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
              {programName.map((option) => {
                return <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              })}
            </TextField>
            {name === 'Other' ?
              <TextField
                onChange={(e) => handleOtherNameChange(e)}
                fullWidth
                id="outlined-controlled"
                label="Name if Other"
                variant="outlined"
              />
              : <></>
            }
            <DatePicker
              fullWidth
              onChange={(newValue) => (setDate(newValue))}
              label="Start Date"
              value={date}
              sx={{ width: '100%' }}
              slotProps={{
                textField: {
                  helperText: 'Date format : MM/DD/YYYY',
                },
              }}
            ></DatePicker>
            <Autocomplete
              fullWidth
              value={programCoordinator}
              onChange={(event, newValue) => {
                setProgramCoordinator(newValue);
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              id="controllable-states-demo"
              options={options}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => <TextField {...params} label="Program Coordinator" />}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button sx={{
            color: '#fff', backgroundColor: '#ad4511',
            fontWeight: 'bold', marginBottom: '5px',
            '&:hover': {
              backgroundColor: '#0b055f'
            }
          }} variant="contained" onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
export default AddEvent;
