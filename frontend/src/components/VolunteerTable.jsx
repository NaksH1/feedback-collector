import { useEffect, useState } from "react";
import { Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import axios from "axios";
import VolunteerDailog from "./VolunteerDailog";
import AddIcon from '@mui/icons-material/Add';
import AddVolunteer from "./AddVolunteer";

function VolunteerTable({ event }) {
  const [volunteers, setVolunteers] = useState([]);
  const [volunteerDailog, setVolunteerDailog] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [addVolunteer, setAddVolunteer] = useState(false);
  const volunteerType = [
    {
      value: 'potential',
      label: 'Potential Sahabhagi'
    },
    {
      value: 'training',
      label: 'Training Sahabhagi'
    },
    {
      value: 'programVolunteer',
      label: 'Program Volunteer Under Obs.'
    }
  ]
  useEffect(() => {
    if (event && event._id) {

      axios({
        method: "get",
        url: `http://localhost:3000/event/getVolunteer/${event._id}`,
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token")
        }
      }).then((res) => {
        setVolunteers(res.data.volunteers);
      });
    }
  }, [event]);
  function handleSuccessfulVolunteerAdd(newVolunteer) {
    setVolunteers((preVolunteers) => [...preVolunteers, newVolunteer]);
    window.location.reload()
  }

  function openVolunteerDailog(volunteer) {
    setSelectedVolunteer(volunteer);
    setVolunteerDailog(true);
  }
  function closeVolunteerDailog() {
    setVolunteerDailog(false);
    setSelectedVolunteer(null);
  }
  function openAddVolunteer() {
    setAddVolunteer(true);
  }
  function closeAddVolunteer() {
    setAddVolunteer(false);
  }
  function getVolunteerType(type) {
    const volunteerTypeObj = volunteerType.find(v => (v.value === type));
    return volunteerTypeObj ? volunteerTypeObj.label : type;
  }
  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1">Volunteers</Typography>
        <Button variant="contained" onClick={() => openAddVolunteer()}>Add</Button>
      </Stack>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Type</TableCell>
              <TableCell align="right">Mobile Number</TableCell>
              <TableCell align="right">Created By</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {volunteers.map((row) => (
              <TableRow onClick={() => openVolunteerDailog(row)}
                key={row.volunteerId.mobileNumber}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.volunteerId.name}
                </TableCell>
                <TableCell align="right">{getVolunteerType(row.type)}</TableCell>
                <TableCell align="right">{row.volunteerId.mobileNumber}</TableCell>
                <TableCell align="right">{row.volunteerId.createdBy.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedVolunteer && (
        <VolunteerDailog open={volunteerDailog} setOpen={closeVolunteerDailog} volunteer={selectedVolunteer} event={event} />
      )}
      <AddVolunteer open={addVolunteer} close={closeAddVolunteer} eventId={event._id} onSuccess={handleSuccessfulVolunteerAdd} />
    </>
  )
}


export default VolunteerTable;
