import { Card, TextField, Button, Stack, Typography, AppBar, CardHeader, CardContent, Box, Divider } from "@mui/material";
import { useState } from "react";
import axios from 'axios';
import App from "../App";
import { useNavigate } from "react-router-dom";

import GoogleSignInButton from "./GoogleSignInButton";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const handleLogin = () => {
    axios({
      method: 'post',
      url: `${import.meta.env.VITE_BACKEND_URL}/user/login`,
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
    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '28vh', position: 'relative' }}>
      <Stack alignItems="center">
        <Box sx={{
          width: 413,
          backgroundColor: '#b39167',
          padding: '10px 0',
          textAlign: 'center',
          borderRadius: '4px 4px 0 0',
          zIndex: 1,
          position: 'relative'
        }}>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold' }}>
            Login
          </Typography>
        </Box>
        <Card variant="outlined" sx={{ width: 380, padding: 2, marginTop: '-20px', zIndex: 0 }}>
          <CardContent sx={{ textAlign: 'center', paddingTop: 4 }}>
            <Stack direction='column' spacing={2} justifyContent='center'>
              <TextField
                onChange={(e) => setEmail(e.target.value)}
                fullWidth={true}
                label="Email"
                variant="outlined"
              />
              <TextField
                onChange={(e) => setPassword(e.target.value)}
                fullWidth={true}
                label="Password"
                variant="outlined"
                type="password"
              />
              <Button size="large" variant="contained" sx={{
                marginTop: 2, color: '#fff', backgroundColor: '#ad4511',
                fontWeight: 'bold', marginBottom: '5px',
                '&:hover': {
                  backgroundColor: '#0b055f'
                }
              }} onClick={handleLogin}>
                LOGIN
              </Button>
              <Divider>or</Divider>
              <GoogleSignInButton />
            </Stack>
          </CardContent>

        </Card>
      </Stack>
    </Box>
  )
}

export default Login;
