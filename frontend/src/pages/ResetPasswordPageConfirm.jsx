import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';


const ResetPasswordPageConfirm = () => {
    const { uid, token } = useParams();
    const [formData, setFormData] = useState({
        new_password: '',
        re_new_password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { new_password, re_new_password } = formData;
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const userData = {
            uid,
            token,
            new_password,
            re_new_password
        };

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const response = await axios.post('http://127.0.0.1:8000/api/v1/auth/users/reset_password_confirm/', userData, config);
             setIsLoading(false);
            // If the request is successful, navigate to login page with a success message
            navigate("/login", { state: "Password changed successfully" });
        } catch (error) {
            console.log(error)
            setIsLoading(false);
            if (error.response) {
                // If the server responds with an error status code
                const responseData = error.response.data;
                if (responseData.hasOwnProperty("non_field_errors")) {
                    // If there are errors specific to the form fields
                    setError(responseData.non_field_errors[0]);
                } else if (responseData.hasOwnProperty("token")) {
                    // If the token is invalid or expired
                    setError(responseData.token[0]);
                } else {
                    // If there are other types of errors
                    setError(error.response.data);
                }
            } else {
                // If the request fails due to network or other issues
                setError("An error occurred while resetting the password. Please try again later."+error.response.data);
            }
        }
        
    };

    return (
        <div className="container auth__container">
            <h1 className="main__title">Reset Password</h1>
            {error && typeof error === 'object' ? (
    <div className="error-message">
        {Object.keys(error).map((key, index) => (
            <p key={index}>{key}: {error[key]}</p>
        ))}
    </div>
) : (
    <p className="error-message">{error}</p>
)}



            <form className="auth__form" onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="New password"
                    name="new_password"
                    onChange={handleChange}
                    value={new_password}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm new password"
                    name="re_new_password"
                    onChange={handleChange}
                    value={re_new_password}
                    required
                />
                <button className="btn btn-primary" type="submit" disabled={isLoading}>
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>
            </form>
        </div>
    );
};

export default ResetPasswordPageConfirm;
