import { Card, CardContent, CardHeader, Checkbox, Divider, FormControl, Radio, RadioGroup, FormControlLabel, FormGroup, FormLabel, Grid, Stack, TextField, Typography, Button, FormHelperText, Snackbar, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

function AddTFeedback({ viewFeedback, otherInfo, toUpdate, viewFeedbackState }) {
  const location = useLocation();
  const { volunteerName, volunteerId, event, type } = location.state || otherInfo;
  const navigate = useNavigate();
  const [questionnaire, setQuestionnaire] = useState();
  const [feedbackState, setFeedbackState] = useState({});
  const [errorState, setErrorState] = useState({});
  const [errorFilling, setErrorFilling] = useState(false);
  const [updateInfo, setUpdateInfo] = useState({});

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
      setQuestionnaire(resp.data?.feedback[type].questionnaire);
      setUpdateInfo((preState) => ({
        ...preState,
        status: resp.data?.feedback[type].status,
        recommendation: resp.data?.feedback[type].recommendation
      }))
    });
    if (viewFeedback && viewFeedbackState) {
      setFeedbackState(viewFeedbackState);
    }
  }, []);

  const formatDate = (date) => {
    if (!date) return '';
    return dayjs(date).format('Do MMMM YYYY');
  }

  const handleChange = (e, questionId) => {
    const { type, value, checked } = e.target;

    setFeedbackState((prevState) => {
      if (type === 'checkbox') {
        const currentSelectedValues = prevState[questionId]?.selectedOptions || [];
        return {
          ...prevState,
          [questionId]: {
            selectedOptions: checked ?
              [...currentSelectedValues, value] :
              currentSelectedValues.filter(val => val !== value)
          }
        };
      } else if (type === 'radio') {
        return {
          ...prevState,
          [questionId]: {
            selectedOptions: [value]
          }
        };
      } else if (type === 'text') {
        return {
          ...prevState,
          [questionId]: {
            answer: value
          }
        };
      }
    });
  }

  const handleUpdate = (e, name) => {
    setUpdateInfo((preState) => ({
      ...preState,
      [name]: e.target.value
    }))
  }

  const validateForm = () => {
    let isValid = true;
    const newErrorState = {};

    questionnaire.forEach((questionObj) => {
      if (questionObj.type === 'multiple-choice' || questionObj.type === 'single-choice') {
        if (!feedbackState[questionObj._id] || feedbackState[questionObj._id].selectedOptions.length === 0) {
          newErrorState[questionObj._id] = true;
          isValid = false;
        }
      } else if (questionObj.type === 'long-answer') {
        if (!feedbackState[questionObj._id] || !feedbackState[questionObj._id].answer) {
          newErrorState[questionObj._id] = true;
          isValid = false;
        }
      }
    });

    setErrorState(newErrorState);
    return isValid;
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      const answers = [];
      for (const [index, [key, value]] of Object.entries(Object.entries(feedbackState))) {
        answers.push({
          questionId: key,
          selectedOptions: value.selectedOptions,
          answer: value.answer
        })
      }
      try {
        if (!toUpdate) {
          const resp = await axios({
            method: 'post',
            url: 'http://localhost:3000/feedback/create',
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            data: {
              volunteerId: volunteerId,
              eventId: event._id,
              answers: answers
            }
          });
          console.log('Feeback Submitted', resp.data);
          alert('Feedback Submitted');
          navigate(`/events/${event._id}`);
        }
        else {
          const resp = await axios({
            method: 'post',
            url: 'http://localhost:3000/feedback/create',
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            data: {
              volunteerId: volunteerId,
              eventId: event._id,
              answers: answers,
              toUpdate: true,
              updateInfo: updateInfo
            }
          });
          console.log('Feedback Updated', resp.data);
          alert('Feedback Updated');
        }
      }
      catch (err) {
        console.log('Error while submitting ' + err);
      }
    } else {
      setErrorFilling(true);
    }
  }

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setErrorFilling(false);
  }

  return (
    <>
      <Snackbar open={errorFilling} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity="error" variant="filled" sx={{ width: '100%' }}>
          Please fill all the required fields
        </Alert>
      </Snackbar>
      <Grid container spacing={1.5} justifyContent="center" alignItems="flex-start" style={{ minHeight: '100vh', position: 'relative' }}>
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
                  error={errorState[questionObj._id]}
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
                  error={errorState[questionObj._id]}
                />
              );
            } else if (questionObj.type === 'long-answer') {
              return (
                <Question
                  key={questionObj._id}
                  question={questionObj.question}
                  change={(e) => handleChange(e, questionObj._id)}
                  defaultVal={feedbackState[questionObj._id]?.answer || ''}
                  error={errorState[questionObj._id]}
                />
              );
            }
            return null;
          })
          :
          <span>Loading...</span>
        }
        {toUpdate && (
          <Grid item xs={12} md={4} sx={{ position: 'sticky', top: '16px', alignSelf: 'flex-start' }}>
            <Stack spacing={2}>
              <UpdateQuestion question="Status" change={(e) => { handleUpdate(e, 'status') }} defaultVal={updateInfo.status ? updateInfo.status : ''} />
              <UpdateQuestion question="Recommendation" change={(e) => { handleUpdate(e, 'recommendation') }}
                defaultVal={updateInfo.recommendation ? updateInfo.recommendation : ''} />
            </Stack>
          </Grid>
        )}
        <Grid item xs={12} sm={8} md={6} lg={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ maxWidth: '36vw', mx: "auto" }}>
            <Button variant="contained" onClick={handleSubmit} sx={{ fontsize: '0.75rem' }}>{toUpdate ? 'Update' : 'Submit'}</Button>
            <Button variant="text" sx={{ fontsize: '0.75rem' }}>Clear Form</Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}

export function Header({ volunteerName, eventName, eventDate }) {
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

export function Question({ question, change, error, defaultVal }) {
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
  );
}

function UpdateQuestion({ question, change, defaultVal }) {
  return (
    <Card sx={{ maxWidth: 550, mx: "auto" }}>
      <CardContent sx={{ padding: 2 }}>
        <Stack direction="column" spacing={1}>
          <Typography variant="subtitle1">
            {question}
          </Typography>
          <TextField required label="Your answer" variant="standard" onChange={change}
            value={defaultVal ? defaultVal : ""} InputLabelProps={{ shrink: true }}></TextField>
        </Stack>
      </CardContent>
    </Card>
  );
}

function MultipleChoice({ question, options, selectedOptions, change, error }) {
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
                ))}
              </FormGroup>
            </FormControl>
            {error ? <FormHelperText>This is a required field...</FormHelperText> : <></>}
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
}

function SingleChoice({ question, options, selectedOption, change, error }) {
  return (
    <Grid item xs={12} sm={8} md={6} lg={12}>
      <Card sx={{ maxWidth: 550, mx: "auto" }}>
        <Divider />
        <CardContent sx={{ padding: 2 }}>
          <Stack direction="column" spacing={1}>
            <Typography variant="subtitle1">
              {question}
            </Typography>
            <FormControl error={error}>
              <RadioGroup value={selectedOption} onChange={change}>
                {options.map((choice) => (
                  <FormControlLabel key={choice._id} value={choice.name} control={<Radio />} label={choice.name}
                    sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.9rem' } }} />
                ))}
              </RadioGroup>
              {error ? <FormHelperText>This is a required field...</FormHelperText> : <></>}
            </FormControl>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
}

export default AddTFeedback;

