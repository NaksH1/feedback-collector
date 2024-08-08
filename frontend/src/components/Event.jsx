import AddIcon from '@mui/icons-material/Add';
import { Alert, Card, Snackbar, Stack, TextField, Typography } from "@mui/material";
import { useState, useEffect } from 'react';
import axios from 'axios';
import AddEvent from './AddEvent';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

function Event() {
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [eventAdded, setEventAdded] = useState(false);
  const fetchEvents = () => {
    axios({
      method: "get",
      url: "http://localhost:3000/event",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    }).then((res) => {
      console.log(res.data);
      setEvents(res.data.events);
    }).catch((err) => {
      console.error(err);
    });
  };
  useEffect(() => {
    fetchEvents();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway')
      return;
    setEventAdded(false);
  }
  return (
    <>
      <Snackbar open={eventAdded} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity="success" variant="filled" sx={{ width: '100%' }}>
          Event added
        </Alert>
      </Snackbar>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ marginTop: 2, marginRight: 1 }}>
        <TextField id="filled-basic" label="Search Event" variant="filled" fullWidth />
        <AddIcon variant="outlined" onClick={handleOpen} fontSize='medium' ></AddIcon>
        {open ? <AddEvent open={open} setOpen={setOpen} setEvents={setEvents} handleClose={handleClose} setEventAdded={setEventAdded} /> : <></>}

      </Stack>
      <Stack direction="row" spacing={2} sx={{ marginTop: 2, display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {events.map((event) => {
          return <Events event={event} key={event._id} />
        })}
      </Stack>
    </>
  )
}

export function Events({ event }) {
  const navigate = useNavigate();
  function handleEventClick() {
    navigate(`/events/${event._id}`);
  }
  const formatDate = (date) => {
    if (!date)
      return '';
    return dayjs(date).format('Do MMMM YYYY');
  }
  const date = formatDate(event.date);
  return (
    <div>
      <Card sx={{ margin: 2, width: 300, minHeight: 200 }} onClick={handleEventClick}>
        <img src={event.image} style={{ width: 300 }}></img>
        <Typography textAlign={"center"} variant='h5'>
          {event.name}
        </Typography>
        <Typography textAlign={"center"} variant='subtitle1'>
          {date}
        </Typography>
        {event.programCoordinator ? <Typography textAlign={"center"} variant='subtitle1'>
          {event.programCoordinator.name}
        </Typography> : <></>}

      </Card>
    </div>
  )

}

export default Event;
