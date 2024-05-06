import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfileData, setEditedProfileData] = useState(null);
    const skillsList = ['HTML', 'CSS', 'JavaScript', 'Python', 'Java', 'React', 'Angular', 'Node.js','Django'];

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const accessToken = localStorage.getItem('token');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                };

                const userResponse = await axios.get('http://127.0.0.1:8000/api/v1/auth/users/me/', config);
                const userId = userResponse.data.id;
                setUserInfo(userResponse.data);

                const profileResponse = await axios.get(`http://127.0.0.1:8000/api/v1/user-profiles/${userId}/`, config);
                
                if (!profileResponse.data) {
                    setError('Profile not found.');
                } else {
                    setProfileData(profileResponse.data);
                    setEditedProfileData({ ...profileResponse.data });
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching profile data:', error);
                if (error.response && error.response.status === 404) {
                    setError('Profile not found.');
                } else {
                    setError('Unable to fetch profile data.');
                }
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    const handleEditProfile = () => {
        setIsEditing(true);
    };

    const handleSaveProfile = async () => {
        try {
            const accessToken = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            };

            await axios.put(`http://127.0.0.1:8000/api/v1/user-profiles/${userInfo.id}/`, editedProfileData, config);
            setIsEditing(false);
            setProfileData({ ...editedProfileData });
        } catch (error) {
            console.error('Error updating profile:', error);
            // Handle error
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? (checked ? [...editedProfileData.skills, value] : editedProfileData.skills.filter(skill => skill !== value)) : value;
        setEditedProfileData({ ...editedProfileData, [name]: newValue });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}<li> <Link to="/create-profile">Create profile</Link></li></div>;
    }

    if (!profileData) {
        return <div>
            Error: Profile not found.
           <li> <Link to="/create-profile">Create profile</Link></li>
        </div>;
    }

    return (
        <div>
            <h1>User Profile</h1>
            <div>
                <p><strong>Name:</strong> {userInfo.first_name} {userInfo.last_name}</p>
                <p><strong>Email:</strong> {userInfo.email}</p>
                <p>
                    <strong>Skills:</strong> 
                    {isEditing ? (
                        skillsList.map(skill => (
                            <label key={skill}>
                                <input
                                    type="checkbox"
                                    name="skills"
                                    value={skill}
                                    onChange={handleChange}
                                    checked={editedProfileData.skills.includes(skill)}
                                /> {skill}
                            </label>
                        ))
                    ) : (
                        profileData.skills.join(', ')
                    )}
                </p>
                {profileData.is_student ? (
                    <>
                        <p><strong>College:</strong> {profileData.college_name}</p>
                        <p><strong>College Level:</strong> {profileData.college_level}</p>
                    </>
                ) : (
                    <>
                        <p><strong>Company:</strong> 
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="company_name"
                                    value={editedProfileData.company_name}
                                    onChange={handleChange}
                                />
                            ) : (
                                profileData.company_name
                            )}
                        </p>
                        <p><strong>Career Start Date:</strong> 
                            {isEditing ? (
                                <input
                                    type="date"
                                    name="career_start_date"
                                    value={editedProfileData.career_start_date}
                                    onChange={handleChange}
                                />
                            ) : (
                                profileData.career_start_date
                            )}
                        </p>
                    </>
                )}
                {isEditing ? (
                    <button onClick={handleSaveProfile}>Save</button>
                ) : (
                    <button onClick={handleEditProfile}>Edit Profile</button>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
