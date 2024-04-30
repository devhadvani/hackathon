import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './HackthonDetail.css';
import 'react-toastify/dist/ReactToastify.css';
const API_URL = 'http://127.0.0.1:8000/api/v1/hackathons/';

const HackathonDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUserOrganizer, setIsUserOrganizer] = useState(false);
  const [participationType, setParticipationType] = useState(null);
  const [isUserRegistered, setIsUserRegistered] = useState(false);
  
  useEffect(() => {
    const fetchHackathon = async () => {
      try {
        const accessToken = localStorage.getItem('token');
        const config = {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        };
        let user_response = {}; // Declare as let instead of const
        
        if (accessToken) {
          try {
            user_response = await axios.get('http://127.0.0.1:8000/api/v1/auth/users/me/', {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            });
          } catch (error) {
            console.error('Error fetching user details:', error);
            // Handle error gracefully
          }
        }
  
        const response = await axios.get(`${API_URL}${id}/`);
        const participate_response = await axios.get(`${API_URL}${id}/participate`);
        setHackathon(response.data);
        setLoading(false);
        
        // Check if user_response.data exists before accessing its properties
        const loggedInUserId = user_response.data ? user_response.data.id : null;
        
        setIsUserOrganizer(response.data.organizers[0] === parseInt(loggedInUserId));
        setIsUserRegistered(participate_response.data.some(participant => 
          (participant.user.id === loggedInUserId && 
          participant.hackathon === parseInt(id)) ||
          (participant.team_members.some(member => member.user.id === loggedInUserId))
        ));
      } catch (error) {
        console.error('Error fetching hackathon details:', error);
      }
    };
  
    fetchHackathon();
  }, [id]);
  
  const handleRegisterClick = async () => {
    if (!localStorage.getItem('token')) {
      toast.error('Please login to participate in the hackathon.');
      navigate('/login');
      return;
    }
    setParticipationType('Team'); // Default to Team participation
  };


  const handleSoloParticipationClick = async () => {
    setParticipationType('Solo');
  };

  const handleParticipationSubmit = async () => {
    try {
      const accessToken = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      };
      const data = {
        participation_type: participationType,
        // Add other necessary fields for participation
      };
      const response = await axios.post(`http://127.0.0.1:8000/api/v1/hackathons/${id}/participate/`, data, config);
      // Handle success, e.g., show confirmation message

    } catch (error) {
      console.error('Error registering for hackathon:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const handleNavigation = (hackathonId) => {
    navigate(`/hackathons/${hackathonId}/participated`);
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  const tags = hackathon.tags.split(', ');
  return (
    <div>
    {/* <Link to="/hackathons">Back to Hackathon List</Link> */}

      <div className="main-title">
        <div className="hackathon-image">
          <img src={hackathon.front_image} alt="Front Image" />
        </div>
      <h1>{hackathon.title}</h1>
      </div>

      <div className="main-body">
        <div className="hackathon-details">
          <div className="detail-image">

        <img src={hackathon.banner_image} alt="Banner Image" />
          </div>
            <div className="title">
              Details
            </div>
            <div className="description">
                {hackathon.description}
            </div>
            <div className="title">
              What to Build
            </div>
            <div className="description">
                {hackathon.what_to_build}
            </div>
            <div className="title">
              What to Submit
            </div>
            <div className="description">
                {hackathon.what_to_build}
            </div>
            <div className="title">
              Prize Structure
            </div>
            <div className="description">
                {hackathon.prize_structure}
            </div>
            <div className="title">
              Submission Formate
            </div>
            <div className="description">
                {hackathon.submission_formats}
            </div>
            <div className="title">
              Tags
            </div>
            <div className="description">
            <div className="div">
          <ul className="details-tags">
            {tags.map((tag, index) => (
              <li key={index} className="detail-tag-item">{tag}</li>
            ))}
          </ul></div>
            </div>
        </div>
        <div className="schedule-card">
          <div className="dates-detail">
            <div className="date-title">
              Starts From
            </div>
            <div className="date-description">
            {formatDate(hackathon.start_date)}
            </div>
            <div className="date-title">
              Ends At
            </div>
            <div className="date-description">
            {formatDate(hackathon.end_date)}
            </div>
            <div className="date-title">
              Location
            </div>
            <div className="date-description">
              {hackathon.location}
            </div>
          </div>

            <div className="registration-close">
              <span>Rgistration close</span>
              <div className="registration-close-box">
              {formatDate(hackathon.registration_deadline)}
              </div>
            </div>
            {isUserRegistered ? (
        //  <ManageParticipant hackathonId={id} />
        <button onClick={() => handleNavigation(hackathon.id)} class="apply">Navigate to Participated</button>
            ):
            <button className='apply'>Apply</button>
            }
        </div>
      </div>

      

      {/* <p>Start Date: {hackathon.start_date}</p>
      <p>End Date: {hackathon.end_date}</p>
      <p>Registration Deadline: {hackathon.registration_deadline}</p>
      <p>Organizers: {hackathon.organizers.map(organizer => organizer.username).join(', ')}</p>
      <p>Website URL: {hackathon.website_url}</p>
      <p>Location: {hackathon.location}</p>
      <p>Registration Fee: {hackathon.registration_fee}</p>
      <p>Submission Formats: {hackathon.submission_formats}</p>
      <p>Tags: {hackathon.tags}</p> */}

      {/* {isUserRegistered ? (
        //  <ManageParticipant hackathonId={id} />
        <button onClick={() => handleNavigation(hackathon.id)}>Navigate to Participated</button>

) : (
  <>
    {!isUserOrganizer && (
      <>
        <button onClick={handleRegisterClick}>Register to Hackathon</button>
        {participationType && (
          <div>
            <p>You have chosen to participate {participationType === 'Team' ? 'in a team' : 'solo'}.</p>
            <button onClick={handleParticipationSubmit}>Submit</button>
          </div>
        )}
      </>
    )}
  </>
)} */}

     
      {/* Add more details as needed */}
    </div>
  );
};

export default HackathonDetail;
