import { Card, CardContent, CardHeader, Checkbox, Divider, FormControl, Radio, RadioGroup, FormControlLabel, FormGroup, FormLabel, Grid, Stack, TextField, Typography, Button, FormHelperText, Snackbar, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

function AddTFeedback({ viewFeedback, otherInfo, toUpdate }) {
  const location = useLocation();
  const { volunteerName, volunteerId, event, type } = location.state || otherInfo;
  const navigate = useNavigate();
  const [questionnaire, setQuestionnaire] = useState();
  const [feedbackState, setFeedbackState] = useState({});
  useEffect(() => {
    axios({
      method: 'get',
      url: `http://localhost:3000/feedback/questions/${type}`,
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('token')
      },
      params: {
        "volunteerId": volunteerId,
        "eventId": event._id
      }
    }).then((resp) => {

      setQuestionnaire(resp.data.feedback[type].questionnaire)
    });
  }, []);
  const formatDate = (date) => {
    if (!date)
      return '';
    return dayjs(date).format('Do MMMM YYYY');
  }
  const handleChange = (e, questionId) => {
    const { type, value, checked } = e.target;
    if (type === 'checkbox') {
      setFeedbackState((preFeedbackState) => {
        const currentSelectedValues = feedbackState[questionId]?.selectedOptions || [];
        return {
          ...preFeedbackState,
          [questionId]: {
            selectedOptions: checked ?
              [...currentSelectedValues, value] :
              currentSelectedValues.filter(val => val !== value)
          }
        }
      })
    } else if (type === 'radio') {
      setFeedbackState((preFeedbackState) => ({
        ...preFeedbackState,
        [questionId]: {
          selectedOptions: [value]
        }
      }));
    } else if (type === 'text') {
      setFeedbackState((preFeedbackState) => ({
        ...preFeedbackState,
        [questionId]: {
          answer: value
        }
      }))
    }
    console.log(feedbackState);
  }

  return (
    <>
      <Grid container spacing={1.5} justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
        <Header volunteerName={volunteerName} eventName={event.name} eventDate={formatDate(event.date)} />
        {questionnaire ?
          questionnaire.map((questionObj) => {
            if (questionObj.type === 'single-choice') {
              return (
                <SingleChoice
                  key={questionObj._id}
                  question={questionObj.question}
                  options={questionObj.options}
                  selectedOption={feedbackState[questionObj._id]?.selectedOptions[0] || ''}
                  change={(e) => handleChange(e, questionObj._id)}
                />
              );
            } else if (questionObj.type === 'multiple-choice') {
              return (
                <MultipleChoice
                  key={questionObj._id}
                  question={questionObj.question}
                  options={questionObj.options}
                  selectedOptions={feedbackState[questionObj._id]?.selectedOptions || []}
                  change={(e) => handleChange(e, questionObj._id)}
                />
              )
            } else if (questionObj.type === 'long-answer') {
              return (
                <Question
                  key={questionObj._id}
                  question={questionObj.question}
                  change={(e) => handleChange(e, questionObj._id)}
                  defaultVal={feedbackState[questionObj._id]?.answer || ''}
                />
              )
            }
            return null;
          })
          :
          <span>Loading...</span>
        }
      </Grid>
    </>
  )
  {/* <> */ }
  {/*   <Snackbar open={errorFilling} autoHideDuration={6000} onClose={handleAlertClose}> */ }
  {/*     <Alert onClose={handleAlertClose} severity="error" variant="filled" sx={{ width: '100%' }}> */ }
  {/*       Please fill all the required fields */ }
  {/*     </Alert> */ }
  {/*   </Snackbar> */ }
  {/*   <Grid container spacing={1.5} justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}> */ }
  {/*     {toUpdate ? */ }
  {/*       <> */ }
  {/*         <Question value="Status" change={handleState} name="status" defaultVal={state.status} /> */ }
  {/*         <Question value="Recommendation/Remarks" change={handleState} name="recommendation" defaultVal={state.recommendation} /> */ }
  {/*       </> */ }
  {/*       : <></> */ }
  {/*     } */ }
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

function Header({ volunteerName, eventName, eventDate }) {
  return (
    <Grid item xs={12} sm={8} md={6} lg={12}>
      <Card sx={{ maxWidth: 550, mx: "auto" }}>
        <CardHeader
          title="Sadhguru Sahabhagi Trainees Feedback - Observation Phase" />
        <CardContent>
          <Typography>
            Sadhguru Sahabhagi Name : {volunteerName}
          </Typography>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" component="div">
              Event name: {eventName}
            </Typography>
            <Typography variant="body2" component="div">
              Date : {eventDate}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
}

function Question({ question, change, error, defaultVal }) {
  return (
    <Grid item xs={12} sm={8} md={6} lg={12}>
      <Card sx={{ maxWidth: 550, mx: "auto" }}>
        <CardContent sx={{ padding: 2 }}>
          <Stack direction="column" spacing={1}>
            <Typography variant="subtitle1">
              {question}
            </Typography>
            <TextField required label="Your answer" variant="standard" onChange={change}
              error={error} helperText={error ? "This field is required" : ""}
              value={defaultVal ? defaultVal : ""} InputLabelProps={{ shrink: true }}></TextField>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  )
}

function MultipleChoice({ question, options, selectedOptions, change }) {
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
                {options.map((choice) => (
                  <FormControlLabel key={choice._id}
                    control={<Checkbox checked={selectedOptions.includes(choice.name)} onChange={change} name={choice.name} value={choice.name} />}
                    label={choice.name}
                    sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.9rem' } }}
                  />
                )
                )}
              </FormGroup>
            </FormControl>
          </Stack>
        </CardContent>
      </Card>
    </Grid>

  )
}
function SingleChoice({ question, options, selectedOption, change, error }) {
  return (
    <Grid item xs={12} sm={8} md={6} lg={12}>
      <Card sx={{ maxWidth: 550, mx: "auto" }}>
        <CardContent>
          <Typography variant="subtitle1">
            {question}
          </Typography>
          <FormControl component="fieldset" error={error}>
            <RadioGroup aria-label="choices" name={question} value={selectedOption} onChange={change}>
              {options.map((choice) => {
                return (
                  <FormControlLabel
                    key={choice._id}
                    value={choice.name}
                    control={<Radio />}
                    sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.9rem' } }}
                    label={choice.name} />
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
