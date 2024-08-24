import AddIcon from '@mui/icons-material/Add';
import { Alert, Card, Snackbar, Stack, TextField, Typography, Container, Box } from "@mui/material";
import { useState, useEffect } from 'react';
import axios from 'axios';
import AddEvent from './AddEvent';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { darken } from '@mui/system';

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
      <Container maxWidth="xl">
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
          {events.map((event, index) => {
            return <Events event={event} key={event._id} index={index} />
          })}
        </Stack>
      </Container>
    </>
  )
}

export function Events({ event, index }) {
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
  const backgroundColor = index % 3 === 0 ? '#dc9e40' : index % 2 === 0 ? '#d4782e' : '#b05912';
  const clipPath = index % 2 !== 0 ? 'polygon(0px 0px, 100% 0px, 100% 90%, 0% 98%)' : 'polygon(0px 0px, 100% 0px, 100% 98%, 0% 90%)';
  return (
    <div>
      <Card sx={{
        margin: 2,
        width: 300,
        height: '33vh',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: 3,
        transition: 'box-shadow 0.3s ease-in-out, backgroundColor 0.3s ease-in-out',
        '&:hover': {
          boxShadow: 9,
          backgroundColor: darken(backgroundColor, 0.1)
        },
        backgroundColor
      }} onClick={handleEventClick}>
        <Box sx={{ height: '18vh', overflow: 'hidden', clipPath, cursor: 'pointer' }}>
          <img src={event.image} style={{
            width: '100%',
            hieght: '100%',
            objectFit: 'cover',
            cursor: 'pointer'
          }} />
        </Box>
        <Typography textAlign={"center"} variant='h5' sx={{ color: '#fff' }}>
          {event.name}
        </Typography>
        <Box sx={{ backgroundColor: '#fff', marginTop: '2vh' }}>
          <Typography textAlign={"center"} variant='subtitle1'>
            {date}
          </Typography>
          {event.programCoordinator ? <Typography key={event.programCoordinator} textAlign={"center"} variant='subtitle1'>
            {event.programCoordinator.name}
          </Typography>
            : <></>}
        </Box>
      </Card>
    </div >
  )

}

export default Event;
