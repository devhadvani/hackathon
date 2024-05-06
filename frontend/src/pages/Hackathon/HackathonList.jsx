import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HackathonCard from './HackathonCard';
import { Link } from 'react-router-dom';
const API_URL = 'http://127.0.0.1:8000/api/v1/hackathons/';

const HackathonList = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const accessToken = localStorage.getItem('token');
        const config = {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        };
        const response = await axios.get(API_URL, config);
        setHackathons(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching hackathons:', error);
      }
    };

    fetchHackathons();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
<div className="articles">
        {hackathons.map(hackathon => (
            <Link to={`/hackathons/${hackathon.id}`} className="card-link">
          <HackathonCard key={hackathon.id} hackathon={hackathon} />
          </Link>
        ))}
      </div> 
  );
};

export default HackathonList;
