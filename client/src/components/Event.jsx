import AddIcon from '@mui/icons-material/Add';
import { Alert, Card, Snackbar, Stack, TextField, Typography, Container, Box, Pagination, MenuItem, Button, Popover } from "@mui/material";
import { useState, useEffect } from 'react';
import axios from 'axios';
import AddEvent from './AddEvent';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { darken } from '@mui/system';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
function Event() {
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [eventAdded, setEventAdded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownOptions, setDropdownOptions] = useState();
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('');
  const eventsPerPage = 8;
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
      setFilteredEvents(res.data.events);
      setDropdownOptions(res.data.dropdownOptions)
    }).catch((err) => {
      console.error(err);
    });
  };
  useEffect(() => {
    fetchEvents();
  }, []);

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setSelectedWeek('');
    filterEvents(e.target.value, '');
  }
  const handleWeekChange = (e) => {
    setSelectedWeek(e.target.value);
    filterEvents(selectedYear, e.target.value);
  }
  const filterEvents = (year, week, eventsToFilter = events) => {
    let filtered = eventsToFilter;
    if (year) {
      filtered = filtered.filter(event => dayjs(event.date).year() === parseInt(year))
    }
    if (week) {
      const [startDate, endDate] = week.split(' - ').map(date => dayjs(date, 'D MMM YY'));
      const startOfDay = startDate.startOf('day');
      const endOfDay = endDate.endOf('day');
      filtered = filtered.filter(event => {
        const eventDate = dayjs(event.date);
        return eventDate.isSameOrAfter(startOfDay) && eventDate.isSameOrBefore(endOfDay);
      });
    }
    setFilteredEvents(filtered);
  }
  const handleFilterClear = () => {
    setSelectedYear('');
    setSelectedWeek('');
    setFilteredEvents(events);
  }
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    // handleFilterClear();
    setOpen(true);
  };
  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway')
      return;
    setEventAdded(false);
  }
  let indexOfLastEvent = eventsPerPage * currentPage;
  let indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  let currentPageEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  }
  return (
    <>
      <Container maxWidth="xl">
        <Snackbar open={eventAdded} autoHideDuration={6000} onClose={handleAlertClose}>
          <Alert onClose={handleAlertClose} severity="success" variant="filled" sx={{ width: '100%' }}>
            Event added
          </Alert>
        </Snackbar>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent='space-between' sx={{ marginTop: 2, marginRight: 1 }}>
          {dropdownOptions ?
            <Stack direction='row' spacing={1}>
              <TextField id='year-select' select label='Select Year' value={selectedYear} onChange={handleYearChange}
                variant='filled' sx={{ width: '10vw' }}
                InputProps={{
                  disableUnderline: true,
                  style: {
                    borderRadius: 50
                  }
                }}
              >
                {dropdownOptions.length > 0 ? (
                  dropdownOptions.map(({ year }) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>
                    No Years Available
                  </MenuItem>
                )}
              </TextField>
              <TextField id='week-select' select label='Select Week' value={selectedWeek} onChange={handleWeekChange}
                variant='filled' disabled={!selectedYear} sx={{ width: '18vw' }}
                InputProps={{
                  disableUnderline: true,
                  style: {
                    borderRadius: 50
                  }
                }}
              >
                {selectedYear && dropdownOptions.find(option => option.year === selectedYear)?.weeks.length > 0 ? (
                  dropdownOptions.find(option => option.year === selectedYear).weeks.map((week, index) => (
                    <MenuItem key={index} value={week}>
                      {week}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>
                    No Weeks Available
                  </MenuItem>
                )}
              </TextField>
              <Button variant='outlined' onClick={handleFilterClear} sx={{
                borderRadius: 50, color: '#ad4511',
                borderColor: '#ad4511', fontWeight: 'bold', '&:hover': { color: '#0b055f', borderColor: '#0b055f' }
              }}>Clear</Button>
            </Stack>
            : <></>}
          <Button variant='contained' startIcon={<AddIcon />} onClick={handleOpen}
            sx={{
              fontSize: 'medium', borderRadius: 50, padding: '8px 16px', backgroundColor: '#ad4511',
              fontWeight: 'bold', '&:hover': { backgroundColor: '#0b055f' }
            }}>Add</Button>
          {open ? <AddEvent open={open} setOpen={setOpen} setEvents={setEvents} handleClose={handleClose} setEventAdded={setEventAdded}
            filterEvents={filterEvents} selectedYear={selectedYear} selectedWeek={selectedWeek} /> : <></>}

        </Stack>
        <Stack direction="row" spacing={2} sx={{ marginTop: 2, display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
          {currentPageEvents.map((event, index) => {
            return <Events event={event} key={event._id} index={index} />
          })}
        </Stack>
        <Stack direction="row" justifyContent='center' sx={{ marginTop: '2vh' }}>
          <Pagination
            count={Math.ceil(events.length / eventsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            sx={{
              '& .MuiButtonBase-root': {
                backgroundColor: '#c5662b', color: '#fff'
              },
              '& .MuiButtonBase-root.Mui-selected': {
                backgroundColor: '#ad4511', color: '#fff'
              }
            }}
          />
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
