import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const EditHackathon = () => {
  const { id } = useParams();
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
    front_image: null,
    banner_image: null
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHackathon = async () => {
      try {
        const accessToken = localStorage.getItem('token');
        const config = {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        };
        const response = await axios.get(`http://127.0.0.1:8000/api/v1/hackathons/${id}/`, config);

        const formatDate = (dateString) => {
          const date = new Date(dateString);
          const year = date.getFullYear();
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const day = date.getDate().toString().padStart(2, '0');
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          return `${year}-${month}-${day}T${hours}:${minutes}`;
        };

        const formattedData = {
          ...response.data,
          start_date: formatDate(response.data.start_date),
          end_date: formatDate(response.data.end_date),
          registration_deadline: formatDate(response.data.registration_deadline)
        };
        setFormData(formattedData);
        setLoading(false);
        
      } catch (error) {
        console.error('Error fetching hackathon:', error);
      }
    };

    fetchHackathon();
  }, [id]);

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
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data' // Ensure correct content type for file upload
        }
      };

      const formDataWithImages = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataWithImages.append(key, value);
      });
    
      const response = await axios.put(`http://127.0.0.1:8000/api/v1/hackathons/${id}/`, formDataWithImages, config);
      console.log('Hackathon updated:', response.data);
      navigate("/manage-hackathons");
    } catch (error) {
      console.error('Error updating hackathon:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h1>Edit Hackathon</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="what_to_build">What to Build:</label>
          <textarea id="what_to_build" name="what_to_build" value={formData.what_to_build} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="what_to_submit">What to Submit:</label>
          <textarea id="what_to_submit" name="what_to_submit" value={formData.what_to_submit} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="prize_structure">Prize Structure:</label>
          <textarea id="prize_structure" name="prize_structure" value={formData.prize_structure} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="total_prize">Total Prize:</label>
          <input type="number" id="total_prize" name="total_prize" value={formData.total_prize} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="start_date">Start Date:</label>
          <input type="datetime-local" id="start_date" name="start_date" value={formData.start_date} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="end_date">End Date:</label>
          <input type="datetime-local" id="end_date" name="end_date" value={formData.end_date} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="registration_deadline">Registration Deadline:</label>
          <input type="datetime-local" id="registration_deadline" name="registration_deadline" value={formData.registration_deadline} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="website_url">Website URL:</label>
          <input type="url" id="website_url" name="website_url" value={formData.website_url} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="location">Location:</label>
          <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="registration_fee">Registration Fee:</label>
          <input type="number" id="registration_fee" name="registration_fee" value={formData.registration_fee} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="submission_formats">Submission Formats:</label>
          <input type="text" id="submission_formats" name="submission_formats" value={formData.submission_formats} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="tags">Tags:</label>
          <input type="text" id="tags" name="tags" value={formData.tags} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="front_image">Front Image:</label>
          <input type="file" id="front_image" name="front_image" onChange={handleImageChange} accept="image/*" />
        </div>
        <div>
          <label htmlFor="banner_image">Banner Image:</label>
          <input type="file" id="banner_image" name="banner_image" onChange={handleImageChange} accept="image/*" />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditHackathon;
