import { Card, CardContent, CardHeader, Checkbox, Divider, FormControl, Radio, RadioGroup, FormControlLabel, FormGroup, FormLabel, Grid, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useLocation } from "react-router-dom";

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

function AddFeedback() {
  const location = useLocation();
  const { volunteerName, volunteerId, event } = location.state || {};
  console.log(volunteerName, volunteerId, event);
  const [areas, setAreas] = useState({
    choice1: false, choice2: false, choice3: false, choice4: false, choice5: false, choice6: false, choice7: false, choice8: false, choice9: false, choice10: false
  });
  const [handleActivities, setHandleActivities] = useState('');
  const [available, setAvailable] = useState({
    choice1: false, choice2: false, choice3: false, chioce4: false, choice5: false, choice6: false
  });



  function handleAreaChoice(event) {
    setAreas({
      ...areas,
      [event.target.name]: event.target.checked
    });
  }
  function handleActivity(event) {
    setHandleActivities(event.target.value);
  }
  function handleAvailableChoice(event) {
    setAvailable({
      ...available,
      [event.target.name]: event.target.checked
    });
  }
  // const handleSubmit = () => {
  //     const selectedChoices = Object.keys(choices).filter(choice => choices[choice]);
  //     console.log('Selected Choices:', selectedChoices);
  //   };
  return (
    <>
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
                  Date: {event.date}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <MultipleChoice question="Which area were they co-ordinating?" array={AREA_CHOICES} handleChoice={handleAreaChoice} choices={areas} />
        <SingleChoice question="How did they handle the activity?" array={HANDLE_ACTIVITY} change={handleActivity} state={handleActivities} />
        <Question volue="Could you elaborate?" />
        <SingleChoice question="Are they able to effectively communicate with volunteers, keep them together & get the activity done?" array={HANDLE_ACTIVITY}
          state={handleActivities} change={handleActivity} />
        <Question value="Could you elaborate?" />
        <SingleChoice question="Are they able to assign right activity to the right person?" array={ASSIGN_ACTIVITY}
          state={handleActivities} change={handleActivity} />
        <Question value="Could you elaborate?" />
        <SingleChoice question="Are they willing to listen to the Organisers / Ishanga instructions and act in accordance with the same?" array={LISTEN}
          state={handleActivities} change={handleActivity} />
        <Question value="Could you elaborate?" />
        <SingleChoice question="Are they able to stretch physically  as per the program's requirement?" array={STRETCH}
          state={handleActivities} change={handleActivity} />
        <Question value="Could you elaborate?" />
        <MultipleChoice question="Are they committed to the program schedule & available for what is needed for the program?" array={AVAILABLE}
          handleChoice={handleAvailableChoice} choices={available} />
        <Question value="If Others please specify" />
        <Question value="Could you elaborate?" />
        <SingleChoice question="Overall Feedback" array={OVERALL}
          state={handleActivities} change={handleActivity} />
        <Question value="Other Remarks (Anything else you'd like the training team to know.)" />
      </Grid>
    </>
  )
}

function Question(prop) {
  return (
    <Grid item xs={12} sm={8} md={6} lg={12}>
      <Card sx={{ maxWidth: 550, mx: "auto" }}>
        <CardContent sx={{ padding: 2 }}>
          <Stack direction="column" spacing={1}>
            <Typography variant="subtitle1">
              {prop.value}
            </Typography>
            <TextField required label="Your answer" variant="standard"></TextField>
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
                    <FormControlLabel
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
function SingleChoice({ question, array, change, state }) {
  return (
    <Grid item xs={12} sm={8} md={6} lg={12}>
      <Card sx={{ maxWidth: 550, mx: "auto" }}>
        <CardContent>
          <Typography variant="subtitle1">
            {question}
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup aria-label="choices" name="choices" value={state} onChange={change}>
              {array.map((choice, index) => {
                return (
                  <FormControlLabel value={`choice${index + 1}`} control={<Radio />} sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.9rem' } }} label={choice} />
                )
              })}
            </RadioGroup>
          </FormControl>
        </CardContent>
      </Card>
    </Grid>
  )
}


export default AddFeedback;
