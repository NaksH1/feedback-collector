import { Alert, Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Snackbar, Stack, TextField, createFilterOptions } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close';

function AddVolunteer({ open, close, eventId, onSuccess }) {
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [type, setType] = useState('training');
  const [gender, setGender] = useState();
  const [city, setCity] = useState('');
  const [remark, setRemark] = useState("");
  const volunteerType = [{ value: 'potential', label: 'Potential Sahabhagi' },
  { value: 'training', label: 'Training Sahabhagi' },
  { value: 'programVolunteer', label: 'Program Volunteer Under Obs.' }];
  const [value, setValue] = useState();
  const filter = createFilterOptions();
  const [volunteersList, setVolunteersList] = useState([]);
  const [alertPresent, setAlertPresent] = useState(false);
  const volunteerGender = [{ value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' }];
  useEffect(() => {
    axios({
      method: 'get',
      url: `${process.env.REACT_APP_BACKEND_URL}/volunteer`,
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    }).then(async (resp) => {
      const vArray = await resp.data.volunteers.map((volunteer) => {
        return {
          name: volunteer.name,
          mobileNumber: volunteer.mobileNumber,
          city: volunteer.city,
          gender: volunteer.gender
        }
      });
      setVolunteersList(vArray);
    })
  }, []);
  useEffect(() => {
    if (value) {
      const volunteer = volunteersList.find(v => (v.mobileNumber === value.mobileNumber));
      if (volunteer) {
        setName(volunteer.name);
        setCity(volunteer.city);
        setGender(volunteer.gender);
      }
      else {
        setName("");
        setCity("");
        setGender("");
      }
    }
    else
      setName("");
  }, [value, volunteersList])
  function handleSubmit(e) {
    e.preventDefault();
    axios({
      method: "post",
      url: `${process.env.REACT_APP_BACKEND_URL}/event/addVolunteer`,
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      data: {
        name: name,
        mobileNumber: value.mobileNumber,
        type: type,
        eventId: eventId,
        remarks: remark,
        city: city,
        gender: gender
      }
    }).then((res) => {
      onSuccess(res.data.volunteer)
      close();

    }).catch((err) => {
      console.log(err);
      close();
      setAlertPresent(true);
    });
  }
  function handleClose(event, reason) {
    if (reason === 'clickaway')
      return;
    setAlertPresent(false);
  }
  return (
    <>
      <Snackbar open={alertPresent} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="warning"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Volunteer is already present!!
        </Alert>
      </Snackbar>
      <Dialog
        open={open}
        onClose={close}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          component: 'form',
          onSubmit: (event) => { handleSubmit(event) }
        }}
      >
        <DialogTitle
          sx={{ backgroundColor: '#b39167', color: '#fff', fontWeight: 'bold' }}
        >Add Volunteer</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={close}
          sx={{
            position: 'absolute', right: 8, top: 8, color: '#fff'
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent sx={{ padding: '20px' }}>
          <Stack spacing={2} direction="column" alignItems="center" justifyContent="center" >
            <Autocomplete
              value={value}
              onChange={(event, newValue) => {
                if (typeof newValue === 'string') {
                  setValue({
                    mobileNumber: newValue,
                  });
                } else if (newValue && newValue.inputValue) {
                  setValue({
                    mobileNumber: newValue.inputValue,
                  });
                } else {
                  setValue(newValue);
                }
              }}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);
                const { inputValue } = params;
                const isExisting = options.some((option) => inputValue === option.title);
                if (inputValue !== '' && !isExisting) {
                  filtered.push({
                    inputValue,
                    mobileNumber: `Add "${inputValue}"`,
                  });
                }

                return filtered;
              }}
              selectOnFocus clearOnBlur
              handleHomeEndKeys id="free-solo-with-text-demo"
              options={volunteersList}
              getOptionLabel={(option) => {
                if (typeof option === 'string') {
                  return option;
                }
                if (option.inputValue) {
                  return option.inputValue;
                }
                return option.mobileNumber;
              }}
              renderOption={(props, option) => {
                const { key, ...optionProps } = props;
                return (
                  <li key={key} {...optionProps}>
                    {option.mobileNumber}
                  </li>
                );
              }}
              fullWidth
              freeSolo
              renderInput={(params) => (
                <TextField {...params} label="Mobile Number" required />
              )}
            />

            <TextField
              onChange={(e) => {
                setName(e.target.value);
              }}
              value={name}
              autoFocus
              required
              fullWidth
              margin="dense"
              id="outlined-basic"
              label="Name"
              variant="outlined" />
            <Stack direction='row' spacing={1} justifyContent='center'>
              <TextField
                onChange={(e) => {
                  setCity(e.target.value);
                }}
                sx={{ width: '13vw' }}
                value={city} autoFocus
                margin="dense" id="outlined-basic"
                label="City" variant="outlined" />
              <TextField key={gender}
                autoFocus select id="outlined-basic" label="Gender" variant="outlined" value={gender}
                onChange={(e) => { setGender(e.target.value); }}
                sx={{ width: '13vw' }}
              >
                {volunteerGender.map((option) => {
                  return <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                })}
              </TextField>
            </Stack>
            <TextField
              autoFocus required select fullWidth id="outlined-basic"
              label="Type"
              variant="outlined"
              onChange={(e) => {
                setType(e.target.value);
              }}
            >
              {volunteerType.map((option) => {
                return <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              })}
            </TextField>
            {type === 'potential' ?
              <TextField
                multiline
                rows={5}
                fullWidth={true}
                id="outlined-multiline-static"
                label="Remarks"
                variant="outlined"
                onChange={(e) => {
                  setRemark(e.target.value);
                }}
              >
              </TextField>
              : <> </>
            }
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button type="submit" sx={{
            color: '#fff', backgroundColor: '#ad4511',
            fontWeight: 'bold', marginBottom: '5px',
            '&:hover': {
              backgroundColor: '#0b055f'
            }
          }}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>

  )
}

export default AddVolunteer;
