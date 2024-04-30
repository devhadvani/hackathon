import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
// import './ManageHackathonDetails.css'; // Import CSS file
import './CreateHackthonForm.css';

const ManageHackathonDetails = () => {
  const { id } = useParams();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const participantsResponse = await axios.get(`http://127.0.0.1:8000/api/v1/hackathons/${id}/participate`);
        const projectsResponse = await axios.get(`http://127.0.0.1:8000/api/v1/hackathons/${id}/projects/`);

        setParticipants(participantsResponse.data);
        setProjects(projectsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (

    <div className="manage-hackathon-details">
      <h2>Participants in Hackathon</h2>
      <div className="participant-cards">
        {participants.map(participant => (
          <div key={participant.id} className="participant-card">
            <div className="participant-info">
              <p><strong>User:</strong> {participant.user.first_name} {participant.user.email}</p>
              <p><strong>Participation Type:</strong> {participant.participation_type}</p>
              {participant.team_members && participant.team_members.length > 0 && (
                <div className="team-members">
                  <h3>Team Members:</h3>
                  <ul>
                    {participant.team_members.map(member => (
                      <li key={member.id} className="team-member">
                        {member.user.first_name} {member.user.last_name} ({member.user.email}) - Role: {member.role}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="project-details">
              <h3>Project Details:</h3>
              <ul>
                {projects
                  .filter(project => project.team === participant.team)
                  .map(project => (
                    <li key={project.id} className="project-item">
                      <p><strong>Title:</strong> {project.title}</p>
                      <p><strong>Description:</strong> {project.description}</p>
                      <p><strong>GitHub Repo Link:</strong> {project.github_repo_link}</p>
                      {/* Add more project details as needed */}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
    
  );
};

export default ManageHackathonDetails;
