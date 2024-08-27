import { Box, Container, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import Paper from '@mui/material/Paper';
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

function VolunteersList() {
  const [trainingList, setTrainingList] = useState([]);
  const [potentialList, setPotentialList] = useState([]);
  const [pvList, setPvList] = useState([]);
  const [volunteerList, setVolunteerList] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios({
      method: 'get',
      url: `${process.env.REACT_APP_BACKEND_URL}/volunteer/getList`,
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    }).then((resp) => {
      setTrainingList(resp.data.training);
      setPvList(resp.data.programVolunteer);
      setPotentialList(resp.data.potential);
      setVolunteerList(resp.data.volunteers);
    })
  }, [])
  const columns = [
    { field: 'id', headerName: 'ID', width: 120, headerClassName: 'volunteer-table--header', renderHeader: () => <strong>ID</strong> },
    { field: 'name', headerName: 'Name', width: 170, headerClassName: 'volunteer-table--header', renderHeader: () => <strong>Name</strong> },
    { field: 'mobileNumber', headerName: 'Mobile Number', width: 170, headerClassName: 'volunteer-table--header', renderHeader: () => <strong>Mobile Number</strong> },
    { field: 'gender', headerName: 'Gender', width: 100, headerClassName: 'volunteer-table--header', renderHeader: () => <strong>Gender</strong> },
    { field: 'city', headerName: 'City', width: 150, headerClassName: 'volunteer-table--header', renderHeader: () => <strong>City</strong> },
    { field: 'status', headerName: 'Status', width: 220, headerClassName: 'volunteer-table--header', renderHeader: () => <strong>Status</strong> },
    { field: 'category', headerName: 'Category', width: 220, headerClassName: 'volunteer-table--header', renderHeader: () => <strong>Category</strong> }
  ];
  const rows = volunteerList.map((volunteer) => ({
    id: volunteer.id,
    name: volunteer.name,
    mobileNumber: volunteer.mobileNumber,
    gender: volunteer.gender,
    city: volunteer.city,
    status: volunteer.status,
    category: volunteer.category
  }));
  const handleRowClick = (volunteer) => {
    navigate(`./${volunteer.id}`)
  }
  return (
    <Container maxHeight="lg" maxWidth="lg">
      <Typography variant="h4" sx={{ marginTop: '4vh', color: '#0b055f', fontWeight: 'bold' }}>Volunteer List</Typography>
      <Box sx={{ height: '77vh', width: '100%', marginTop: '4vh' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[10, 20]}
          slots={{ toolbar: GridToolbar }}
          initialState={{
            pagination: {
              paginationModel: {
                page: 0,
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10, 20]}
          onRowClick={handleRowClick}
          sx={{
            backgroundColor: '#fff',
            '& .MuiDataGrid-filler': {
              backgroundColor: '#464038'
            },
            '& .volunteer-table--header': {
              backgroundColor: '#b39167', fontWieght: 'bold !important'
            },
            '& .MuiDataGrid-toolbarContainer': {
              backgroundColor: '#464038',
              color: '#fff !important'
            },
            '& .MuiDataGrid-columnHeader': {
              color: '#fff !important', fontWeight: 'bold !important'
            },
            '& .MuiDataGrid-toolbarContainer .MuiButton-root': {
              color: '#fff !important',
              borderColor: '#fff !important'
            }
          }}
        />
      </Box>
      {/* <Grid container justifyContent='space-around' alignItems="flex-start" direction="row" sx={{ marginTop: '10vh' }}> */}
      {/*   <List list={trainingList} listName='Training' /> */}
      {/*   <List list={pvList} listName='Program Volunteer Under Observation' /> */}
      {/*   <List list={potentialList} listName='Potential' /> */}
      {/* </Grid> */}
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
              <TableCell sx={{ backgroundColor: '#464038', fontWeight: 'bold', width: '40%', color: '#fff' }}>{listName}</TableCell>
              <TableCell sx={{ backgroundColor: '#464038', fontWeight: 'bold', width: '40%', color: '#fff' }}>Mobile Number</TableCell>
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

export default VolunteersList;
