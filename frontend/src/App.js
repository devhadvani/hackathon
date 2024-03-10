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
function App() {
  return (
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
          <Route path="/create-profile" element={<ProfileForm />} />
          <Route path="/reset-password" element={<ResetPasswordForm />} />
          <Route path="/password/reset/confirm/:uid/:token" element={<ResetPasswordPageConfirm />} />
          {/* Add other routes */}
        </Routes>
      </>
    </Router>
  );
}

export default App;
