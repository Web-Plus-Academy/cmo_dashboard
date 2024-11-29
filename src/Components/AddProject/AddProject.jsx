import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './addproject.css'; // Import the external CSS file

const CreateProjectForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    takenDate: '',
    deadline: '',
    pdf: '',
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/projects/addproject', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Show success alert
      Swal.fire({
        icon: 'success',
        title: 'Project Created',
        text: response.data.message,
      });

      // Reset form
      setFormData({
        name: '',
        takenDate: '',
        deadline: '',
        pdf: '',
      });
    } catch (err) {
      // Show error alert
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Failed to create project',
      });
    }
  };

  return (
    <div className="create-project-form">
      <h2>Create Project</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Project Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Taken Date</label>
          <input
            type="date"
            name="takenDate"
            value={formData.takenDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Deadline</label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>PDF (URL or Path)</label>
          <input
            type="text"
            name="pdf"
            value={formData.pdf}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Create Project
        </button>
      </form>
    </div>
  );
};

export default CreateProjectForm;
