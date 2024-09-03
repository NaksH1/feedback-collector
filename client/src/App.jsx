import Signup from './components/Signup.jsx';
import AppBar from './components/AppBar.jsx';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Login from './components/Login.jsx';
import Event from './components/Event.jsx';
import SingleEvent from './components/SingleEvent.jsx';
import { AuthProvider } from './api/AuthContext.jsx';
import AddFeedback from './components/AddFeedback.jsx';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import AddPVFeedback from './components/AddPVFeedback.jsx';
import ViewFeedback from './components/ViewFeedback.jsx';
import AddTFeedback from './components/AddTFeedback.jsx';
import SingleVolunteer from './components/SingleVolunteer.jsx';
import VolunteersList from './components/VolunteersList.jsx';
import ProtectedRoute from './ProtectedRoutes.jsx';


function App() {
  const navigate = useNavigate();
  return (
    <>
      <div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <AuthProvider>
            <AppBar />
            <Routes>
              {/* <Route path="/" element={<Landing />} /> */}
              <Route path="/admin/signup" element={<Signup />} />
              <Route path="/admin/login" element={<Login />} />
              <Route path="/events" element={<Event />} />
              <Route path="/events/:eventId" element={<SingleEvent />} />
              <Route path="/addfeedback" element={<AddFeedback />} />
              <Route path="/addpvfeedback" element={<AddPVFeedback />} />
              <Route path="/viewfeedback/:feedbackId" element={<ViewFeedback />} />
              <Route path="/addtfeedback/" element={<AddTFeedback />} />
              <Route path="/volunteerslist" element={<ProtectedRoute element={VolunteersList} roles={['admin']} />} />
              <Route path="/volunteerslist/:volunteerId" element={<ProtectedRoute element={SingleVolunteer} roles={['admin']} />} />
              {/* <Route path="/volunteerslist" element={<VolunteersList />} /> */}
              {/* <Route path="/volunteerslist/:volunteerId" element={<SingleVolunteer />} /> */}
            </Routes>
          </AuthProvider>
        </LocalizationProvider>
      </div>
    </>
  )
}

export default App;
