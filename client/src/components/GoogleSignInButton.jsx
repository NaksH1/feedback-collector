import { Box } from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useEffect } from "react";

function GoogleSignInButton() {

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    try {
      const resp = await axios({
        method: 'post',
        url: `${import.meta.env.VITE_BACKEND_URL}/user/auth/google`,
        data: {
          token: token
        }
      });
      console.log('Backend response ', resp.data);
      localStorage.setItem('token', resp.data.token);
      window.location = "/events";
    } catch (error) {
      console.error('Error during token verification ', error);
    }

  }
  const handleGoogleLoginError = () => {
    console.log('Google Login Failed');
  }
  useEffect(() => {
    const googleButtonIframe = document.querySelector('iframe[title="Sign in with Google Button"]');
    if (googleButtonIframe) {
      googleButtonIframe.style.width = 380;
    }
  }, []);
  return (
    <Box sx={{ width: '100%', maxWidth: 380, margin: '0 auto' }}>
      <GoogleLogin
        onSuccess={handleGoogleLoginSuccess}
        onError={handleGoogleLoginError}
        width='350'
      />
    </Box>
  )
}

export default GoogleSignInButton;
