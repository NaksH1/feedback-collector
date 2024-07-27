import { Card, CardContent, CardHeader, Checkbox, Divider, FormControl, Radio, RadioGroup, FormControlLabel, FormGroup, FormLabel, Grid, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useLocation } from "react-router-dom";



function AddFeedback() {
  const location = useLocation();
  const { volunteerName, volunteerId, event } = location.state || {};
  console.log(volunteerName, volunteerId, event);
  const [choices, setChoices] = useState({
    choice1: false, choice2: false, choice3: false, choice4: false, choice5: false, choice6: false, choice7: false, choice8: false, choice9: false, choice10: false
  });
  const [selectedValue, setSelectedValue] = useState('');
  function handleActivity(event) {
    setSelectedValue(event.target.value);
  }
  function handleAreaChoice(event) {
    setChoices({
      ...choices,
      [event.target.name]: event.target.checked
    });
    // const handleSubmit = () => {
    //     const selectedChoices = Object.keys(choices).filter(choice => choices[choice]);
    //     console.log('Selected Choices:', selectedChoices);
    //   };
  }
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
        <Grid item xs={12} sm={8} md={6} lg={12}>
          <Card sx={{ maxWidth: 550, mx: "auto" }}>
            <Divider />
            <CardContent sx={{ padding: 2 }}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle1">
                  Which area were they co-ordinating?
                </Typography>
                <FormControl component="fieldset">
                  {/* <FormLabel component="legend">Select your choices</FormLabel> */}
                  <FormGroup>
                    <AreaChoice choices={choices} choiceName="choice1" handleAreaChoice={handleAreaChoice} label="Hall set-up" />
                    <AreaChoice choices={choices} choiceName="choice2" handleAreaChoice={handleAreaChoice} label="Ushering" />
                    <AreaChoice choices={choices} choiceName="choice3" handleAreaChoice={handleAreaChoice} label="Dining" />
                    <AreaChoice choices={choices} choiceName="choice4" handleAreaChoice={handleAreaChoice} label="Foodshifting" />
                    <AreaChoice choices={choices} choiceName="choice5" handleAreaChoice={handleAreaChoice} label="Inside Hall" />
                    <AreaChoice choices={choices} choiceName="choice6" handleAreaChoice={handleAreaChoice} label="Full Co-support to Ishanga organiser" />
                    <AreaChoice choices={choices} choiceName="choice7" handleAreaChoice={handleAreaChoice} label="Coordinator for hall" />
                    <AreaChoice choices={choices} choiceName="choice8" handleAreaChoice={handleAreaChoice} label="Coordinator for Dining" />
                    <AreaChoice choices={choices} choiceName="choice9" handleAreaChoice={handleAreaChoice} label="Independently under Ishanga observation" />
                    <AreaChoice choices={choices} choiceName="choice10" handleAreaChoice={handleAreaChoice} label="Others" />
                  </FormGroup>
                </FormControl>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={8} md={6} lg={12}>
          <Card sx={{ maxWidth: 550, mx: "auto" }}>
            <CardContent>
              <Typography variant="subtitle1">
                How did they handle the activity?
              </Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="choices"
                  name="choices"
                  value={selectedValue}
                  onChange={handleActivity}
                >
                  <FormControlLabel value="choice1" control={<Radio />} sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.9rem' } }} label="They were able to do it independently" />
                  <FormControlLabel value="choice2" control={<Radio />} sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.9rem' } }} label="They could manage well" />
                  <FormControlLabel value="choice3" control={<Radio />} sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.9rem' } }} label="They need to improve" />
                  <FormControlLabel value="choice4" control={<Radio />} sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.9rem' } }} label="They struggle with it" />
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>
        <Question value="How did they handle the activity?" />
        <Question value="Can you elaborate?" />
        <Question value="Are they able to effectively communicate with volunteers, keep them together & get the activity done?" />
        <Question value="Can you elaborate?" />
        <Question value="Are they able to assign right activity to the right person?" />
        <Question value="Can you elaborate?" />
        <Question value="Are they willing to listen to the Organisers / Ishanga instructions and act in accordance with the same?" />
        <Question value="Can you elaborate?" />
        <Question value="Are they able to stretch physically as per the program's requirement?" />
        <Question value="Can you elaborate?" />
        <Question value="Are they committed to the program schedule & available for what is needed for the program?" />
        <Question value="Can you elaborate?" />
        <Question value="Overall Feedback" />
        <Question value="Other Remarks (Anything else you'd like the training team to know.)" />
      </Grid>
    </>
  )
}

function Question(prop) {
  return (
    <Grid item xs={12} sm={8} md={6} lg={12}>
      <Card sx={{ maxWidth: 550, mx: "auto" }}>
        <Divider />
        <CardContent sx={{ padding: 2 }}>
          <Stack direction="column" spacing={1}>
            <Typography variant="subtitle1">
              {prop.value}
            </Typography>
            <TextField label="Your answer" variant="standard"></TextField>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  )
}

function AreaChoice({ choices, choiceName, handleAreaChoice, label }) {
  return (
    <FormControlLabel
      control={<Checkbox checked={choices.choiceName} onChange={handleAreaChoice} name={choiceName} />}
      label={label}
      sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.9rem' } }}
    />
  )
}


export default AddFeedback;
