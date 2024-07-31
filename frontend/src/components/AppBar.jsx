import { Button, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Appbar() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    axios({
      method: 'get',
      url: 'http://localhost:3000/admin/me',
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    }).then((res) => {
      setUserName(res.data.name);
      setIsLoggedIn(true);
    })
  }, [])


  function handleSignup() {
    navigate("/admin/signup");
  }
  function handleLogin() {
    navigate("/admin/login");
  }
  function handleLogout() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserName(null);
    window.location = '/admin/login';
  }
  return (
    <>
      <Stack direction="row" justifyContent="space-between">
        <Stack>
          <Typography variant="h6">
            Feedback-Collector
          </Typography>
        </Stack>
        {isLoggedIn ? (
          <Stack direction="row" alignItems="center">
            <Typography sx={{ marginRight: 1 }}> {userName} </Typography>
            <Button variant="contained" onClick={handleLogout}>Logout</Button>
          </Stack>
        ) : (
          <Stack direction="row">
            <Button variant="contained" style={{ marginRight: 10 }} onClick={handleSignup}>Signup</Button>
            <Button variant="contained" onClick={handleLogin}>Login</Button>
          </Stack>
        )}
      </Stack>
    </>
  )
}

export default Appbar;
