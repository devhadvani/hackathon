import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ProjectCreate from './ProjectCreate';
import './ManageParticipant.css'; // Import CSS file for styling

const ManageParticipant = () => {
  const { id } = useParams();
  const [teamName, setTeamName] = useState('');
  const [email, setEmail] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [team_id, setTeamid] = useState([]);
  const [hackathonId, setHackathonId] = useState([]);
  const [isTeamCreated, setIsTeamCreated] = useState(false);
  const [showProjectDetails, setShowProjectDetails] = useState(true);
  const [error, setError] = useState('');
  const [isLeader, setIsLeader] = useState(false); // State to track if the user is a team leader

  useEffect(() => {
    const checkTeamCreation = async () => {
      try {
        const accessToken = localStorage.getItem('token');
        const config = {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        };
        const user_response = await axios.get('http://127.0.0.1:8000/api/v1/auth/users/me/', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        const userId = user_response.data.id;
        const response = await axios.get(`http://localhost:8000/api/v1/hackathons/${id}/participate/`, config);

        const teamMemberEntry = response.data.find(entry => {
         return  entry.team_members.find(member => member.user.id === parseInt(userId));
        });
        // console.log("dgnd",teamMemberEntry.team_members);
        if (teamMemberEntry) {
          const isLeader = teamMemberEntry.team_members.some(member => member.role === "Leader" && member.user.id === parseInt(userId));
        //   console.log("is teamleader",isLeader);
          setIsLeader(isLeader);
          const teamId = teamMemberEntry.team;
          const teamMembersEmails = teamMemberEntry.team_members.map(member => member.user.email);
          setIsTeamCreated(teamMemberEntry.has_created_team);
          setTeamid(teamId);
          setHackathonId(teamMemberEntry.hackathon);
          setTeamMembers(teamMembersEmails);
        }
      } catch (error) {
        console.error('Error checking team creation:', error);
      }
    };

    checkTeamCreation();
  }, [id]);

  const handleTeamNameChange = (event) => {
    setTeamName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleAddTeamMember = async () => {
    try {
      const accessToken = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      };
      await axios.post(`http://127.0.0.1:8000/api/v1/hackathons/${id}/teams/add-member/`, {
        email: email
      }, config);
      setTeamMembers([...teamMembers, email]);
      setEmail('');
      setError('');
    } catch (error) {
      console.error('Error adding team member:', error.response.data);
      setError('Error adding team member. ' + error.response.data.error);
    }
  };

  const handleCreateTeam = async () => {
    try {
      const accessToken = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      };
      await axios.post(`http://127.0.0.1:8000/api/v1/hackathons/${id}/teams/create/`, {
        name: teamName
      }, config);
      setIsTeamCreated(true);
      setError('');
    } catch (error) {
      console.error('Error creating team:', error);
      setError('Error creating team. Please try again.');
    }
  };

  const handleRemoveTeamMember = async (email) => {
    try {
      const accessToken = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        data: { email: email }
      };
      await axios.delete(`http://127.0.0.1:8000/api/v1/hackathons/${id}/teams/remove-member/`, config);
      setTeamMembers(teamMembers.filter(member => member !== email));
      setError('');
    } catch (error) {
      console.error('Error removing team member:', error.response.data);
      setError('Error removing team member. ' + error.response.data.error);
    }
  };

  const toggleProjectDetails = () => {
    setShowProjectDetails(true);
  };

  const toggleManageTeam = () => {
    setShowProjectDetails(false);
  };

  return (
    <div className='bg-image'>   <div className="manage-participant-container">
      <div className="toggle-buttons">
        <button className={!showProjectDetails ? "active" : ""} onClick={toggleManageTeam}>Manage Team</button>
        <button className={showProjectDetails ? "active" : ""} onClick={toggleProjectDetails}>Project Details</button>
      </div>
      {showProjectDetails ? (
        <ProjectCreate hackathonId={hackathonId} teamId={team_id} isLeader={isLeader}/>
      ) : (
        <>
          {!isTeamCreated ? (
            <>
              <label htmlFor="teamName">Team Name:</label>
              <input type="text" id="teamName" value={teamName} onChange={handleTeamNameChange} />
              <br />
               <button onClick={handleCreateTeam}>Create Team</button>
            </>
          ) : (
            <>
          {isLeader ?   <> <label htmlFor="email">Email:</label>
               <input type="email" id="email" value={email} onChange={handleEmailChange} />
               <button onClick={handleAddTeamMember}>Add Team Member</button> </>: null}
              <br />
              <h3>Team Members:</h3>
              <ul>
                {teamMembers.map((member, index) => (
                  <li key={index}>
                    {member}
                    {isLeader ? (
                      <button onClick={() => handleRemoveTeamMember(member)}>Remove</button>
                    ) : null}
                  </li>
                ))}
              </ul>
            </>
          )}
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </>
      )}
    </div>
    </div>
    
  );
};

export default ManageParticipant;
