import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const RegisterPage = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        re_password: ''
    });
    const [fieldErrors, setFieldErrors] = useState({});
    const [error, setError] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // If token exists, user is already logged in, redirect to dashboard
            // navigate('/dashboard');
        }
    }, [navigate]);
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
   
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/v1/auth/users/', {
                email: formData.email,
                first_name: formData.first_name, // Add first_name field
                last_name: formData.last_name, // Add last_name field
                password: formData.password,
                re_password: formData.re_password
            });
            console.log('Registration successful', response.data);
            // navigate("/login");
        } catch (error) {
            console.error("Error setting up the request:", error.response);
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                console.error('Registration failed', errorData);

                // Set field-specific error messages
                setFieldErrors(errorData);

                // Set the general error message
                setError('An error occurred during registration.');
            } else {
                console.error('Registration failed', error.message);
                setError('An error occurred during registration.');
            }
        }
    };

    return (
        <div className="container auth__container">
            <h1 className="main__title">Register</h1>
            {error && <p className="error-message">{error}</p>}
            {fieldErrors.non_field_errors && <p className="error-message">{fieldErrors.non_field_errors[0]}</p>}
            <form className="auth__form">
                <input type="text" placeholder="First Name" name="first_name" onChange={handleChange} value={formData.first_name} required />
                {fieldErrors.first_name && <p className="error-message">{fieldErrors.first_name[0]}</p>}
                <input type="text" placeholder="Last Name" name="last_name" onChange={handleChange} value={formData.last_name} required />
                {fieldErrors.last_name && <p className="error-message">{fieldErrors.last_name[0]}</p>}
                <input type="email" placeholder="Email" name="email" onChange={handleChange} value={formData.email} required />
                {fieldErrors.email && <p className="error-message">{fieldErrors.email[0]}</p>}
                <input type="password" placeholder="Password" name="password" onChange={handleChange} value={formData.password} required />
                {fieldErrors.password && <p className="error-message">{fieldErrors.password[0]}</p>}
                <input type="password" placeholder="Retype Password" name="re_password" onChange={handleChange} value={formData.re_password} required />
                {fieldErrors.re_password && <p className="error-message">{fieldErrors.re_password[0]}</p>}
                <button className="btn btn-primary" type="submit" onClick={handleSubmit}>Register</button>
            </form>
        </div>
    );
};

export default RegisterPage;
