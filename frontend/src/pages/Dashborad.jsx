import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);


    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            // If token exists, user is already logged in, redirect to dashboard
            navigate('/login');
        }
    }, [navigate]);

    
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                // Retrieve the token from localStorage
                const token = localStorage.getItem('token');
                if (!token) {
                    // Handle case where token is not found
                    throw new Error('Token not found in localStorage');
                }

                // Make a request to fetch user info using the stored token
                const response = await axios.get('http://127.0.0.1:8000/api/v1/auth/users/me/', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // Set user info in state
                console.log(response.data)
                setUserInfo(response.data);
            } catch (error) {
                console.error('Error fetching user info:', error.message);
                setError('Error fetching user info. Please try again later.');
            }
        };

        fetchUserInfo();
    }, []);

    return (
        <div className="container">
            <h1>Welcome to Dashboard</h1>
            {error ? (
                <p>{error}</p>
            ) : userInfo ? (
                <div>
                    <p>Logged in as: {userInfo.email}</p>
                    {/* Display other user info as needed */}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Dashboard;
