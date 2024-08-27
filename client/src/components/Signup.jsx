import { Card, TextField, Button, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";


function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const handleSignup = () => {
    axios({
      method: 'post',
      url: `${process.env.REACT_APP_BACKEND_URL}/admin/signup`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        name: name,
        username: email,
        password: password
      }
    }).then((response) => {
      // console.log(response);
      localStorage.setItem("token", response.data.token);
      window.location = "/events";
    });
  }
  return (
    <>
      <div style={{
        display: "flex",
        justifyContent: "center",
        marginTop: 200,
        marginBotom: 40
      }}>
        <Typography variant="h5">
          Welcome, please signup below
        </Typography>
      </div>
      <br />
      <div style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "row"
      }}>
        <Card variant={"outlined"} style={{ width: 400, padding: 20 }}>
          <Stack spacing={2}>
            <TextField
              onChange={(e) => {
                setName(e.target.value);
              }}
              fullWidth={true}
              id="outlined-basic"
              label="Name"
              variant={"outlined"} />
            <TextField
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              fullWidth={true}
              id="outlined-basic"
              label="Email"
              variant={"outlined"} />
            <TextField
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              fullWidth={true}
              id="outlined-basic"
              label="Password"
              variant={"outlined"}
              type={"password"} />
            <Button size={"large"} variant="contained" onClick={handleSignup}>SIGNUP</Button>
          </Stack>
        </Card>

      </div>
    </>
  )
}

export default Signup;
