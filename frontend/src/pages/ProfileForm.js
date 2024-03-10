// ProfileForm.js

import React, { useState } from 'react';
import axios from 'axios';

const ProfileForm = () => {
    const [formData, setFormData] = useState({
        user: null, // Change to user ID
        skills: [],
        role: '',
        institution: '',
        company: '',
        careerStart: ''
    });

    const skillsList = ['HTML', 'CSS', 'JavaScript', 'Python', 'Java', 'React', 'Angular', 'Node.js'];

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        if (type === 'checkbox') {
            const updatedSkills = checked ? [...formData.skills, value] : formData.skills.filter(skill => skill !== value);
            setFormData({ ...formData, [name]: updatedSkills });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Fetch user ID from localStorage or context
            const userId = localStorage.getItem('userId');
            const updatedFormData = { ...formData, user: 1 };
            
            const res = await axios.post('http://127.0.0.1:8000/api/create-profile/', updatedFormData);
            console.log(res.data);
            // Handle success
        } catch (error) {
            console.error(error);
            // Handle error
        }
    };

    return (
        <div className="container auth__container">
             <h1 className="main__title">Register</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="email"
                        name="user"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Skills:</label><br />
                    {skillsList.map(skill => (
                        <label key={skill}>
                            <input
                                type="checkbox"
                                name="skills"
                                value={skill}
                                onChange={handleChange}
                                checked={formData.skills.includes(skill)}
                            /> {skill}
                        </label>
                    ))}
                </div>
                {/* Other form fields */}
                <div className="form-group">
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                    >
                        <option value="">Select Role</option>
                        <option value="student">Student</option>
                        <option value="professional">Professional</option>
                    </select>
                </div>
                {formData.role === 'student' && (
                    <div className="form-group">
                        <input
                            type="text"
                            name="institution"
                            value={formData.institution}
                            onChange={handleChange}
                            placeholder="Institution"
                        />
                    </div>
                )}
                {formData.role === 'professional' && (
                    <div className="form-group">
                        <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="Company"
                        />
                    </div>
                )}
                <div className="form-group">
                    <input
                        type="date"
                        name="careerStart"
                        value={formData.careerStart}
                        onChange={handleChange}
                        placeholder="Career Start Date"
                    />
                </div>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default ProfileForm;
