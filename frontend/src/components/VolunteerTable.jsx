import { useEffect, useState } from "react";
import { Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import axios from "axios";
function VolunteerTable() {
  const [volunteers, setVolunteers] = useState([]);
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
  return (
    <>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Volunteer</TableCell>
              <TableCell align="right">Mobile Number</TableCell>
              <TableCell align="right">Created By</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {volunteers.map((row) => (
              <TableRow
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
    </>
  )
}


export default VolunteerTable;
