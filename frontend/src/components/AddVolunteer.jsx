import { Alert, Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Snackbar, Stack, TextField, createFilterOptions } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { RestaurantOutlined } from "@mui/icons-material";


function AddVolunteer({ open, close, eventId, onSuccess }) {
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [type, setType] = useState('training');
  const [remark, setRemark] = useState("");
  const volunteerType = [
    {
      value: 'potential',
      label: 'Potential Sahabhagi'
    },
    {
      value: 'training',
      label: 'Training Sahabhagi'
    },
    {
      value: 'programVolunteer',
      label: 'Program Volunteer Under Obs.'
    }
  ]
  const [value, setValue] = useState();
  const filter = createFilterOptions();
  const [volunteersList, setVolunteersList] = useState([]);
  const [alertPresent, setAlertPresent] = useState(false);

  useEffect(() => {
    axios({
      method: 'get',
      url: 'http://localhost:3000/volunteer',
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    }).then(async (resp) => {
      const vArray = await resp.data.volunteers.map((volunteer) => {
        return {
          name: volunteer.name,
          mobileNumber: volunteer.mobileNumber
        }
      });
      setVolunteersList(vArray);
    })
  }, []);
  useEffect(() => {
    if (value) {
      const volunteer = volunteersList.find(v => (v.mobileNumber === value.mobileNumber));
      if (volunteer)
        setName(volunteer.name);
      else
        setName("");
    }
    else
      setName("");
  }, [value, volunteersList])
  function handleSubmit(e) {
    e.preventDefault();
    axios({
      method: "post",
      url: "http://localhost:3000/event/addVolunteer",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      data: {
        name: name,
        mobileNumber: value.mobileNumber,
        type: type,
        eventId: eventId,
        remarks: remark
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
        PaperProps={{
          component: 'form',
          onSubmit: (event) => { handleSubmit(event) }
        }}
      >
        <DialogTitle>Add Volunteer</DialogTitle>
        <DialogContent>
          <Stack spacing={2} direction="column" alignItems="center" justifyContent="center" sx={{ minWidth: 400 }}>
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
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              id="free-solo-with-text-demo"
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
                <TextField {...params} label="Mobile Number" />
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
              variant="outlined">
            </TextField>

            <TextField
              autoFocus
              required
              select
              fullWidth
              id="outlined-basic"
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
        <DialogActions>
          <Button onClick={close}>Cancel</Button>
          <Button type="submit">Submit</Button>
        </DialogActions>
      </Dialog>
    </>

  )
}

export default AddVolunteer;
