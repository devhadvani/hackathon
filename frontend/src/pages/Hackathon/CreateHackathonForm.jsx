import React, { useState } from 'react';
import axios from 'axios';
import {Link, useNavigate } from 'react-router-dom';
import './CreateHackthonForm.css';
import { toast } from 'react-toastify';
import './CreateHackthonForm.css';

const CreateHackathonForm = () => {

 const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    what_to_build: '',
    what_to_submit: '',
    prize_structure: '',
    total_prize: 0,
    start_date: '',
    end_date: '',
    registration_deadline: '',
    website_url: '',
    location: '',
    registration_fee: 0,
    submission_formats: '',
    tags: '',
    organizer: null ,
    front_image: null,
    banner_image: null,
  });

 const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      };

      const userResponse = await axios.get('http://127.0.0.1:8000/api/v1/auth/users/me/', config);
      const userId = userResponse.data.id;
  
      // Append organizer ID to FormData
      
      const formDataWithImages = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataWithImages.append(key, value);
      });
      formDataWithImages.append('organizers', userId);
    
      const response = await axios.post('http://127.0.0.1:8000/api/v1/hackathons/', formDataWithImages, config);
      console.log('Hackathon created:', response.data);
      navigate("/hackathons");
    } catch (error) {
      console.error('Error creating hackathon:', error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('An error occurred while creating the hackathon.');
      }
    }
  };

  return (
    <div className="hackathon-form-container">
      <div className="hackathon-form-card">
        <form onSubmit={handleSubmit}>
          <div class="form-class">
            <label htmlFor="title">Title:</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div class="form-class">
            <label htmlFor="description">Description:</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
          </div>
          <div class="form-class">
            <label htmlFor="what_to_build">What to Build:</label>
            <textarea id="what_to_build" name="what_to_build" value={formData.what_to_build} onChange={handleChange} required />
          </div>
          <div class="form-class">
            <label htmlFor="what_to_submit">What to Submit:</label>
            <textarea id="what_to_submit" name="what_to_submit" value={formData.what_to_submit} onChange={handleChange} required />
          </div>
          <div class="form-class">
            <label htmlFor="prize_structure">Prize Structure:</label>
            <textarea id="prize_structure" name="prize_structure" value={formData.prize_structure} onChange={handleChange} required />
          </div>
          <div class="form-class">
            <label htmlFor="total_prize">Total Prize:</label>
            <input type="number" id="total_prize" name="total_prize" value={formData.total_prize} onChange={handleChange} required />
          </div>
          <div class="form-class">
            <label htmlFor="start_date">Start Date:</label>
            <input type="datetime-local" id="start_date" name="start_date" value={formData.start_date} onChange={handleChange} required />
          </div>
          <div class="form-class">
            <label htmlFor="end_date">End Date:</label>
            <input type="datetime-local" id="end_date" name="end_date" value={formData.end_date} onChange={handleChange} required />
          </div>
          <div class="form-class">
            <label htmlFor="registration_deadline">Registration Deadline:</label>
            <input type="datetime-local" id="registration_deadline" name="registration_deadline" value={formData.registration_deadline} onChange={handleChange} required />
          </div>
          <div class="form-class">
            <label htmlFor="website_url">Website URL:</label>
            <input type="url" id="website_url" name="website_url" value={formData.website_url} onChange={handleChange} required />
          </div>
          <div class="form-class">
            <label htmlFor="location">Location:</label>
            <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} required />
          </div>
          <div class="form-class">
            <label htmlFor="registration_fee">Registration Fee:</label>
            <input type="number" id="registration_fee" name="registration_fee" value={formData.registration_fee} onChange={handleChange} required />
          </div>
          <div class="form-class">
            <label htmlFor="submission_formats">Submission Formats:</label>
            <select id="submission_formats" name="submission_formats" value={formData.submission_formats} onChange={handleChange} required>
              <option value="">Select an option</option>
              <option value="GitHub Repo">GitHub Repo</option>
              <option value="Demo URL">Demo URL</option>
              {/* Add more options as needed */}
            </select>
          </div>
          <div class="form-class">
            <label htmlFor="tags">Tags:</label>
            <input type="text" id="tags" name="tags" value={formData.tags} onChange={handleChange} required />
          </div>
          <button type="submit">Create Hackathon</button>
        </form>
      </div>
    </div>
  );
};

export default CreateHackathonForm;