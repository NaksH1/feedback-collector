import { Card, CardContent, CardHeader, Checkbox, Divider, FormControl, Radio, RadioGroup, FormControlLabel, FormGroup, FormLabel, Grid, Stack, TextField, Typography, Button, FormHelperText, Snackbar, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

function AddTFeedback({ viewFeedback, otherInfo, toUpdate }) {
  const location = useLocation();
  // const { volunteerName, volunteerId, event } = location.state || otherInfo;
  const navigate = useNavigate();
  const type = 'training';
  const [state, setState] = useState();
  useEffect(() => {
    axios({
      method: 'get',
      url: `http://localhost:3000/feedback/questions/${type}`,
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('token')
      }
    }).then((resp) => {
      console.log(resp.data);
    });
  })
  return (
    <>
      <span>Demo</span>
    </>
  )
  {/* <> */ }
  {/*   <Snackbar open={errorFilling} autoHideDuration={6000} onClose={handleAlertClose}> */ }
  {/*     <Alert onClose={handleAlertClose} severity="error" variant="filled" sx={{ width: '100%' }}> */ }
  {/*       Please fill all the required fields */ }
  {/*     </Alert> */ }
  {/*   </Snackbar> */ }
  {/*   <Grid container spacing={1.5} justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}> */ }
  {/*     <Grid item xs={12} sm={8} md={6} lg={12}> */ }
  {/*       <Card sx={{ maxWidth: 550, mx: "auto" }}> */ }
  {/*         <CardHeader */ }
  {/*           title="Sadhguru Sahabhagi Trainees Feedback- Observation Phase" */ }
  {/*         /> */ }
  {/*         <Divider /> */ }
  {/*         <CardContent> */ }
  {/*           <Typography> */ }
  {/*             Sadhguru Sahabhagi Name : {volunteerName} */ }
  {/*           </Typography> */ }
  {/*           <Stack direction="row" justifyContent="space-between"> */ }
  {/*             <Typography variant="body2" component="div"> */ }
  {/*               Event Name: {event.name} */ }
  {/*             </Typography> */ }
  {/*             <Typography variant="body2" component="div"> */ }
  {/*               Date: {formatDate(event.date)} */ }
  {/*             </Typography> */ }
  {/*           </Stack> */ }
  {/*         </CardContent> */ }
  {/*       </Card> */ }
  {/*     </Grid> */ }
  {/*     {toUpdate ? */ }
  {/*       <> */ }
  {/*         <Question value="Status" change={handleState} name="status" defaultVal={state.status} /> */ }
  {/*         <Question value="Recommendation/Remarks" change={handleState} name="recommendation" defaultVal={state.recommendation} /> */ }
  {/*       </> */ }
  {/*       : <></> */ }
  {/*     } */ }
  {/*     <MultipleChoice question="Which area were they co-ordinating?" array={AREA_CHOICES} handleChoice={handleState} choices={state.areas} /> */ }
  {/*     <SingleChoice question="How did they handle the activity?" array={HANDLE_ACTIVITY} change={handleState} */ }
  {/*       state={state.activity} name="activity" error={state.errors.activity} /> */ }
  {/*     <Question value="Could you elaborate?" change={handleState} name="comment1" error={state.errors.comment1} defaultVal={state.comment1} /> */ }
  {/*     <SingleChoice question="Are they able to effectively communicate with volunteers, keep them together & get the activity done?" array={HANDLE_ACTIVITY} */ }
  {/*       state={state.communicate} change={handleState} name="communicate" error={state.errors.communicate} /> */ }
  {/*     <Question value="Could you elaborate?" change={handleState} name="comment2" error={state.errors.comment2} defaultVal={state.comment2} /> */ }
  {/*     <SingleChoice question="Are they able to assign right activity to the right person?" array={ASSIGN_ACTIVITY} */ }
  {/*       state={state.assign} change={handleState} name="assign" error={state.errors.assign} /> */ }
  {/*     <Question value="Could you elaborate?" change={handleState} name="comment3" error={state.errors.comment3} defaultVal={state.comment3} /> */ }
  {/*     <SingleChoice question="Are they willing to listen to the Organisers / Ishanga instructions and act in accordance with the same?" array={LISTEN} */ }
  {/*       state={state.listen} change={handleState} name="listen" error={state.errors.listen} /> */ }
  {/*     <Question value="Could you elaborate?" change={handleState} name="comment4" error={state.errors.comment5} defaultVal={state.comment4} /> */ }
  {/*     <SingleChoice question="Are they able to stretch physically as per the program's requirement?" array={STRETCH} */ }
  {/*       state={state.stretch} change={handleState} name="stretch" error={state.errors.stretch} /> */ }
  {/*     <Question value="Could you elaborate?" change={handleState} name="comment5" error={state.errors.comment5} defaultVal={state.comment5} /> */ }
  {/*     <MultipleChoice question="Are they committed to the program schedule & available for what is needed for the program?" array={AVAILABLE} */ }
  {/*       handleChoice={handleState} choices={state.available} error={state.errors.available} /> */ }
  {/*     <Question value="If Others please specify" change={handleState} name="others" error={state.errors.others} defaultVal={state.others} /> */ }
  {/*     <Question value="Could you elaborate?" change={handleState} name="comment6" error={state.errors.comment6} defaultVal={state.comment6} /> */ }
  {/*     <SingleChoice question="Overall Feedback" array={OVERALL} */ }
  {/*       state={state.overall} change={handleState} name="overall" error={state.errors.overall} /> */ }
  {/*     <Question value="Other Remarks (Anything else you'd like the training team to know.)" change={handleState} name="remarks" */ }
  {/*       error={state.errors.remarks} defaultVal={state.remarks} /> */ }
  {/*     <Grid item xs={12} sm={8} md={6} lg={12}> */ }
  {/*       {toUpdate ? */ }
  {/*         <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ maxWidth: 550, mx: "auto" }}> */ }
  {/*           <Button variant="contained" onClick={handleUpdate} sx={{ fontsize: '0.75rem' }}>Update</Button> */ }
  {/*           <Button variant="text" sx={{ fontsize: '0.75rem' }}>Clear Form</Button> */ }
  {/*         </Stack> */ }
  {/*         : */ }
  {/*         <> */ }
  {/*           <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ maxWidth: 550, mx: "auto" }}> */ }
  {/*             <Button variant="contained" onClick={handleSubmit} sx={{ fontsize: '0.75rem' }}>Submit</Button> */ }
  {/*             <Button variant="text" sx={{ fontsize: '0.75rem' }}>Clear Form</Button> */ }
  {/*           </Stack> */ }
  {/*         </> */ }
  {/*       } */ }
  {/*     </Grid> */ }
  {/*   </Grid> */ }
  {/**/ }
  {/* </> */ }
}

function Question({ value, change, name, error, defaultVal }) {
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
function SingleChoice({ question, array, change, state, name, error }) {
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


export default AddTFeedback;
