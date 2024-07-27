import Signup from './components/Signup.jsx';
import AppBar from './components/AppBar.jsx';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Login from './components/Login.jsx';
import Event from './components/Event.jsx';
import SingleEvent from './components/SingleEvent.jsx';
import { AuthProvider } from './api/AuthContext.jsx';
import AddFeedback from './components/AddFeedback.jsx';


function App() {
  const navigate = useNavigate();
  return (
    <>
      <div>
        <AuthProvider>
          <AppBar />
          <Routes>
            {/* <Route path="/" element={<Landing />} /> */}
            <Route path="/admin/signup" element={<Signup />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/events" element={<Event />} />
            <Route path="/events/:eventId" element={<SingleEvent />} />
            <Route path="/addfeedback" element={<AddFeedback />} />
          </Routes>
        </AuthProvider>
      </div>
    </>
  )
}

export default App;
