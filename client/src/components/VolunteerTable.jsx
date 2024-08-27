import { useEffect, useState } from "react";
import { Button, Pagination, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import axios from "axios";
import VolunteerDailog from "./VolunteerDailog";
import AddIcon from '@mui/icons-material/Add';
import AddVolunteer from "./AddVolunteer";
import Papa from "papaparse";


function VolunteerTable({ event }) {
  const [volunteers, setVolunteers] = useState([]);
  const [volunteerDailog, setVolunteerDailog] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [addVolunteer, setAddVolunteer] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventId, setEventId] = useState('');
  const volunteersPerPage = 5;
  const volunteerType = [
    { value: 'potential', label: 'Potential Sahabhagi' },
    { value: 'training', label: 'Training Sahabhagi' },
    { value: 'programVolunteer', label: 'Program Volunteer Under Obs.' }
  ]
  useEffect(() => {
    if (event && event._id) {
      setEventId(event._id);
      axios({
        method: "get",
        url: `${import.meta.env.VITE_BACKEND_URL}/event/getVolunteer/${event._id}`,
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

  let indexOfLastVolunteer = currentPage * volunteersPerPage;
  let indexOfFirstVolunteer = indexOfLastVolunteer - volunteersPerPage;
  let currentVolunteers = volunteers.slice(indexOfFirstVolunteer, indexOfLastVolunteer);
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const handleCSVUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: function(result) {
          const { data, meta, errors } = result;
          const headers = meta.fields;
          const requiredHeaders = ['Name', 'Mobile Number', 'Type'];
          const missingHeaders = [];
          const allHeadersExist = requiredHeaders.reduce((acc, requiredHeader) => {
            const exist = headers.includes(requiredHeader);
            if (!exist)
              missingHeaders.push(requiredHeader);
            return acc && exist;
          }, true);
          if (!allHeadersExist) {
            console.log('Missing Headers: ', missingHeaders);
            alert(`The uploaded file is missing the following fields: ${missingHeaders}`)
          }
          const invalidRows = [];
          data.forEach((row, index) => {
            let mobileNumber = row['Mobile Number'].trim();
            if (mobileNumber && mobileNumber.startsWith("'"))
              mobileNumber = mobileNumber.substring(1);

            const hasMobileNumber = mobileNumber !== '';
            const hasName = row['Name']?.trim() !== '';
            const type = row['Type']?.trim();
            const hasType = type !== '' && (type === 'training' || type === 'programVolunteer');
            if (!hasMobileNumber || !hasName || !hasType)
              invalidRows.push(index + 2);
            return {
              ...row,
              'Mobile Number': mobileNumber
            }
          });
          if (invalidRows.length > 0) {
            alert(`The following rows have invalid data: ${invalidRows}`);
            console.log(`Invalid rows: ${invalidRows}`)
          }
          else {
            console.log('All rows are valid', data);
            const volunteersList = data;
            axios({
              method: 'post',
              url: `${import.meta.env.VITE_BACKEND_URL}/event/addVolunteerList`,
              headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
              },
              data: {
                volunteersList: volunteersList,
                eventId: eventId
              }
            }).then((resp) => {
              console.log(resp.data)
              window.location.reload();
            })
          }
        },
        error: function(error) {
          console.error("Error parsing CSV file: ", error);
          alert("There was an error processing the CSV file.");
        }
      })
    }
  }

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1"
          sx={{ fontWeight: 'bold' }}
        >Volunteer Table</Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Button variant="contained" component="label" sx={{ fontWeight: 'bold' }}>
            Import CSV
            <input type="file" accept=".csv" hidden onChange={handleCSVUpload} />
          </Button>
          <Button variant="contained" onClick={() => openAddVolunteer()}
            sx={{
              color: '#fff', backgroundColor: '#ad4511',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#0b055f'
              }
            }}
          >Add</Button>
        </Stack>
      </Stack>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table aria-label="simple table" key={volunteers}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: '#464038', fontWeight: 'bold', width: '30%', color: '#fff' }}>Name</TableCell>
              <TableCell sx={{ backgroundColor: '#464038', fontWeight: 'bold', width: '30%', color: '#fff' }}>Type</TableCell>
              <TableCell sx={{ backgroundColor: '#464038', fontWeight: 'bold', width: '20%', color: '#fff' }}>Mobile Number</TableCell>
              <TableCell align="right" sx={{ backgroundColor: '#464038', fontWeight: 'bold', width: '20%', color: '#fff' }}>Created By</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentVolunteers.map((row) => (
              <TableRow onClick={() => openVolunteerDailog(row)}
                key={row.volunteerId.mobileNumber}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.volunteerId.name}
                </TableCell>
                <TableCell >{getVolunteerType(row.type)}</TableCell>
                <TableCell >{row.volunteerId.mobileNumber}</TableCell>
                <TableCell align="right">{row.volunteerId.createdBy.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack direction='row' justifyContent='center' sx={{ marginTop: '2vh' }}>
        <Pagination
          count={Math.ceil(volunteers.length / volunteersPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Stack>
      {selectedVolunteer && (
        <VolunteerDailog open={volunteerDailog} setOpen={closeVolunteerDailog} volunteer={selectedVolunteer} event={event} />
      )}
      <AddVolunteer open={addVolunteer} close={closeAddVolunteer} eventId={event._id} onSuccess={handleSuccessfulVolunteerAdd} />
    </>
  )
}


export default VolunteerTable;
