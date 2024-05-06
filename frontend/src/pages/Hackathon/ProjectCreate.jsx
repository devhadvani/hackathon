import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProjectCreate = ({ hackathonId, teamId, isLeader }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    github_repo_link: '',
    live_website_link: '',
    video_link: ''
  });

  const [projectCreated, setProjectCreated] = useState(false);
  const [title, setTitle] = useState('');
  const [project, setProject] = useState({});
  const [description, setDescription] = useState('');

  useEffect(() => {
    const checkProjectCreation = async () => {
      try {
        const accessToken = localStorage.getItem('token');
        const config = {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        };
        const response = await axios.get(`http://localhost:8000/api/v1/hackathons/${hackathonId}/projects/`, config);

        const projectExists = response.data.some(project => project.team === teamId && project.hackathon === hackathonId);

        if (projectExists) {
          const project = response.data.find(project => project.team === teamId && project.hackathon === hackathonId);
          setTitle(project.title);
          setDescription(project.description);
          setProject(project);
          setFormData({
            title: project.title,
            description: project.description,
            github_repo_link: project.github_repo_link,
            live_website_link: project.live_website_link,
            video_link: project.video_link
          });
        }
        setProjectCreated(projectExists);
      } catch (error) {
        console.error('Error checking project creation:', error);
      }
    };

    checkProjectCreation();
  }, [hackathonId, teamId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
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
      // If project is already created, use update API
      if (projectCreated) {
        const response = await axios.patch(`http://localhost:8000/api/v1/hackathons/${hackathonId}/projects/${project.id}/update/`, formData, config);
        console.log('Project updated successfully:', response.data);
      } else {
        // If project is not created, use create API
        const response = await axios.post(`http://localhost:8000/api/v1/hackathons/${hackathonId}/project/create/`, {
          ...formData,
          team: teamId
        }, config);
        console.log('Project created successfully:', response.data);
        setProjectCreated(true);
      }
    } catch (error) {
      console.error('Error updating/creating project:', error);
    }
  };

  return (
    <div>
      <div className="project-info">
      <h2 className='title'>{title}</h2>
      <h3 className='description'>{description}</h3>
      </div>

      <h2>{projectCreated ? '' : 'Create Project'}</h2>
      {projectCreated ? (
        <>
          {isLeader ? (
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="githubLink">GitHub Link:</label>
                <input
                  type="text"
                  id="githubLink"
                  name="github_repo_link"
                  value={formData.github_repo_link}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="liveWebsiteLink">Live Website Link:</label>
                <input
                  type="text"
                  id="liveWebsiteLink"
                  name="live_website_link"
                  value={formData.live_website_link}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="videoLink">Video Link:</label>
                <input
                  type="text"
                  id="videoLink"
                  name="video_link"
                  value={formData.video_link}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className='update-project'>Update Project</button>
            </form>
          ) :  <> 
        <p> <h3>github :- </h3>{project.github_repo_link}</p>
        <p><h3>live website :-   </h3>{project.live_website_link}</p>
        <p><h3>video :-   </h3>{project.video_link}</p>
          </>}
        </>
      ) : (

        <>
        {isLeader ?
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <button type="submit">Create Project</button>
        </form>
          :
          <> 
        null
          </>
          }
         </>
      )}

    </div>
  );
};

export default ProjectCreate;
