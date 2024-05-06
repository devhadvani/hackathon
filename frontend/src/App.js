import './App.css';
import Hello from './pages/Hello';
import RegisterPage from './pages/RegisterPage';
import ActivatePage from './pages/ActivatePage';
import LoginPage from './pages/LoginPage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from './pages/Dashborad';
import Nav from './pages/Nav';
import ResetPasswordPageConfirm from './pages/ResetPasswordPageConfirm';
import ResetPasswordForm from './pages/ResetPasswordPage';
import ProfileForm from './pages/ProfileForm';
import ProfilePage from './pages/ProfilePage';
import HackathonList from './pages/Hackathon/HackathonList';
import HackathonDetail from './pages/Hackathon/HackathonDetail';
import CreateHackathonForm from './pages/Hackathon/CreateHackathonForm';
import ManageHackathon from './pages/Hackathon/ManageHackathon';
import EditHackathon from './pages/Hackathon/EditHackathon';
import ManageHackathonDetails from './pages/Hackathon/ManageHackathonDetails';
import ManageParticipant from './pages/Hackathon/ManageParticipant';
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Message from './pages/Message';
import MessageDetail from './pages/MessageDetail';
import SearchUsers from './pages/SearchUser';

function App() {
  return (
    <>
    <Router>
      <>
        <Nav />
        {/* Other routes */}
        <Routes>
          <Route path="/" element={<><Hello /></> } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/activate/:uid/:token" element={<ActivatePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/create-profile" element={<ProfileForm />} />
          <Route path="/message" element={<Message />} />
          <Route element={<MessageDetail />} path="/inbox/:id" exact />
          <Route path="/hackathons" element={<HackathonList />} />
          <Route path="/hackathons/:id" element={<HackathonDetail />} />
          <Route path="/hackathons/:id/participated" element={<ManageParticipant />} />
          <Route path="/hackathons/:id/edit/" element={<EditHackathon />} />
          <Route path="/manage-hackathons" element={<ManageHackathon />} />
          <Route path="/manage-hackathons/:id" element={<ManageHackathonDetails />} />
          <Route path="/create-hackathon" element={<CreateHackathonForm />} />
          <Route path="/reset-password" element={<ResetPasswordForm />} />
          <Route path="/password/reset/confirm/:uid/:token" element={<ResetPasswordPageConfirm />} />
          <Route element={<SearchUsers />} path="/search/:username" exact />
          {/* Add other routes */}
        </Routes>
      </>
    </Router>
     <ToastContainer
     autoClose={2000}
     closeOnClick
     pauseOnFocusLoss={false}
     pauseOnHover
     transition={Bounce}
   /></>
  );
}

export default App;
