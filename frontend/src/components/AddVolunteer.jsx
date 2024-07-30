import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Stack, TextField } from "@mui/material";
import { useState } from "react";
import axios from "axios";


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
    }
  ]
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
        mobileNumber: mobileNumber,
        type: type,
        eventId: eventId,
        remark: remark
      }
    }).then((res) => {
      onSuccess(res.data.volunteer)
      close();

    }).catch((err) => {
      console.log(err);
    });
  }
  return (
    <>
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
            <TextField
              onChange={(e) => {
                setName(e.target.value);
              }}
              autoFocus
              required
              fullWidth
              margin="dense"
              id="outlined-basic"
              label="Name"
              variant="outlined">
            </TextField>
            <TextField
              onChange={(e) => {
                setMobileNumber(e.target.value);
              }}
              autoFocus
              required
              fullWidth
              id="outlined-basic"
              label="Mobile Number"
              variant="outlined"
            >
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
