// import { Alert, Button, Card, CardContent, CardHeader, Divider, FormControl, FormControlLabel, FormHelperText, Grid, Radio, RadioGroup, Snackbar, Stack, TextField, Typography } from "@mui/material";
// import { useLocation, useNavigate } from "react-router-dom";
// import { Question, SingleChoice } from "./AddFeedback";
// import { useEffect, useState } from "react";
// import dayjs from "dayjs";
// import axios from "axios";
//
export const AREA_CHOICES = [
  'Dining',
  'Ushering',
  'Inside hall',
  'Hall setup',
  'Food Shifting',
  'Audio',
  'Other'
]
export const OPTIONS = [
  'Very good',
  'Needs improvement',
  'Not appropriate',
  'Other'
]
export const REMARKS = [
  'Need to volunteer for more programs',
  'They can be trained',
  'They are not suitable for training',
  'Other'
]
//
// function AddPVFeedback({ viewFeedback, otherInfo, toUpdate }) {
//   const location = useLocation();
//   const { volunteerName, volunteerId, event } = location.state || otherInfo;
//   const navigate = useNavigate();
//   const [state, setState] = useState({
//     activity: '', presentation: '', communication: '', fitness: '', commitment: '', remarks: '', train: '', overall: '',
//     status: '', recommendation: '',
//     otherFields: {
//       activity: '', communication: '', fitness: '', commitment: '', remarks: '', train: ''
//     },
//     errors: {
//       activity: false, presentation: false, communucation: false, fitness: false, commitment: false, remarks: false, train: false,
//       overall: false
//     }
//   });
//   const [errorFilling, setErrorFilling] = useState(false);
//
//   useEffect(() => {
//     if (viewFeedback && viewFeedback.programVolunteer) {
//       console.log("viewFeedback", viewFeedback);
//       setState((preState) => ({
//         ...preState,
//         activity: viewFeedback.programVolunteer.activity || preState.activity,
//         presentation: viewFeedback.programVolunteer.presentation || preState.presentation,
//         communication: viewFeedback.programVolunteer.communication || preState.communication,
//         fitness: viewFeedback.programVolunteer.fitness || preState.fitness,
//         commitment: viewFeedback.programVolunteer.commitment || preState.commitment,
//         remarks: viewFeedback.programVolunteer.remarks || preState.remarks,
//         train: viewFeedback.programVolunteer.train || preState.train,
//         overall: viewFeedback.programVolunteer.overall || preState.overall,
//         status: viewFeedback.programVolunteer.status || preState.status,
//         recommendation: viewFeedback.programVolunteer || preState.recommendation,
//         otherFields: viewFeedback.otherFields || preState.otherFields
//       }))
//     }
//
//   }, [viewFeedback])
//
//
//   function handleState(e) {
//     const { name, value } = e.target;
//     setState((preState) => ({
//       ...preState,
//       [name]: value,
//       otherFields: {
//         ...preState.otherFields,
//         [name]: value === 'Other' ? preState.otherFields[name] : ''
//       }
//     }));
//   }
//   function handleOtherState(e) {
//     const { name, value } = e.target;
//     setState((preState) => ({
//       ...preState,
//       otherFields: {
//         ...preState.otherFields,
//         [name]: value
//       }
//     }))
//   }
//
//   const updateOtherFields = () => {
//     return new Promise((resolve) => {
//       setState((prevState) => {
//         const updatedState = { ...prevState };
//         const otherKeys = Object.keys(state.otherFields);
//         otherKeys.forEach((key) => {
//           if (updatedState[key] === 'Other')
//             updatedState[key] = updatedState.otherFields[key];
//         });
//         resolve(updatedState);
//         return updatedState;
//       })
//     })
//   }
//   const formatDate = (date) => {
//     if (!date)
//       return '';
//     return dayjs(date).format('Do MMMM YYYY');
//   }
//   async function handleSubmit(e) {
//     e.preventDefault();
//     const updatedState = await updateOtherFields();
//     if (checkError(updatedState))
//       return;
//     console.log(updatedState);
//     axios({
//       method: 'post',
//       url: 'http://localhost:3000/feedback',
//       headers: {
//         "Authorization": "Bearer " + localStorage.getItem("token")
//       },
//       data: {
//         volunteerId: volunteerId,
//         eventId: event._id,
//         type: 'programVolunteer',
//         programVolunteer: updatedState
//       }
//     }).then((resp) => {
//       console.log(resp.data);
//       navigate(`/events/${event._id}`);
//     })
//   }
//   function checkError(updatedState) {
//     const { activity, presentation, communication, fitness, commitment, remarks, train, overall } = updatedState;
//     const newErrors = {
//       activity: !activity, presentation: !presentation, communication: !communication, fitness: !fitness,
//       commitment: !commitment, remarks: !remarks, train: !train, overall: !overall
//     }
//     setState((preState) => ({ ...preState, errors: newErrors }));
//     const handleError = Object.values(newErrors).some(err => err);
//     if (handleError) {
//       setErrorFilling(true);
//       return true;
//     }
//     return false;
//   }
//   async function handleUpdate(e) {
//     e.preventDefault();
//     const updatedState = await updateOtherFields();
//     if (checkError(updatedState))
//       return;
//     axios({
//       method: 'put',
//       url: `http://localhost:3000/feedback/${viewFeedback._id}`,
//       headers: {
//         "Authorization": "Bearer " + localStorage.getItem("token")
//       },
//       data: {
//         type: 'programVolunteer',
//         programVolunteer: state
//       }
//     }).then((resp) => {
//       alert("Feedback updated");
//       console.log(resp.data);
//     })
//   }
//   const handleAlertClose = (event, reason) => {
//     if (reason === 'clickaway')
//       return;
//     setErrorFilling(false);
//   }
//   if (toUpdate && !viewFeedback) {
//     return (
//       <span>Loading...</span>
//     )
//   }
//   return (
//
//     <>
//       <Snackbar open={errorFilling} autoHideDuration={6000} onClose={handleAlertClose}>
//         <Alert onClose={handleAlertClose} severity="error" variant="filled" sx={{ width: '100%' }}>
//           Please fill all the required fields
//         </Alert>
//       </Snackbar>
//       <Grid container spacing={1.5} justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
//         <Grid item xs={12} sm={8} md={6} lg={12}>
//           <Card sx={{ maxWidth: 550, mx: "auto" }}>
//             <CardHeader
//               title="Program volunteer Observation form(pre-Org training)"
//             />
//             <Divider />
//             <CardContent>
//               <Typography>
//                 Program Volunteer Name : {volunteerName}
//               </Typography>
//               <Stack direction="row" justifyContent="space-between">
//                 <Typography variant="body2" component="div">
//                   Event Name: {event.name}
//                 </Typography>
//                 <Typography variant="body2" component="div">
//                   Date: {formatDate(event.date)}
//                 </Typography>
//               </Stack>
//             </CardContent>
//           </Card>
//         </Grid>
//         {toUpdate ?
//           <>
//             <Question value="Status" change={handleState} name="status" defaultVal={state.status} />
//             <Question value="Recommendation" change={handleState} name="recommendation" defaultVal={state.recommendation} />
//           </> :
//           <></>
//         }
//         <Single question="Area of activity" array={AREA_CHOICES} change={handleState} otherChange={handleOtherState}
//           state={state.activity} name="activity" error={state.errors.activity} otherValue={state.otherFields.activity}
//           defaultVal={state.otherFields.activity} />
//         <Question value="Presentation(Appearance, dress code, body language)" change={handleState} name="presentation" error={state.errors.presentation}
//           defaultVal={state.presentation} />
//         <Single question="Communication(Interaction with volunteers)" array={OPTIONS} change={handleState} otherChange={handleOtherState}
//           state={state.communication} name="communication" error={state.errors.communucation} otherValue={state.otherFields.communication}
//           defaultVal={state.otherFields.communication} />
//         <Single question="Physical fitness(Are they able to stretch themselves)" array={OPTIONS} change={handleState} otherChange={handleOtherState}
//           state={state.fitness} name="fitness" error={state.errors.fitness} otherValue={state.otherFields.fitness}
//           defaultVal={state.otherFields.fitness} />
//         <Single question="Commitment and willingness towards activity" array={OPTIONS} change={handleState} otherChange={handleOtherState}
//           state={state.commitment} name="commitment" error={state.errors.commitment} otherValue={state.otherFields.commitment}
//           defaultVal={state.otherFields.commitment} />
//         <Single question="Remarks" array={REMARKS} change={handleState} otherChange={handleOtherState}
//           state={state.remarks} name="remarks" error={state.errors.remarks} otherValue={state.otherFields.remarks} />
//         <Single question="If they can be trained which Area of activity do you think they will fit best?" array={AREA_CHOICES} change={handleState}
//           state={state.train} name="train" error={state.errors.train} otherValue={state.otherFields.train} otherChange={handleOtherState} />
//         <Question value="Overall Feedback" change={handleState} name="overall" error={state.errors.overall}
//           defaultVal={state.overall} />
//         <Grid item xs={12} sm={8} md={6} lg={12}>
//           {toUpdate ?
//             <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ maxWidth: 550, mx: "auto" }}>
//               <Button variant="contained" onClick={handleUpdate} sx={{ fontsize: '0.75rem' }}>Update</Button>
//               <Button variant="text" sx={{ fontsize: '0.75rem' }}>Clear Form</Button>
//             </Stack>
//             :
//             <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ maxWidth: 550, mx: "auto" }}>
//               <Button variant="contained" onClick={handleSubmit} sx={{ fontsize: '0.75rem' }}>Submit</Button>
//               <Button variant="text" sx={{ fontsize: '0.75rem' }}>Clear Form</Button>
//             </Stack>
//           }
//         </Grid>
//
//       </Grid>
//
//     </>
//   );
//
//
// }
//
//
// function Single({ question, array, change, state, name, error, otherValue, otherChange, defaultVal }) {
//   return (
//     <Grid item xs={12} sm={8} md={6} lg={12}>
//       <Card sx={{ maxWidth: 550, mx: "auto" }}>
//         <CardContent>
//           <Typography variant="subtitle1">
//             {question}
//           </Typography>
//           <FormControl component="fieldset" error={error}>
//             <RadioGroup aria-label="choices" name={name} value={state} onChange={change}>
//               {array.map((choice, index) => {
//                 return (
//                   <FormControlLabel
//                     key={index}
//                     value={choice}
//                     control={<Radio />}
//                     sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.9rem' } }}
//                     label={choice} />
//                 )
//               })}
//             </RadioGroup>
//             {error ? <FormHelperText>This is a required field..</FormHelperText> : <> </>}
//             {state === 'Other' ? <TextField label="Other" variant="standard" sx={{ width: 500 }}
//               name={name}
//               onChange={otherChange}
//               value={defaultVal ? defaultVal : otherValue}
//               InputLabelProps={{ shrink: true }}
//             /> : <></>}
//           </FormControl>
//         </CardContent>
//       </Card>
//     </Grid>
//   )
// }
//
// export default AddPVFeedback;
//


import { Card, CardContent, Divider, FormControl, Radio, RadioGroup, FormControlLabel, Grid, Stack, Typography, Button, FormHelperText, Snackbar, Alert, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import { Header, Question } from "./AddTFeedback";

function AddPVFeedback({ viewFeedback, otherInfo, toUpdate }) {
  const location = useLocation();
  const { volunteerName, volunteerId, event, type } = location.state || otherInfo;
  const navigate = useNavigate();
  const [questionnaire, setQuestionnaire] = useState();
  const [feedbackState, setFeedbackState] = useState({});
  const [errorState, setErrorState] = useState({});
  const [errorFilling, setErrorFilling] = useState(false);

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
        <Grid item xs={12} sm={8} md={6} lg={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ maxWidth: '36vw', mx: "auto" }}>
            <Button variant="contained" onClick={handleSubmit} sx={{ fontsize: '0.75rem' }}>Submit</Button>
            <Button variant="text" sx={{ fontsize: '0.75rem' }}>Clear Form</Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}

function SingleChoice({ question, options, selectedOption, change, error, defaultVal }) {
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
