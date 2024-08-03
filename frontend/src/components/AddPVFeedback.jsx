import { Button, Card, CardContent, CardHeader, Divider, FormControl, FormControlLabel, FormHelperText, Grid, Radio, RadioGroup, Stack, TextField, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { Question, SingleChoice } from "./AddFeedback";
import { useState } from "react";

const AREA_CHOICES = [
  'Dining',
  'Ushering',
  'Inside hall',
  'Hall setup',
  'Food Shifting',
  'Audio',
  'Other'
]
const OPTIONS = [
  'Very good',
  'Needs improvement',
  'Not appropriate',
  'Other'
]
const REMARKS = [
  'Need to volunteer for more programs',
  'They can be trained',
  'They are not suitable for training',
  'Other'
]

function AddPVFeedback() {
  const location = useLocation();
  const { volunteerName, volunteerId, event } = location.state || {};
  const navigate = useNavigate();
  const [state, setState] = useState({
    activity: '', presentation: '', communucation: '', fitness: '', commitment: '', remarks: '', train: '', overall: '',
    errors: {
      activity: false, presentation: false, communucation: false, fitness: false, commitment: false, remarks: false, train: false,
      overall: false
    }
  });
  function handleState(e) {
    const { name, value } = e.target;
    setState((preState) => ({
      ...preState,
      [name]: value
    }));
  }
  const formatDate = (date) => {
    if (!date)
      return '';
    return dayjs(date).format('Do MMMM YYYY');
  }
  function handleSubmit(e) {
    e.preventDefault();
    const { activity, presentation, communication, fitness, commitment, remarks, train, overall } = state;
    const newErrors = {
      activity: !activity, presentation: !presentation, communication: !communication, fitness: !fitness,
      commitment: !commitment, remarks: !remarks, train: !train, overall: !overall
    }
    setState((preState) => ({ ...preState, errors: newErrors }));
    const handleError = Object.values(newErrors).some(err => err);
    if (handleError) {
      alert("Please fill all the required fields");
      return;
    }
    axios({
      method: 'post',
      url: 'http://localhost:3000/feedback',
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      data: {
        volunteerId: volunteerId,
        eventId: event._id,
        type: 'programVolunteer',
        programVolunteer: state
      }
    }).then((resp) => {
      console.log(resp.data);
      navigate(`/event/${event._id}`);
    })
  }

  return (

    <>
      <Grid container spacing={1.5} justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
        <Grid item xs={12} sm={8} md={6} lg={12}>
          <Card sx={{ maxWidth: 550, mx: "auto" }}>
            <CardHeader
              title="Program volunteer Observation form(pre-Org training)"
            />
            <Divider />
            <CardContent>
              <Typography>
                Program Volunteer Name : {volunteerName}
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

        <Single question="Area of activity" array={AREA_CHOICES} change={handleState}
          state={state.activity} name="activity" error={state.errors.activity} />
        <Question value="Presentation(Appearance, dress code, body language)" change={handleState} name="comment1" error={state.errors.comment1} />
        <Single question="Communication(Interaction with volunteers)" array={OPTIONS} change={handleState}
          state={state.activity} name="activity" error={state.errors.activity} />
        <Single question="Physical fitness(Are they able to stretch themselves)" array={OPTIONS} change={handleState}
          state={state.activity} name="activity" error={state.errors.activity} />
        <Single question="Commitment and willingness towards activity" array={OPTIONS} change={handleState}
          state={state.activity} name="activity" error={state.errors.activity} />
        <Single question="Remarks" array={REMARKS} change={handleState}
          state={state.activity} name="activity" error={state.errors.activity} />
        <Single question="If they can be trained which Area of activity do you think they will fit best?" array={AREA_CHOICES} change={handleState}
          state={state.activity} name="activity" error={state.errors.activity} />
        <Question value="Overall Feedback" change={handleState} name="comment1" error={state.errors.comment1} />
        <Grid item xs={12} sm={8} md={6} lg={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ maxWidth: 550, mx: "auto" }}>
            <Button variant="contained" onClick={handleSubmit} sx={{ fontsize: '0.75rem' }}>Submit</Button>
            <Button variant="text" sx={{ fontsize: '0.75rem' }}>Clear Form</Button>
          </Stack>
        </Grid>

      </Grid>

    </>
  );


}


function Single({ question, array, change, state, name, error }) {
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
            {state === 'Other' ? <TextField label="Other" variant="standard" sx={{ width: 500 }} onChange={change} /> : <></>}
          </FormControl>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default AddPVFeedback;
