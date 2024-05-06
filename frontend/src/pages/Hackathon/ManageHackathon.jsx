import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import HackathonCard from './HackathonCard'; // Assuming you have a HackathonCard component

const ManageHackathon = () => {
  const [hostedHackathons, setHostedHackathons] = useState([]);
  const [participatedHackathons, setParticipatedHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  // const navigate = useNavigate();

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const accessToken = localStorage.getItem('token');
        const config = {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        };
        const userResponse = await axios.get('http://127.0.0.1:8000/api/v1/auth/users/me/', config);
        const userId = userResponse.data.id;

        // Fetch hosted hackathons
        const hostedResponse = await axios.get(`http://127.0.0.1:8000/api/v1/user-hackathons-hosted/${userId}/`, config);
        setHostedHackathons(hostedResponse.data);

        // Fetch participated hackathons
        const participatedResponse = await axios.get(`http://127.0.0.1:8000/api/v1/user-hackathons-participated/${userId}/`, config);
        setParticipatedHackathons(participatedResponse.data);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching hackathons check:', error);
      }
    };
// this
    fetchHackathons();
  }, []);

  const handleDelete = async (id) => {
    try {
      const accessToken = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      };
      await axios.delete(`http://127.0.0.1:8000/api/v1/hackathons/${id}/`, config);
      setHostedHackathons(hostedHackathons.filter(hackathon => hackathon.id !== id));
    } catch (error) {
      console.error('Error deleting hackathon:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Manage Your Hackathons</h1>
      <h2>Hosted Hackathons</h2>
      <div className="articles">
        {hostedHackathons.map(hackathon => (
          <div key={hackathon.id} className="cards">
            <Link to={`/manage-hackathons/${hackathon.id}`} className="card-link">
              <HackathonCard hackathon={hackathon} />
            </Link>
            <div className="button-group">
              <button onClick={() => handleDelete(hackathon.id)} className='delete'>Delete</button>
              <br/>
              <Link to={`/hackathons/${hackathon.id}/edit`}><button className='edit'>Edit</button></Link>
            </div>
          </div>
        ))}
      </div>
      <h2>Participated Hackathons</h2>
      <div className="articles">
        {participatedHackathons.map(hackathon => (
          <div key={hackathon.id} className="cards">
            <Link to={`/hackathons/${hackathon.id}`} className="card-link">
              <HackathonCard hackathon={hackathon} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageHackathon;
