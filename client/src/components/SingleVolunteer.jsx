import { Box, Button, Card, CardContent, Container, Grid, IconButton, Paper, Snackbar, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Tooltip, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import dayjs from "dayjs";


function SingleVolunteer() {
  const { volunteerId } = useParams();
  const [volunteer, setVolunteer] = useState({});
  const [programCounter, setProgramCounter] = useState({});
  const [perProgramDetails, setPerProgramDetails] = useState({});
  const [totalProgram, setTotalProgram] = useState(0);
  const [feedbacks, setFeedbacks] = useState([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletedFeedbackId, setDeletedFeedbackId] = useState();
  const navigate = useNavigate();
  const [programName, setProgramName] = useState([]);
  useEffect(() => {
    axios({
      method: 'get',
      url: `${import.meta.env.VITE_BACKEND_URL}/volunteer/volunteerfulldetails/${volunteerId}`,
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    }).then((resp) => {
      console.log(resp.data.perProgramDetails);
      setVolunteer(resp.data.volunteer);
      setProgramCounter(resp.data.programCounter);
      setPerProgramDetails(resp.data.perProgramDetails)
      setTotalProgram(resp.data.totalProgram);
      setFeedbacks(resp.data.volunteer.feedbacks);
      const programKeys = Object.keys(resp.data.perProgramDetails);
      setProgramName(programKeys);
      if (Object.keys(programKeys).length > 0)
        setValue(programKeys[0])
    })
  }, [])

  const formatDate = (date) => {
    if (!date)
      return '';
    return dayjs(date).format('Do MMMM YYYY');
  }
  const viewFeedback = (feedbackId) => {
    navigate(`/viewfeedback/${feedbackId}`);
  }
  const deleteFeedback = async (feedback) => {
    try {
      const feedbackId = feedback._id;
      const eventId = feedback.eventId._id;
      const resp = await axios({
        method: 'delete',
        url: `${import.meta.env.VITE_BACKEND_URL}/feedback/${feedbackId}`,
        headers: {
          "Authorization": "Bearer " + localStorage.getItem('token')
        },
        data: {
          eventId: eventId,
          volunteerId: feedback.volunteerId
        }
      });
      setFeedbacks(feedbacks.filter(feedback => (feedback._id !== feedbackId)));
      setDeletedFeedbackId(feedbackId);
      setDeleteOpen(true);
    } catch (err) {
      console.log(err);
    }
  }
  const handleDeleteClose = (event, reason) => {
    if (reason === 'clickaway')
      return;
    setDeleteOpen(false);
  }
  const handleDeleteRestore = async () => {
    try {
      const resp = await axios({
        method: 'put',
        url: `${import.meta.env.VITE_BACKEND_URL}/feedback/recover/${deletedFeedbackId}`,
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token")
        }
      })
      const restored = await axios({
        method: 'get',
        url: `${import.meta.env.VITE_BACKEND_URL}/feedback/full/${deletedFeedbackId}`,
        headers: {
          "Authorization": "Bearer " + localStorage.getItem('token')
        }
      });
      setFeedbacks([...feedbacks, restored.data.feedback]);
      setDeleteOpen(false);
    }
    catch (err) {
      console.log(err);
    }
  }
  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <Container maxWidth="lg">
        <Grid container spacing={1.5} alignItems="flex-start" sx={{ marginTop: '9vh' }}>
          <Grid item lg={4} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Card sx={{
              margin: 0,
              borderRadius: "12px",
              textAlign: "left",
              boxShadow: "0 2px 4px -2px rgba(0,0,0,0.24), 0 4px 24px -2px rgba(0, 0, 0, 0.2)",
              hieght: '100%'
            }}>
              <CardContent sx={{ padding: 0 }}>
                <Box sx={{
                  backgroundColor: '#ad4511',
                  clipPath: 'polygon(0px 0px, 100% 0px, 100% 86%, 0% 98%)',
                  padding: '16px',
                  borderRadius: "12px 12px 0 0",
                }}>
                  <Typography variant="h5" component="div" color="#fff">
                    {volunteer.name}
                  </Typography>
                </Box>
                <Box sx={{
                  backgroundColor: '#fff',
                  padding: '16px',
                  borderRadius: "0 0 12px 12px"
                }}>
                  <Typography variant="body1" color="#000">
                    Mobile Number: {volunteer.mobileNumber}
                    <br />
                    City: {volunteer.city ? volunteer.city : ''}
                    <br />
                    Gender: {volunteer.gender}
                    <br />
                    Total Programs Completed: {totalProgram}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item lg={8} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Card sx={{
              margin: 0,
              borderRadius: "12px",
              textAlign: "left",
              boxShadow: "0 2px 4px -2px rgba(0,0,0,0.24), 0 4px 24px -2px rgba(0, 0, 0, 0.2)",
              height: '100%', display: 'flex', flexDirection: 'column'
            }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: '#464038', color: '#fff' }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="program tabs"
                  variant="scrollable"
                  sx={{
                    '& .MuiTab-root': { color: '#fff' }, // Set tab text color
                    '& .Mui-selected': { color: '#fff', fontWeight: 'bold' }
                  }}
                >
                  {programName?.map((program, index) => (
                    <Tab key={program} label={program} value={index} />
                  ))}
                </Tabs>
              </Box>

              {programName?.map((program, index) => (
                value === index && (
                  <Box key={program} sx={{ padding: 0, flexGrow: 1, overflowY: 'auto' }}>
                    <Box sx={{ height: '100%', overflowY: 'auto' }}>
                      <Table stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ backgroundColor: '#464038', fontWeight: 'bold', width: '30%', color: '#fff' }}>
                              Area
                            </TableCell>
                            <TableCell sx={{ backgroundColor: '#464038', fontWeight: 'bold', width: '30%', color: '#fff' }}>
                              Count
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Object.entries(perProgramDetails[program]).map(([key, value], idx) => (
                            <TableRow key={idx}>
                              <TableCell>{key}</TableCell>
                              <TableCell>{value}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Box>
                  </Box>
                )
              ))}
            </Card>
          </Grid>
          <Grid item lg={12}>
            <TableContainer component={Paper} sx={{ marginTop: '5vh' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: '#464038', fontWeight: 'bold', width: '30%', color: '#fff' }}>Event Name</TableCell>
                    <TableCell sx={{ backgroundColor: '#464038', fontWeight: 'bold', width: '20%', color: '#fff' }}>Status</TableCell>
                    <TableCell sx={{ backgroundColor: '#464038', fontWeight: 'bold', width: '20%', color: '#fff' }}>Date</TableCell>
                    <TableCell sx={{ backgroundColor: '#464038', fontWeight: 'bold', width: '20%', color: '#fff' }}>Given By</TableCell>
                    <TableCell sx={{ backgroundColor: '#464038', fontWeight: 'bold', width: '10%', alignContent: 'center', color: '#fff' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {feedbacks?.map((row) => (
                    <TableRow
                      key={row._id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.eventId.name}
                      </TableCell>
                      <TableCell>{row[row.type]?.status}</TableCell>
                      <TableCell>{formatDate(row.eventId.date)}</TableCell>
                      <TableCell>{row.givenBy.name}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="View">
                          <IconButton onClick={() => viewFeedback(row._id)} >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton onClick={() => deleteFeedback(row)}>
                            <DeleteOutlineIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        <Snackbar
          open={deleteOpen}
          autoHideDuration={6000}
          onClose={handleDeleteClose}
          message="Feedback Deleted"
          action={<Button variant='text' size='small' onClick={handleDeleteRestore}>
            UNDO
          </Button>}
        />
      </Container>
    </>
  )
}

export default SingleVolunteer;
