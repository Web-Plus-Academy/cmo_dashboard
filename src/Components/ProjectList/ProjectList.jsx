import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './projectlist.css'; // Import the external CSS file

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [completionLink, setCompletionLink] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const navigate = useNavigate(); // Hook to navigate to other routes

  // Fetch all projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:5000/projects/projects');
        // Filter only incomplete projects
        const incompleteProjects = response.data.projects.filter(
          (project) => !project.completed
        );
        setProjects(incompleteProjects);
      } catch (err) {
        Swal.fire('Error', 'Failed to fetch projects', 'error'); // SweetAlert for error
      }
    };

    fetchProjects();
  }, []);

  // Handle completion link input change
  const handleLinkChange = (e) => {
    setCompletionLink(e.target.value);
  };

  // Handle project selection
  const handleSelectProject = (id) => {
    setSelectedProjectId(id);
  };

  // Mark project as complete
  const handleCompleteProject = async (e) => {
    e.preventDefault();

    if (!selectedProjectId || !completionLink) {
      Swal.fire('Error', 'Please select a project and provide a completion link.', 'error');
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/projects/projects/${selectedProjectId}/complete`,
        { completionLink }
      );

      Swal.fire('Success', response.data.message, 'success');

      // Remove the completed project from the state
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project._id !== selectedProjectId)
      );

      // Clear form inputs
      setCompletionLink('');
      setSelectedProjectId('');
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Failed to mark project as complete', 'error');
    }
  };

  return (
    <div className="project-list-container">
      <h2>Project List</h2>

      <ul className="project-list">
        {projects.map((project) => (
          <li key={project._id} className="project-card">
            <h3>{project.name}</h3>
            <p>Taken Date: {new Date(project.takenDate).toLocaleDateString()}</p>
            <p>Deadline: {new Date(project.deadline).toLocaleDateString()}</p>
            <p>Status: {project.completed ? 'Completed' : 'In Progress'}</p>
            {project.completed && (
              <a href={project.completionLink} target="_blank" rel="noopener noreferrer">
                View Completion Link
              </a>
            )}

            {!project.completed && (
              <button onClick={() => handleSelectProject(project._id)} className="mark-complete-button">
                Mark as Complete
              </button>
            )}
          </li>
        ))}
      </ul>

      {selectedProjectId && (
        <div className="completion-form">
          <h3>Mark Project as Complete</h3>
          <input
            type="text"
            placeholder="Completion Link"
            value={completionLink}
            onChange={handleLinkChange}
            className="completion-link-input"
          />
          <button onClick={handleCompleteProject} className="submit-button">
            Submit Completion Link
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
