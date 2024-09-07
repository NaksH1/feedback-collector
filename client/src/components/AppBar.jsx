import { Box, Button, Container, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Stack, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from "../api/AuthContext";
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';

function Appbar() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null);
  let { isAuthenticated, setIsAuthenticated, role } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');
  if (!role)
    role = localStorage.getItem('role')
  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem('token');
      if (token) {
        axios({
          method: 'get',
          url: `${import.meta.env.VITE_BACKEND_URL}/admin/me`,
          headers: {
            "Authorization": "Bearer " + token
          }
        }).then((res) => {
          setUserName(res.data.name);
        }).catch((err) => {
          console.error(err)
        });
      }
    }
  }, [isAuthenticated])


  function handleSignup() {
    navigate("/admin/signup");
  }
  function handleLogin() {
    navigate("/admin/login");
  }
  function handleLogout() {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUserName(null);
    window.location = '/admin/login';
  }
  function navigateEvent() {
    setDrawerOpen(false);
    navigate('./events');
  }
  function navigateVolunteersList() {
    setDrawerOpen(false);
    navigate('./volunteerslist');
  }
  return (
    <>
      <Box maxWidth='100vw' sx={{ backgroundColor: '#464038', padding: '10px' }}>
        <Container maxWidth="xl">
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            {isMobile ?
              <Stack direction='row' justifyContent='left' spacing={1}>
                <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: '#fff' }}>
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#fff', flexGrow: 1, textAlign: 'center' }}>
                  Sadhguru Sahabhagi
                </Typography>
              </Stack>
              :
              <Stack direction="row" spacing={1.5}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#fff', marginRight: '15px' }}>
                  Sadhguru Sahabhagi
                </Typography>
                {isAuthenticated ?
                  <Stack direction={{ xl: 'column', sm: 'row' }} alignItems={{ xl: 'flex-start', sm: 'center' }} spacing={1.5}>
                    <Button variant="text" onClick={() => navigateEvent()}
                      sx={{
                        color: '#dfd7c8', fontWeight: 'bold', '&:hover': {
                          color: '#cc4521'
                        }
                      }}
                    >PROGRAMS</Button>
                    {role === 'admin' &&
                      <Stack direction={{ xl: 'column', sm: 'row' }} alignItems={{ xl: 'flex-start', sm: 'center' }} spacing={1.5}>
                        <Divider orientation="vertical" flexItem sx={{ backgroundColor: '#dfd7c8' }} />
                        <Button variant="text" onClick={() => navigateVolunteersList()}
                          sx={{
                            color: '#dfd7c8', fontWeight: 'bold', '&:hover': {
                              color: '#cc4521'
                            }
                          }}
                        >VOLUNTEERS</Button>
                      </Stack>
                    }
                  </Stack>
                  : <></>
                }
              </Stack>
            }
            {isAuthenticated ? (
              <>
                {isMobile ?
                  <Stack direction="row" alignItems="center">
                    <Tooltip title={userName}>
                      <AccountCircleIcon sx={{ color: '#fff', marginRight: '5px' }} />
                    </Tooltip>
                    <Button variant='contained' onClick={handleLogout}
                      sx={{
                        backgroundColor: '#e91e63',
                        color: '#fff',
                        '&:hover': {
                          backgroundColor: '#d81b60'
                        }
                      }}>
                      <LogoutIcon />
                    </Button>
                  </Stack>
                  :
                  <Stack direction="row" alignItems="center" >
                    <AccountCircleIcon sx={{ color: '#fff', marginRight: '5px' }} />
                    <Typography sx={{ marginRight: '20px', fontWeight: 'bold', color: '#fff' }} noWrap> {userName} </Typography>
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
                }
              </>
            ) : (
              <Stack direction="row" spacing={1.5}>
                <Button variant="text" onClick={handleSignup} sx={{
                  color: '#dfd7c8', fontWeight: 'bold', '&:hover': {
                    color: '#cc4521'
                  }
                }}>Signup</Button>
                <Divider orientation="vertical" flexItem sx={{ backgroundColor: '#dfd7c8' }} />
                <Button variant="text" onClick={handleLogin} sx={{
                  color: '#dfd7c8', fontWeight: 'bold', '&:hover': {
                    color: '#cc4521'
                  }
                }}>Login</Button>
              </Stack>
            )}
          </Stack>
        </Container>
      </Box>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': { backgroundColor: '#464038', padding: '10px 0' }
        }}>
        <Box sx={{ width: 200 }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={navigateEvent} sx={{ padding: '10px 20px' }}>
                <ListItemText
                  primary="Programs"
                  sx={{
                    fontWeight: 'bold', color: '#dfd7c8', justifyContent: 'center',
                    textAlign: 'center', fontSize: '16px'
                  }}
                />
              </ListItemButton>
            </ListItem>
            <Divider sx={{ marginY: '8px' }} />

            {role === 'admin' && (
              <>
                <ListItem disablePadding>
                  <ListItemButton onClick={navigateVolunteersList} sx={{ padding: '10px 20px' }}>
                    <ListItemText
                      primary="Volunteers"
                      sx={{
                        fontWeight: 'bold', color: '#dfd7c8', justifyContent: 'center',
                        textAlign: 'center', fontSize: '16px'
                      }}
                    />
                  </ListItemButton>
                </ListItem>
                <Divider sx={{ marginY: '8px' }} />
              </>
            )}
          </List>
        </Box>
      </Drawer>

    </>
  )
}

export default Appbar;
