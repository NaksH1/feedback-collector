import { useTheme } from '@mui/material/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, Paper, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useMediaQuery, Stack } from "@mui/material";
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
  useEffect(() => {
    axios({
      method: "get",
      url: `http://localhost:3000/feedback/${volunteer._id}`,
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    }).then((resp) => {
      setFeedbacks(resp.data.feedbacks);
    });
  }, [])

  function addFeedback() {
    navigate('/addFeedback', { state: { volunteerName: volunteer.name, volunteerId: volunteer._id, event: event } })
  }

  const feedbackExist = () => {
    const exist = feedbacks.find(f => (f.eventId === event._id));
    console.log(exist);
    return Boolean(exist);
  }
  const formatDate = (date) => {
    if (!date)
      return '';
    return dayjs(date).format('Do MMMM YYYY');
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
        <DialogTitle id="responsive-dialog-title">
          {volunteer ? (
            <Typography variant='subtitle1' >
              {volunteer.name}
            </Typography>
          ) : <>"Loading..."</>}
        </DialogTitle>
        <DialogContent>
          {volunteer ? (
            <>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant='body1'>
                  Feedbacks
                </Typography>
                {volunteer.type === 'training' && !feedbackExist() ? <AddCircleOutlinedIcon fontSize="large" onClick={() => addFeedback()} /> : <></>}
              </Stack>
              <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell >Action</TableCell>
                      <TableCell>Event Name</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Given By</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {feedbacks.map((row) => (
                      <TableRow
                        key={row._id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell >
                          <VisibilityIcon />
                          <DeleteOutlineIcon />
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.eventName}
                        </TableCell>
                        <TableCell>{formatDate(row.eventDate)}</TableCell>
                        <TableCell>{row.givenBy}</TableCell>

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
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
export default VolunteerDailog;
