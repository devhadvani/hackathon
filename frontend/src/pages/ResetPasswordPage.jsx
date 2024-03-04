import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const ResetPasswordForm = () => {
    const [formData, setFormData] = useState({
        email: ''
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await axios.post('http://localhost:8000/api/v1/auth/users/reset_password/', formData);
            setSuccessMessage(response.data.message);
            navigate("/login", { state: "reset activation link sended to your email if you have regirssdskjfskjfh" });
            setErrorMessage('');
        } catch (error) {
            setSuccessMessage('');
            setErrorMessage('An error occurred while resetting the password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container auth__container">
            <h2 className="main__title">Reset Password</h2>
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form onSubmit={handleSubmit} className="auth__form">
                <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Loading...' : 'Reset Password'}</button>
            </form>
        </div>
    );
};

export default ResetPasswordForm;
