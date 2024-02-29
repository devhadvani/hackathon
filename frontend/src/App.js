import './App.css';
import Hello from './pages/Hello';
import RegisterPage from './pages/RegisterPage';
import ActivatePage from './pages/ActivatePage';
import LoginPage from './pages/LoginPage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from './pages/Dashborad';

function App() {
  return (
    <Router>
      <>
        
        {/* Other routes */}
        <Routes>
          <Route path="/" element={<><RegisterPage /><Hello /></> } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/activate/:uid/:token" element={<ActivatePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Add other routes */}
        </Routes>
      </>
    </Router>
  );
}

export default App;
