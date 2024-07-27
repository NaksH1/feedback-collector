import AddIcon from '@mui/icons-material/Add';
import { Card, DialogContent, Stack, TextField, Typography, DialogTitle, Dialog, DialogActions, Button } from "@mui/material";
import { useState, useEffect } from 'react';
import axios from 'axios';
import AddEvent, { postEvent } from './AddEvent';
import { useNavigate } from 'react-router-dom';

function Event() {
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [name, setName] = useState('Bhava Spandana');
  const [date, setDate] = useState("");
  const [programCoordinator, setProgramCoordinator] = useState("");

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

  const handleSubmit = () => {
    postEvent(name, date, programCoordinator).then((res) => {
      alert("Event Created");
      fetchEvents();
    })
    setOpen(false);

  }


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ marginTop: 2, marginRight: 1 }}>
        <TextField id="filled-basic" label="Search Event" variant="filled" fullWidth />
        <AddIcon variant="outlined" onClick={handleClickOpen} fontSize='medium' ></AddIcon>
        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            component: 'form',
            onSubmit: (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries(formData.entries());
              const email = formJson.email;
              console.log(email);
              handleClose();
            },
          }}
        >
          <DialogTitle>Enter Event Details</DialogTitle>
          <DialogContent>
            <AddEvent
              name={name}
              setName={setName}
              date={date}
              setDate={setDate}
              programCoordinator={programCoordinator}
              setProgramCoordinator={setProgramCoordinator} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>

            <Button variant="outlined" onClick={handleSubmit}>Submit</Button>

          </DialogActions>
        </Dialog>
      </Stack>
      <Stack direction="row" spacing={2} sx={{ marginTop: 2, display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {events.map((event) => {
          return <Events event={event} key={event._id} />
        })}
      </Stack>
    </>
  )
}

export function Events(prop) {
  const navigate = useNavigate();
  function handleEventClick() {
    navigate(`/events/${prop.event._id}`);
  }

  return (
    <div>
      <Card sx={{ margin: 2, width: 300, minHeight: 200 }} onClick={handleEventClick}>
        <img src={prop.event.image} style={{ width: 300 }}></img>
        <Typography textAlign={"center"} variant='h5'>
          {prop.event.name}
        </Typography>
        <Typography textAlign={"center"} variant='subtitle1'>
          {prop.event.date}
        </Typography>
        <Typography textAlign={"center"} variant='subtitle1'>
          {prop.event.programCoordinator}
        </Typography>

      </Card>
    </div>
  )

}

export default Event;
