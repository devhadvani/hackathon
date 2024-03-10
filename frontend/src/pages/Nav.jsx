import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Nav = () => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove token from local storage
        navigate('/login')
        // onLogout();
    };

   

    return (
        <nav>
            <ul>
                {token ? (
                    <li><button onClick={handleLogout}>Logout</button></li>
                ) : (
                    <>
                        <li><Link to="/login">Login -</Link></li>
                        <li><Link to="/register">Register</Link></li>
                        <li><Link to="/create-profile">Register</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Nav;
