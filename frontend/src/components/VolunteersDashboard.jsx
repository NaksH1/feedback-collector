import { Container, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import Paper from '@mui/material/Paper';
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function VolunteerDashboard() {
  const [trainingList, setTrainingList] = useState([]);
  const [potentialList, setPotentialList] = useState([]);
  const [pvList, setPvList] = useState([]);
  useEffect(() => {
    axios({
      method: 'get',
      url: 'http://localhost:3000/volunteer/getList',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    }).then((resp) => {
      setTrainingList(resp.data.training);
      setPvList(resp.data.programVolunteer);
      setPotentialList(resp.data.potential);
    })
  }, [])
  return (
    <Container maxHeight="lg">
      <Grid container justifyContent='space-around' alignItems="flex-start" direction="row" sx={{ marginTop: '10vh' }}>
        <List list={trainingList} listName='Training' />
        <List list={pvList} listName='Program Volunteer Under Observation' />
        <List list={potentialList} listName='Potential' />
      </Grid>
    </Container>
  )
}

function List({ list, listName }) {
  const navigate = useNavigate();
  const handleVolunteerClick = (volunteerId) => {
    navigate(`/volunteerDashboard/${volunteerId}`);
  }
  return (
    <Grid item xs={10} lg={3.75}>
      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', width: '40%' }}>{listName}</TableCell>
              <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', width: '40%' }}>Mobile Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((volunteer) => (
              <TableRow
                key={volunteer._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                onClick={() => handleVolunteerClick(volunteer._id)}
              >
                <TableCell component="th" scope="row" sx={{ width: '40%' }}>
                  {volunteer.name}
                </TableCell>
                <TableCell sx={{ width: '40%' }}>{volunteer.mobileNumber}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  )
}

export default VolunteerDashboard;
