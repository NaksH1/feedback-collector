import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Question } from "./AddFeedback";
import AddPVFeedback from "./AddPVFeedback";
import dayjs from "dayjs";
import { Alert, Button, Card, CardContent, CardHeader, Divider, Grid, Snackbar, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import AddTFeedback, { Header } from "./AddTFeedback";

function ViewFeedback() {
  const { feedbackId } = useParams();
  const [feedback, setFeedback] = useState(null);
  const [feedbackState, setFeedbackState] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const fetchResult = await axios({
          method: 'get',
          url: `http://localhost:3000/feedback/view/${feedbackId}`,
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
          }
        });

        console.log(fetchResult.data);
        setFeedback(fetchResult.data.feedback);
        if (fetchResult.data.feedback.type !== 'potential')
          setFeedbackState(fetchResult.data.feedbackState);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchFeedback();
  }, [feedbackId]);

  const getTrainingFeedback = () => {

    if (feedback && feedback.volunteerId && feedback.eventId) {
      const otherInfo = {
        volunteerName: feedback.volunteerId.name,
        volunteerId: feedback.volunteerId._id,
        event: feedback.eventId,
        type: feedback.type
      }
      return (
        <AddTFeedback
          viewFeedback={feedback}
          otherInfo={otherInfo}
          viewFeedbackState={feedbackState}
          toUpdate={true}
        />
      );
    } else {
      return <span>Invalid feedback data</span>;
    }
  };

  const getProgramVolunteerFeedback = () => {
    if (feedback && feedback.volunteerId && feedback.eventId && feedback.programVolunteer) {
      const otherInfo = {
        volunteerName: feedback.volunteerId.name,
        volunteerId: feedback.volunteerId._id,
        event: feedback.eventId,
        type: feedback.type
      }

      return (
        <AddPVFeedback
          viewFeedback={feedback}
          otherInfo={otherInfo}
          viewFeedbackState={feedbackState}
          toUpdate={true}
        />
      );
    } else {
      return <span>Invalid feedback data</span>
    }
  }

  const getPotentialFeedback = () => {
    if (feedback && feedback.volunteerId && feedback.eventId && feedback.potential) {
      const otherInfo = {
        volunteerName: feedback.volunteerId.name,
        volunteerId: feedback.volunteerId._id,
        event: feedback.eventId
      }

      return (
        <>
          <ViewPotentialFeedback otherInfo={otherInfo} feedback={feedback} />
        </>
      )
    }
    else {
      return (
        <span>Loading...</span>
      )
    }
  }

  return (
    <>
      {/* {loading ? ( */}
      {/*   <span>Loading...</span> */}
      {/* ) : ( */}
      {/*   <> */}
      {/*     <br /> */}
      {/*     {feedback?.type === 'training' ? getTrainingFeedback() : feedback?.type === 'programVolunteer' ? getProgramVolunteerFeedback() : */}
      {/*       feedback?.type === 'potential' ? getPotentialFeedback() : <></>} */}
      {/*   </> */}
      {/* )} */}
      {loading ?
        <span>Loading...</span> :
        <>
          {feedback?.type === 'training' ? getTrainingFeedback() : feedback?.type === 'programVolunteer' ? getProgramVolunteerFeedback() :
            <></>}
        </>
      }
    </>
  );
}

function ViewPotentialFeedback({ otherInfo, feedback }) {
  const { volunteerName, event } = otherInfo;
  const [errorFilling, setErrorFilling] = useState(false);
  const [state, setState] = useState({
    remarks: '', status: '', recommendation: '',
    errors: {
      remarks: false
    }
  });
  const navigate = useNavigate();
  const formatDate = (date) => {
    if (!date)
      return '';
    return dayjs(date).format('Do MMMM YYYY');
  }
  useEffect(() => {
    if (feedback && feedback.potential && otherInfo) {
      setState((preState) => ({
        ...preState,
        remarks: feedback.potential.remarks || preState.remarks,
        status: feedback.potential.status || preState.status,
        recommendation: feedback.potential.recommendation || preState.recommendation
      }));
    }
  }, [feedback, otherInfo]);
  function handleState(e) {
    const { name, value } = e.target;
    setState((preState) => ({
      ...preState,
      [name]: value
    }));
  }
  async function handleUpdate(e) {
    e.preventDefault();
    const { remarks } = state;
    const newErrors = { remarks: !remarks };
    setState((preState) => ({ ...preState, errors: newErrors }));
    const hasError = Object.values(newErrors).some(err => err);
    if (hasError) {
      setErrorFilling(true);
      return;
    }
    const resp = await axios({
      method: 'put',
      url: `http://localhost:3000/feedback/${feedback._id}`,
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      data: {
        type: 'potential',
        potential: state
      }
    });
    alert('Feedback updated');
    console.log(resp.data);
    navigate(`/events/${event._id}`);
  }
  function handleAlertClose(event, reason) {
    if (reason === 'clickaway')
      return;
    setErrorFilling(false);
  }
  return (
    <>
      <Snackbar open={errorFilling} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity="error" variant="filled" sx={{ width: '100%' }}>
          Please fill all the required fields
        </Alert>
      </Snackbar>
      <Grid container spacing={1.5} justifyContent="center" alignItems="center" >
        <Header volunteerName={volunteerName} eventName={event.name} eventDate={formatDate(event.date)}
          title="Potential Sahabhagi Feedback" />
        <Question value="Status" change={handleState} name="status" defaultVal={state.status} />
        <Question value="Recommendation/Remarks" change={handleState} name="recommendation" defaultVal={state.recommendation} />
        <Question value="Remarks" change={handleState} name="remarks" error={state.errors.remarks} defaultVal={state.remarks} />
        <Grid item xs={12} sm={8} md={6} lg={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ maxWidth: 550, mx: "auto" }}>
            <Button variant="contained" onClick={handleUpdate} sx={{ fontsize: '0.75rem' }}>Update</Button>
            <Button variant="text" sx={{ fontsize: '0.75rem' }}>Clear Form</Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  )
}

export default ViewFeedback;
