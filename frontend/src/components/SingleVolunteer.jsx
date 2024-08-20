import { Button, Card, CardContent, Container, Grid, IconButton, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import dayjs from "dayjs";

function SingleVolunteer() {
  const { volunteerId } = useParams();
  const [volunteer, setVolunteer] = useState({});
  const [programCounter, setProgramCounter] = useState({});
  const [totalProgram, setTotalProgram] = useState(0);
  const [feedbacks, setFeedbacks] = useState([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletedFeedbackId, setDeletedFeedbackId] = useState();
  useEffect(() => {
    axios({
      method: 'get',
      url: `http://localhost:3000/volunteer/volunteerfulldetails/${volunteerId}`,
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    }).then((resp) => {
      console.log(resp.data);
      setVolunteer(resp.data.volunteer);
      setProgramCounter(resp.data.programCounter);
      setTotalProgram(resp.data.totalProgram);
      setFeedbacks(resp.data.volunteer.feedbacks);
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
  const deleteFeedback = async (feedbackId) => {
    try {
      const resp = await axios({
        method: 'delete',
        url: `http://localhost:3000/feedback/${feedbackId}`,
        headers: {
          "Authorization": "Bearer " + localStorage.getItem('token')
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
        url: `http://localhost:3000/feedback/recover/${deletedFeedbackId}`,
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token")
        }
      })
      const restored = await axios({
        method: 'get',
        url: `http://localhost:3000/feedback/full/${deletedFeedbackId}`,
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
  return (
    <>
      <Container maxWidth="lg">
        <Grid container spacing={1.5} alignItems="center" sx={{ marginTop: '9vh' }}>
          <Grid item lg={4}>
            <Card sx={{
              borderRadius: "12px", textAlign: "left",
              boxShadow: "0 2px 4px -2px rgba(0,0,0,0.24), 0 4px 24px -2px rgba(0, 0, 0, 0.2)"
            }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  Volunteer name: {volunteer.name}
                </Typography>
                <Typography variant="body1">
                  Mobile Number: {volunteer.mobileNumber}
                  <br />
                  Total Programs Completed: {totalProgram}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item lg={12}>
            <TableContainer component={Paper} sx={{ marginTop: '5vh' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', width: '30%' }}>Event Name</TableCell>
                    <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', width: '20%' }}>Status</TableCell>
                    <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', width: '20%' }}>Date</TableCell>
                    <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', width: '20%' }}>Given By</TableCell>
                    <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', width: '10%', alignContent: 'center' }}>Action</TableCell>
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
                          <IconButton>
                            <VisibilityIcon onClick={() => viewFeedback(row._id)} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton>
                            <DeleteOutlineIcon onClick={() => deleteFeedback(row._id)} />
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
