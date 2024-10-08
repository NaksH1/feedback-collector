import { Card, CardContent, CardHeader, Checkbox, Divider, FormControl, Radio, RadioGroup, FormControlLabel, FormGroup, FormLabel, Grid, Stack, TextField, Typography, Button, FormHelperText, Snackbar, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

const AREA_CHOICES = [
  "Hall set-up",
  "Ushering",
  "Dining",
  "Foodshifting",
  "Inside Hall",
  "Full Co-support to Ishanga organiser",
  "Coordinator for hall",
  "Coordinator for Dining",
  "Independently under Ishanga observation",
  "Others"
];

const HANDLE_ACTIVITY = [
  "They were able to do it independently",
  "They could manage well",
  "They need to improve",
  "They struggle with it"
];

const ASSIGN_ACTIVITY = [
  "They were able to do it independently",
  "They managed well",
  "They need to improve",
  "They struggled with it",
  "Not Applicable"
]

const LISTEN = [
  "Willing to listen and act",
  "Unwilling to listen and act",
  "Has resistance"
]
const STRETCH = [
  "Able to stretch physically",
  "Struggling physically"
]

const AVAILABLE = [
  "On time for meetings",
  "On time for activity",
  "Missing during meetings",
  "Missing during activity",
  "More focused on sadhana",
  "Others"
]

const OVERALL = [
  "Can be trained for program organising.",
  "Need more programs for volunteering.",
  "Can do the next full program Org independently under Ishanga observation",
  "Can do the next program Hall Coordination independently",
  "Con do the next program Dining Coordination independently",
  "Cannot be trained"
]

function AddFeedback({ viewFeedback, otherInfo, toUpdate }) {
  const location = useLocation();
  const { volunteerName, volunteerId, event } = location.state || otherInfo;
  const navigate = useNavigate();
  const [state, setState] = useState({
    areas: {
      choice1: false, choice2: false, choice3: false, choice4: false, choice5: false,
      choice6: false, choice7: false, choice8: false, choice9: false, choice10: false
    },
    activity: '', comment1: '', communicate: '', comment2: '', assign: '', comment3: '',
    listen: '', comment4: '', stretch: '', comment5: '',
    available: {
      achoice1: false, achoice2: false, achoice3: false, achoice4: false, achoice5: false,
      achoice6: false
    }, others: '', comment6: '', overall: '', remarks: '', status: '', recommendation: '',
    errors: {
      activity: false, comment1: false, communicate: false, comment2: false, assign: false, comment3: false,
      listen: false, comment4: false, stretch: false, comment5: false, others: false, comment6: false,
      overall: false, remarks: false
    }
  });
  const [errorFilling, setErrorFilling] = useState(false);
  useEffect(() => {
    if (viewFeedback && viewFeedback.training) {
      setState((prevState) => ({
        ...prevState,
        areas: viewFeedback.training.areas || prevState.areas,
        activity: viewFeedback.training.activity || prevState.activity,
        comment1: viewFeedback.training.comment1 || prevState.comment1,
        communicate: viewFeedback.training.communicate || prevState.communicate,
        comment2: viewFeedback.training.comment2 || prevState.comment2,
        assign: viewFeedback.training.assign || prevState.assign,
        comment3: viewFeedback.training.comment3 || prevState.comment3,
        listen: viewFeedback.training.listen || prevState.listen,
        comment4: viewFeedback.training.comment4 || prevState.comment4,
        stretch: viewFeedback.training.stretch || prevState.stretch,
        comment5: viewFeedback.training.comment5 || prevState.comment5,
        available: viewFeedback.training.available || prevState.available,
        others: viewFeedback.training.others || prevState.others,
        comment6: viewFeedback.training.comment6 || prevState.comment6,
        overall: viewFeedback.training.overall || prevState.overall,
        remarks: viewFeedback.training.remarks || prevState.remarks,
        status: viewFeedback.training.status || prevState.status,
        recommendation: viewFeedback.training.recommendation || prevState.recommendation
      }));
    }
  }, [viewFeedback])
  function handleState(e) {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox' && name.startsWith('choice')) {
      setState((preState) => ({
        ...preState,
        areas: {
          ...preState.areas,
          [name]: checked
        }
      }));
    } else if (name.startsWith('achoice')) {
      setState((preState) => ({
        ...preState,
        available: {
          ...preState.available,
          [name]: checked
        }
      }));
    } else {
      setState((preState) => ({
        ...preState,
        [name]: value
      }));
    }

  }
  async function handleSubmit(e) {
    e.preventDefault();
    const { activity, comment1, communicate, comment2, assign, comment3, listen,
      comment4, stretch, comment5, comment6, overall, remarks } = state;
    console.log(state);
    const newErrors = {
      activity: !activity, comment1: !comment1, communicate: !communicate, comment2: !comment2, assign: !assign,
      comment3: !comment3, listen: !listen, comment4: !comment4, stretch: !stretch, comment5: !comment5,
      overall: !overall, comment6: !comment6, remarks: !remarks
    }
    setState(prevState => ({ ...prevState, errors: newErrors }));
    const hasErrors = Object.values(newErrors).some(error => error);
    if (hasErrors) {
      setErrorFilling(true);
      return;
    }
    const resp = await axios({
      method: "post",
      url: "http://localhost:3000/feedback",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      data: {
        eventId: event._id,
        volunteerId: volunteerId,
        type: 'training',
        training: state
      }
    })
    alert('feedback submitted');
    console.log(resp);
    navigate(`/events/${event._id}`);
  }
  async function handleUpdate(e) {
    e.preventDefault();
    const { activity, comment1, communicate, comment2, assign, comment3, listen,
      comment4, stretch, comment5, comment6, overall, remarks } = state;
    console.log(state);
    const newErrors = {
      activity: !activity, comment1: !comment1, communicate: !communicate, comment2: !comment2, assign: !assign,
      comment3: !comment3, listen: !listen, comment4: !comment4, stretch: !stretch, comment5: !comment5,
      overall: !overall, comment6: !comment6, remarks: !remarks
    }
    setState(prevState => ({ ...prevState, errors: newErrors }));
    const hasErrors = Object.values(newErrors).some(error => error);
    if (hasErrors) {
      setErrorFilling(true);
      return;
    }
    const resp = await axios({
      method: 'put',
      url: `http://localhost:3000/feedback/${viewFeedback._id}`,
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      data: {
        type: 'training',
        training: state
      }
    })
    alert('feedback updated');
    console.log(resp);
    navigate(`/events/${event._id}`);

  }
  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway')
      return;
    setErrorFilling(false);
  }
  const formatDate = (date) => {
    if (!date)
      return '';
    return dayjs(date).format('Do MMMM YYYY');
  }
  if (toUpdate && !viewFeedback) {
    return (
      <>
        <span>Loading...</span>
      </>
    )
  }
  else if (toUpdate)
    console.log(state);
  return (
    <>
      <Snackbar open={errorFilling} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity="error" variant="filled" sx={{ width: '100%' }}>
          Please fill all the required fields
        </Alert>
      </Snackbar>
      <Grid container spacing={1.5} justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
        <Grid item xs={12} sm={8} md={6} lg={12}>
          <Card sx={{ maxWidth: 550, mx: "auto" }}>
            <CardHeader
              title="Sadhguru Sahabhagi Trainees Feedback- Observation Phase"
            />
            <Divider />
            <CardContent>
              <Typography>
                Sadhguru Sahabhagi Name : {volunteerName}
              </Typography>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" component="div">
                  Event Name: {event.name}
                </Typography>
                <Typography variant="body2" component="div">
                  Date: {formatDate(event.date)}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        {toUpdate ?
          <>
            <Question value="Status" change={handleState} name="status" defaultVal={state.status} />
            <Question value="Recommendation/Remarks" change={handleState} name="recommendation" defaultVal={state.recommendation} />
          </>
          : <></>
        }
        <MultipleChoice question="Which area were they co-ordinating?" array={AREA_CHOICES} handleChoice={handleState} choices={state.areas} />
        <SingleChoice question="How did they handle the activity?" array={HANDLE_ACTIVITY} change={handleState}
          state={state.activity} name="activity" error={state.errors.activity} />
        <Question value="Could you elaborate?" change={handleState} name="comment1" error={state.errors.comment1} defaultVal={state.comment1} />
        <SingleChoice question="Are they able to effectively communicate with volunteers, keep them together & get the activity done?" array={HANDLE_ACTIVITY}
          state={state.communicate} change={handleState} name="communicate" error={state.errors.communicate} />
        <Question value="Could you elaborate?" change={handleState} name="comment2" error={state.errors.comment2} defaultVal={state.comment2} />
        <SingleChoice question="Are they able to assign right activity to the right person?" array={ASSIGN_ACTIVITY}
          state={state.assign} change={handleState} name="assign" error={state.errors.assign} />
        <Question value="Could you elaborate?" change={handleState} name="comment3" error={state.errors.comment3} defaultVal={state.comment3} />
        <SingleChoice question="Are they willing to listen to the Organisers / Ishanga instructions and act in accordance with the same?" array={LISTEN}
          state={state.listen} change={handleState} name="listen" error={state.errors.listen} />
        <Question value="Could you elaborate?" change={handleState} name="comment4" error={state.errors.comment5} defaultVal={state.comment4} />
        <SingleChoice question="Are they able to stretch physically as per the program's requirement?" array={STRETCH}
          state={state.stretch} change={handleState} name="stretch" error={state.errors.stretch} />
        <Question value="Could you elaborate?" change={handleState} name="comment5" error={state.errors.comment5} defaultVal={state.comment5} />
        <MultipleChoice question="Are they committed to the program schedule & available for what is needed for the program?" array={AVAILABLE}
          handleChoice={handleState} choices={state.available} error={state.errors.available} />
        <Question value="If Others please specify" change={handleState} name="others" error={state.errors.others} defaultVal={state.others} />
        <Question value="Could you elaborate?" change={handleState} name="comment6" error={state.errors.comment6} defaultVal={state.comment6} />
        <SingleChoice question="Overall Feedback" array={OVERALL}
          state={state.overall} change={handleState} name="overall" error={state.errors.overall} />
        <Question value="Other Remarks (Anything else you'd like the training team to know.)" change={handleState} name="remarks"
          error={state.errors.remarks} defaultVal={state.remarks} />
        <Grid item xs={12} sm={8} md={6} lg={12}>
          {toUpdate ?
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ maxWidth: 550, mx: "auto" }}>
              <Button variant="contained" onClick={handleUpdate} sx={{ fontsize: '0.75rem' }}>Update</Button>
              <Button variant="text" sx={{ fontsize: '0.75rem' }}>Clear Form</Button>
            </Stack>
            :
            <>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ maxWidth: 550, mx: "auto" }}>
                <Button variant="contained" onClick={handleSubmit} sx={{ fontsize: '0.75rem' }}>Submit</Button>
                <Button variant="text" sx={{ fontsize: '0.75rem' }}>Clear Form</Button>
              </Stack>
            </>
          }
        </Grid>
      </Grid>

    </>
  )
}

export function Question({ value, change, name, error, defaultVal }) {
  return (
    <Grid item xs={12} sm={8} md={6} lg={12}>
      <Card sx={{ maxWidth: 550, mx: "auto" }}>
        <CardContent sx={{ padding: 2 }}>
          <Stack direction="column" spacing={1}>
            <Typography variant="subtitle1">
              {value}
            </Typography>
            <TextField required label="Your answer" variant="standard" onChange={change} name={name}
              error={error} helperText={error ? "This field is required" : ""}
              value={defaultVal ? defaultVal : ""} InputLabelProps={{ shrink: true }}></TextField>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  )
}

function MultipleChoice({ question, array, handleChoice, choices }) {
  return (
    <Grid item xs={12} sm={8} md={6} lg={12}>
      <Card sx={{ maxWidth: 550, mx: "auto" }}>
        <Divider />
        <CardContent sx={{ padding: 2 }}>
          <Stack direction="column" spacing={1}>
            <Typography variant="subtitle1">
              {question}
            </Typography>
            <FormControl component="fieldset">
              <FormGroup>
                {array.map((choice, index) => {
                  return (
                    <FormControlLabel key={index}
                      control={<Checkbox checked={choices[`choice${index + 1}`]} onChange={handleChoice} name={`choice${index + 1}`} />}
                      label={choice}
                      sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.9rem' } }}
                    />
                  )
                })}
              </FormGroup>
            </FormControl>
          </Stack>
        </CardContent>
      </Card>
    </Grid>

  )
}
export function SingleChoice({ question, array, change, state, name, error }) {
  return (
    <Grid item xs={12} sm={8} md={6} lg={12}>
      <Card sx={{ maxWidth: 550, mx: "auto" }}>
        <CardContent>
          <Typography variant="subtitle1">
            {question}
          </Typography>
          <FormControl component="fieldset" error={error}>
            <RadioGroup aria-label="choices" name={name} value={state} onChange={change}>
              {array.map((choice, index) => {
                return (
                  <FormControlLabel
                    key={index}
                    value={choice}
                    control={<Radio />}
                    sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.9rem' } }}
                    label={choice} />
                )
              })}
            </RadioGroup>
            {error ? <FormHelperText>This is a required field..</FormHelperText> : <> </>}
          </FormControl>
        </CardContent>
      </Card>
    </Grid>
  )
}


export default AddFeedback;
