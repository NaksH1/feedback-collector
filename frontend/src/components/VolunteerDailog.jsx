import { useTheme } from '@mui/material/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, Paper, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useMediaQuery, Stack, Tooltip, IconButton, Snackbar } from "@mui/material";
import { useEffect, useState } from 'react';
import axios from 'axios';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

function VolunteerDailog({ open, setOpen, volunteer, event }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  function handleClose() {
    setOpen(false);
  }
  const [feedbacks, setFeedbacks] = useState([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletedFeedbackId, setDeletedFeedbackId] = useState();
  useEffect(() => {
    // console.log(volunteer);
    axios({
      method: "get",
      url: `http://localhost:3000/feedback/${volunteer.volunteerId._id}`,
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    }).then((resp) => {
      setFeedbacks(resp.data.feedbacks);
    });
  }, [])

  function addFeedback(type) {
    if (type === 'training')
      navigate('/addtFeedback', { state: { volunteerName: volunteer.volunteerId.name, volunteerId: volunteer.volunteerId._id, event: event, type: 'training' } })
    else if (type === 'programVolunteer')
      navigate('/addpvfeedback', { state: { volunteerName: volunteer.volunteerId.name, volunteerId: volunteer.volunteerId._id, event: event, type: 'programVolunteer' } })
  }

  const feedbackExist = () => {
    const exist = feedbacks.find(f => (f.eventId._id === event._id));
    return Boolean(exist);
  }
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
      console.log(resp.data);
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
      console.log(restored.data);
      setFeedbacks([...feedbacks, restored.data.feedback]);
      setDeleteOpen(false);
    }
    catch (err) {
      console.log(err);
    }
  }
  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        maxWidth="lg"
      >
        <DialogTitle id="responsive-dialog-title" sx={{ backgroundColor: '#f3f0e5' }}>
          {volunteer ? (
            <Typography variant='subtitle1' sx={{ color: '#cc4521', fontWeight: 'bold' }}>
              {volunteer.volunteerId.name}
            </Typography>
          ) : <>"Loading..."</>}
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: '#f3f0e5' }}>
          {volunteer ? (
            <>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant='body1'>
                  Feedbacks
                </Typography>
                {volunteer.type !== 'potential' && !feedbackExist() ? <AddCircleOutlinedIcon fontSize="large" onClick={() => addFeedback(volunteer.type)} /> : <></>}
              </Stack>
              <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ backgroundColor: '#464038', fontWeight: 'bold', width: '30%', color: '#fff' }}>Event Name</TableCell>
                      <TableCell sx={{ backgroundColor: '#464038', fontWeight: 'bold', width: '30%', color: '#fff' }}>Date</TableCell>
                      <TableCell sx={{ backgroundColor: '#464038', fontWeight: 'bold', width: '20%', color: '#fff' }}>Given By</TableCell>
                      <TableCell sx={{ backgroundColor: '#464038', fontWeight: 'bold', width: '20%', color: '#fff' }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {feedbacks.map((row) => (
                      <TableRow
                        key={row._id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {row.eventId.name}
                        </TableCell>
                        <TableCell>{formatDate(row.eventId.date)}</TableCell>
                        <TableCell>{row.givenBy.name}</TableCell>
                        <TableCell >
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
            </>
          ) :
            (
              <> "Loading..."</>
            )}
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#f3f0e5' }}>
          <Button autoFocus onClick={handleClose}
            sx={{
              color: '#cc4521', fontWeight: 'bold', '&:hover': {
                color: '#03346E'
              }
            }}>
            Close
          </Button>
        </DialogActions>
      </Dialog >
      <Snackbar
        open={deleteOpen}
        autoHideDuration={6000}
        onClose={handleDeleteClose}
        message="Feedback Deleted"
        action={<Button variant='text' size='small' onClick={handleDeleteRestore}>
          UNDO
        </Button>}
      />
    </>
  )
}
export default VolunteerDailog;
