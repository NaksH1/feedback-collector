import { Grid } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

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
    <Grid container spacing={1.5} justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Grid xs={10} lg={4}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Mobile No.</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {training.map((volunteer) => (
                <TableRow
                  key={volunteer._id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {volunteer.name}
                  </TableCell>
                  <TableCell>{volunteer.mobileNumber}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid xs={10} lg={4}>
      </Grid>
      <Grid xs={10} lg={4}>
      </Grid>
    </Grid>
  )
}

export default VolunteerDashboard;
