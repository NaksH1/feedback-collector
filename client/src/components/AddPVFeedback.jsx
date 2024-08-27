import { Card, CardContent, Divider, FormControl, Radio, RadioGroup, FormControlLabel, Grid, Stack, Typography, Button, FormHelperText, Snackbar, Alert, TextField, CardHeader } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import { Header, Question, UpdateQuestion } from "./AddTFeedback";

function AddPVFeedback({ viewFeedback, otherInfo, toUpdate, viewFeedbackState }) {
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
    });
    if (viewFeedback && viewFeedbackState)
      setFeedbackState(viewFeedbackState);
  }, []);

  const formatDate = (date) => {
    if (!date) return '';
    return dayjs(date).format('Do MMMM YYYY');
  }

  const handleChange = (e, questionId) => {
    const { type, value } = e.target;

    setFeedbackState((prevState) => {
      console.log(type, value);
      if (type === 'radio') {
        return {
          ...prevState,
          [questionId]: {
            ...prevState[questionId] || {},
            selectedOptions: [value]
          }
        };
      } else if (type === 'text') {
        return {
          ...prevState,
          [questionId]: {
            ...prevState[questionId] || {},
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

    }));

  }
  const validateForm = () => {
    let isValid = true;
    const newErrorState = {};

    questionnaire.forEach((questionObj) => {
      if (questionObj.type === 'single-choice') {
        if (!feedbackState[questionObj._id] || feedbackState[questionObj._id].selectedOptions.length === 0 ||
          (feedbackState[questionObj._id].selectedOptions[0] === 'Other' && !feedbackState[questionObj._id].answer)) {
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
        } else {
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
              updateInfo: updateInfo
            }
          });
          console.log('Feedback Updated');
          alert('Feedback Updated')
          navigate(-1)
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
      <Grid container spacing={1.5} justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
        <Grid container spacing={1.5} xs={12} md={8} lg={6} direction="column" sx={{ marginTop: '2vh' }}>
          <Header volunteerName={volunteerName} eventName={event.name} eventDate={formatDate(event.date)}
            title="Program volunteer Observation form(pre-Org training)" />
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
                    defaultVal={feedbackState[questionObj._id]?.answer || ''}
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
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ maxWidth: '36vw', mx: "auto" }}>
              <Button variant="contained" onClick={handleSubmit} sx={{ fontsize: '0.75rem' }}> {toUpdate ? 'Update' : 'Submit'}</Button>
              <Button variant="text" sx={{ fontsize: '0.75rem' }}>Clear Form</Button>
            </Stack>
          </Grid>
        </Grid>
        {toUpdate && (
          <Grid item xs={12} md={4} lg={5} sx={{ position: 'sticky', top: '7vh', alignSelf: 'flex-start' }}>
            <Stack spacing={2}>
              <UpdateQuestion question="Status" change={(e) => { handleUpdate(e, 'status') }} defaultVal={updateInfo.status ? updateInfo.status : ''} />
              <UpdateQuestion question="Recommendation" change={(e) => { handleUpdate(e, 'recommendation') }}
                defaultVal={updateInfo.recommendation ? updateInfo.recommendation : ''} />
            </Stack>
          </Grid>
        )}
      </Grid>
    </>
  );
}

function SingleChoice({ question, options, selectedOption, change, error, defaultVal }) {
  return (
    <Grid item xs={12}>
      <Card sx={{ maxWidth: 550, mx: "auto" }}>
        <Divider />
        <CardHeader sx={{ backgroundColor: '#b39167' }} title={question}
          titleTypographyProps={{ fontSize: '1rem', color: '#fff' }}
        />
        <CardContent sx={{ padding: 2 }}>
          <Stack direction="column" spacing={1}>
            <FormControl error={error}>
              <RadioGroup value={selectedOption} onChange={change}>
                {options.map((choice) => (
                  <FormControlLabel key={choice._id} value={choice.name} control={<Radio />} label={choice.name}
                    sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.9rem' } }} />
                ))}
              </RadioGroup>
              {error ? <FormHelperText>This is a required field...</FormHelperText> : <></>}
              {selectedOption === 'Other' ?
                <TextField variant="standard" sx={{ width: '34vw' }} onChange={change}
                  error={error} helperText={error ? "This field is required" : ""}
                  value={defaultVal ? defaultVal : ""} InputLabelProps={{ shrink: true }} />
                : <></>
              }
            </FormControl>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
}

export default AddPVFeedback;
