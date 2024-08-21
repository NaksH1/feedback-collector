import { Box, Button, Container, Divider, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

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
  function navigateEvent() {
    navigate('./events');
  }
  function navigateDashboard() {
    navigate('./volunteerdashboard');
  }
  return (
    <>
      <Box maxWidth='100vw' sx={{ backgroundColor: '#464038', padding: '10px' }}>
        <Container maxWidth="xl">
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1.5}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ffffff', marginRight: '15px' }}>
                Feedback-Collector
              </Typography>
              {isLoggedIn ?
                <Stack direction="row" spacing={1.5}>
                  <Button variant="text" onClick={() => navigateEvent()}
                    sx={{
                      color: '#dfd7c8', fontWeight: 'bold', '&:hover': {
                        color: '#cc4521'
                      }
                    }}
                  >EVENTS</Button>
                  <Divider orientation="vertical" flexItem sx={{ backgroundColor: '#dfd7c8' }} />
                  <Button variant="text" onClick={() => navigateDashboard()}
                    sx={{
                      color: '#dfd7c8', fontWeight: 'bold', '&:hover': {
                        color: '#cc4521'
                      }
                    }}
                  >VOLUNTEER</Button>
                </Stack>
                : <></>
              }
            </Stack>
            {isLoggedIn ? (
              <Stack direction="row" alignItems="center" >
                <AccountCircleIcon sx={{ color: '#fff', marginRight: '5px' }} />
                <Typography sx={{ marginRight: '20px', fontWeight: 'bold', color: '#ffffff' }}> {userName} </Typography>
                <Button variant="contained" onClick={handleLogout}
                  sx={{
                    backgroundColor: '#e91e63',
                    color: '#fff',
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: '#d81b60',
                    },
                  }}
                >Logout</Button>
              </Stack>
            ) : (
              <Stack direction="row" spacing={1.5}>
                <Button variant="contained" style={{ marginRight: 10 }} onClick={handleSignup}>Signup</Button>
                <Button variant="contained" onClick={handleLogin}>Login</Button>
              </Stack>
            )}
          </Stack>
        </Container>
      </Box>
    </>
  )
}

export default Appbar;
