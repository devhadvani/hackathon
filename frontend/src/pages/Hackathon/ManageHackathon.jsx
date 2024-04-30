import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import HackathonCard from './HackathonCard'; // Assuming you have a HackathonCard component

const ManageHackathon = () => {
  const [hackathons, setHackathons] = useState([]);
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
        const response = await axios.get(`http://127.0.0.1:8000/api/v1/user-hackathons/${userId}/`, config);
        console.log(response.data)
        setHackathons(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching hackathons:', error);
      }
    };

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
      setHackathons(hackathons.filter(hackathon => hackathon.id !== id));
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
      <div className="articles">
        {hackathons.map(hackathon => (
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
    </div>
  );
};

export default ManageHackathon;
