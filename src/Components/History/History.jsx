import { useEffect, useState } from 'react';
import axios from '../../axiosConfig.js';
import Swal from 'sweetalert2';
import './history.css'; // Import external CSS

const History = () => {
  const [completedProjects, setCompletedProjects] = useState([]);

  // Fetch completed projects on component mount
  useEffect(() => {
    const fetchCompletedProjects = async () => {
      try {
        const response = await axios.get('/projects/projects/completed');
        // Safeguard to ensure response format
        const projects = response.data?.projects || [];
        setCompletedProjects(projects);
      } catch (err) {
        Swal.fire(
          'Error',
          err.response?.data?.message || 'Failed to fetch completed projects',
          'error'
        );
      }
    };

    fetchCompletedProjects();
  }, []);

  return (
    <div className="history-container">
      <h2>Completed Projects</h2>
      {completedProjects.length === 0 ? (
        <p>No completed projects to display.</p>
      ) : (
        <ul className="completed-projects-list">
          {completedProjects.map((project) => (
            <li key={project._id} className="project-card">
              <h3>{project.name}</h3>
              <p>Taken Date: {new Date(project.takenDate).toLocaleDateString()}</p>
              <p>Deadline: {new Date(project.deadline).toLocaleDateString()}</p>
              <a
                href={project.completionLink}
                target="_blank"
                rel="noopener noreferrer"
                className="completion-link"
              >
                View Completion Link
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default History;
