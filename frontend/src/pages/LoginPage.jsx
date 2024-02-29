import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is already logged in
        const token = localStorage.getItem('token'); // Assuming you're storing the token in localStorage
        if (token) {
            // Redirect the user to the dashboard or any other authorized page
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/v1/auth/jwt/create/', formData);
            console.log('Login successful', response.data);
            
            // Store the token in localStorage upon successful login
            localStorage.setItem('token', response.data.access);

            // Redirect user to the dashboard
            navigate("/dashboard");
        } catch (error) {
            if (error.response && error.response.data) {
                console.error('Login failed', error.response.data);
                setError(error.response.data.detail);
            } else {
                console.error('Login failed', error.message);
                setError('An error occurred during login.');
            }
        }
    };

    return (
        <div className="container auth__container">
            <h1 className="main__title">Login</h1>
            {error && <p className="error-message">{error}</p>}
            <form className="auth__form">
                <input
                    type="text"
                    placeholder="Email"
                    name="email"
                    onChange={handleChange}
                    value={formData.email}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    onChange={handleChange}
                    value={formData.password}
                    required
                />
                <button className="btn btn-primary" type="submit" onClick={handleSubmit}>Login</button>
            </form>
        </div>
    );
};

export default LoginPage;
