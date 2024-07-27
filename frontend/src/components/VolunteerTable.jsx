import { useEffect, useState } from "react";
import { Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import axios from "axios";
import VolunteerDailog from "./VolunteerDailog";
import AddIcon from '@mui/icons-material/Add';

function VolunteerTable({ event }) {
  const [volunteers, setVolunteers] = useState([]);
  const [volunteerDailog, setVolunteerDailog] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  useEffect(() => {
    axios({
      method: "get",
      url: `http://localhost:3000/volunteer`,
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    }).then((res) => {
      setVolunteers(res.data.volunteers);
    });
  }, []);
  function addVolunteer() {
    console.log("Volunteer added");
  }
  function openVolunteerDailog(volunteer) {
    setSelectedVolunteer(volunteer);
    setVolunteerDailog(true);
  }
  function closeVolunteerDailog() {
    setVolunteerDailog(false);
    setSelectedVolunteer(null);
  }
  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1">Volunteers</Typography>
        <Button onClick={addVolunteer} variant="contained">Add</Button>
      </Stack>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Mobile Number</TableCell>
              <TableCell align="right">Created By</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {volunteers.map((row) => (
              <TableRow onClick={() => openVolunteerDailog(row)}
                key={row.mobileNumber}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.mobileNumber}</TableCell>
                <TableCell align="right">{row.createdBy}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedVolunteer && (
        <VolunteerDailog open={volunteerDailog} setOpen={closeVolunteerDailog} volunteer={selectedVolunteer} event={event} />
      )}
    </>
  )
}


export default VolunteerTable;
