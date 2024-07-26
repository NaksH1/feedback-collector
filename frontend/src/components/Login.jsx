import { Card, TextField, Button, Stack, Typography, AppBar } from "@mui/material";
import { useState } from "react";
import axios from 'axios';
import App from "../App";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleLogin = () => {
    axios({
      method: 'post',
      url: 'http://localhost:3000/admin/login',
      headers: {
        "Content-Type": "application/json",
        username: email,
        password: password
      }
    }).then((response) => {
      console.log(response);
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
          Welcome, please enter your credentials below
        </Typography>
      </div>
      <br />
      <div style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "row"
      }}>
        <Stack spacing={2}>
          <Card variant={"outlined"} style={{ width: 400, padding: 20 }}>
            <TextField
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              fullWidth={true}
              id="outlined-basic"
              label="Email"
              variant={"outlined"} />
            <br />
            <br />
            <TextField
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              fullWidth={true}
              id="outlined-basic"
              label="Password"
              variant={"outlined"}
              type={"password"} />
            <br /><br />
            <Button size={"large"} variant="contained" onClick={handleLogin}>LOGIN</Button>
          </Card>
        </Stack>
      </div>
    </>
  )
}

export default Login;
