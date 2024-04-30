import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Nav.css'; // Import the CSS file for styling

const Nav = () => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="navbar">
             <h3 className='logo'>HMS</h3>
            <ul className="navbar-list">
            <li>
                <Link to="/hackathons" className="nav-link">Hackathons</Link></li>
                
                {token ? (
                    <>
                     <li><Link to="/create-hackathon" className="nav-link">host hackathon</Link></li>
                 <li><Link to="/manage-hackathons" className="nav-link">Manage hackathon</Link></li>
                        <li><Link to="/profile" className="nav-link">Profile</Link></li>
                        <li><Link to="/message" className="nav-link">inbox</Link></li>
                        {/* <li><Link to="/dashboard" className="nav-link">Home</Link></li> */}
                        <li><button onClick={handleLogout} className="nav-button">Logout</button></li>
                       
                    </>
                ) : (
                    <>
                        <li><Link to="/login" className="nav-link">Login</Link></li>
                        <li><Link to="/register" className="nav-link">Register</Link></li>

                    </>
                )}

            </ul>
        </nav>
    );
}

export default Nav;
