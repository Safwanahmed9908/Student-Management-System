import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axiosInstance';
import Alert from '../components/Alert';

const AddStudent = () => {
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    email: '',
    department: 'Computer Science & Engineering',
    year: '1st Year',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const { name, rollNumber, email, department, year } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !rollNumber.trim() || !email.trim() || !department.trim() || !year.trim()) {
      setError('Please fill out all required fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await API.post('/students', {
        name: name.trim(),
        rollNumber: rollNumber.trim().toUpperCase(),
        email: email.trim().toLowerCase(),
        department: department.trim(),
        year: year.trim(),
      });

      setSuccess('Student record added successfully! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1200);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add student. Please check input values.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container form-page-container">
      <div className="form-card">
        <div className="form-header">
          <Link to="/dashboard" className="back-link">
            &larr; Back to Dashboard
          </Link>
          <h2>Add New Student</h2>
          <p>Register a student record into the MongoDB database</p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} />}

        <form onSubmit={handleSubmit} className="student-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">
                Student Full Name <span className="req">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                placeholder="e.g. John Doe"
                value={name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="rollNumber">
                Roll / Registration Number <span className="req">*</span>
              </label>
              <input
                type="text"
                id="rollNumber"
                name="rollNumber"
                className="form-control"
                placeholder="e.g. CS2024-001"
                value={rollNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="email">
                Student Email Address <span className="req">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                placeholder="e.g. john.doe@student.college.edu"
                value={email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="department">
                Department / Branch <span className="req">*</span>
              </label>
              <select
                id="department"
                name="department"
                className="form-control"
                value={department}
                onChange={handleChange}
                required
              >
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Data Science & AI">Data Science & AI</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="year">
                Academic Year <span className="req">*</span>
              </label>
              <select
                id="year"
                name="year"
                className="form-control"
                value={year}
                onChange={handleChange}
                required
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <Link to="/dashboard" className="btn btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !!success}
            >
              {loading ? 'Saving Student...' : 'Save Student Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;
