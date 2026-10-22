import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axiosInstance';
import Alert from '../components/Alert';
import ConfirmModal from '../components/ConfirmModal';

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch students from API
  const fetchStudents = async (search = '') => {
    try {
      setLoading(true);
      setError('');
      const endpoint = search.trim()
        ? `/students?search=${encodeURIComponent(search.trim())}`
        : '/students';
      const res = await API.get(endpoint);
      setStudents(res.data.data || []);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError(err.response?.data?.message || 'Failed to load student records from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(searchTerm);
  }, [searchTerm]);

  // Open delete confirm modal
  const promptDelete = (student) => {
    setStudentToDelete(student);
    setDeleteModalOpen(true);
  };

  // Confirm delete action
  const confirmDelete = async () => {
    if (!studentToDelete) return;
    try {
      setDeleting(true);
      await API.delete(`/students/${studentToDelete._id}`);
      setSuccessMsg(`Student "${studentToDelete.name}" (${studentToDelete.rollNumber}) deleted successfully.`);
      setDeleteModalOpen(false);
      setStudentToDelete(null);
      // Refresh list
      fetchStudents(searchTerm);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete student record.');
    } finally {
      setDeleting(false);
    }
  };

  // Stats calculation
  const stats = useMemo(() => {
    const total = students.length;
    const departments = new Set(students.map((s) => s.department)).size;
    return { total, departments };
  }, [students]);

  return (
    <div className="dashboard-page container">
      {/* Page Title & Quick Actions */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Student Records Dashboard</h1>
          <p className="page-subtitle">Manage, search, and monitor student academic profiles</p>
        </div>
        <div className="page-actions">
          <Link to="/add-student" className="btn btn-primary">
            + Add New Student
          </Link>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <Alert type="success" message={successMsg} onClose={() => setSuccessMsg('')} />
      )}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Metrics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-blue">🎓</div>
          <div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Registered Students</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-green">🏛️</div>
          <div>
            <div className="stat-value">{stats.departments}</div>
            <div className="stat-label">Academic Departments</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-purple">⚡</div>
          <div>
            <div className="stat-value">Live Sync</div>
            <div className="stat-label">MongoDB REST Integration</div>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="table-controls">
        <div className="search-bar-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, roll number, department, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="clear-search-btn"
              onClick={() => setSearchTerm('')}
              title="Clear search"
            >
              &times;
            </button>
          )}
        </div>

        <button
          onClick={() => fetchStudents(searchTerm)}
          className="btn btn-secondary btn-icon"
          title="Refresh Table"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Data Table */}
      <div className="table-container">
        {loading ? (
          <div className="table-loading">
            <div className="spinner"></div>
            <p>Loading student records from database...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📂</div>
            <h3>No Student Records Found</h3>
            <p>
              {searchTerm
                ? `No student matching "${searchTerm}" was found.`
                : 'There are currently no students in the database. Add your first student to get started!'}
            </p>
            {searchTerm ? (
              <button onClick={() => setSearchTerm('')} className="btn btn-secondary">
                Clear Search Filter
              </button>
            ) : (
              <Link to="/add-student" className="btn btn-primary">
                + Add Student Now
              </Link>
            )}
          </div>
        ) : (
          <div className="responsive-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="text-center">Roll No.</th>
                  <th className="text-center">Student Name</th>
                  <th className="text-center">Email</th>
                  <th className="text-center">Department</th>
                  <th className="text-center">Academic Year</th>
                  <th className="text-center">Date Added</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr className="text-center" key={student._id}>
                    <td>
                      <span className="badge badge-roll">{student.rollNumber}</span>
                    </td>
                    <td className="font-semibold">{student.name}</td>
                    <td className="text-muted">{student.email}</td>
                    <td>
                      <span className="badge badge-dept">{student.department}</span>
                    </td>
                    <td>
                      <span className="badge badge-year">{student.year}</span>
                    </td>
                    <td className="text-muted text-sm">
                      {new Date(student.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Link
                          to={`/edit-student/${student._id}`}
                          className="btn btn-action btn-edit"
                          title="Edit Student"
                        >
                          ✏️ Edit
                        </Link>
                        <button
                          onClick={() => promptDelete(student)}
                          className="btn btn-action btn-delete"
                          title="Delete Student"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Student Deletion */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Confirm Student Deletion"
        message={
          studentToDelete
            ? `Are you sure you want to permanently delete "${studentToDelete.name}" (Roll No: ${studentToDelete.rollNumber})? This operation cannot be reversed.`
            : ''
        }
        confirmText={deleting ? 'Deleting...' : 'Yes, Delete Student'}
        onConfirm={confirmDelete}
        onCancel={() => {
          if (!deleting) {
            setDeleteModalOpen(false);
            setStudentToDelete(null);
          }
        }}
        isDanger={true}
      />
    </div>
  );
};

export default Dashboard;
