import './App.css';
import Hello from './pages/Hello';
import RegisterPage from './pages/RegisterPage';
import ActivatePage from './pages/ActivatePage';
import LoginPage from './pages/LoginPage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from './pages/Dashborad';
import Nav from './pages/Nav';

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
          {/* Add other routes */}
        </Routes>
      </>
    </Router>
  );
}

export default App;
