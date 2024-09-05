import { GoogleLogin } from "@react-oauth/google";

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
    } catch (error) {
      console.error('Error during token verification ', error);
    }

  }
  const handleGoogleLoginError = () => {
    console.log('Google Login Failed');
  }
  return (
    <GoogleLogin
      onSuccess={handleGoogleLoginSuccess}
      onError={handleGoogleLoginError}
    />
  )
}

export default GoogleSignInButton;
