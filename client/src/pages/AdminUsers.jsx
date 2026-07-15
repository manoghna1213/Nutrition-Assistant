import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';

const AdminUsers = () => {
  const { user: currentAdmin } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const fetchUsersList = async () => {
    try {
      const res = await axios.get('/users');
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      showToast('Error loading users roster', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersList();
  }, []);

  const handleRoleToggle = async (userId, targetRole) => {
    try {
      const res = await axios.put(`/admin/users/${userId}`, { role: targetRole });
      if (res.data.success) {
        showToast(`User role promoted to ${targetRole}`, 'success');
        fetchUsersList();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Error toggling role status', 'danger');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (userId === currentAdmin._id) {
      return showToast('You cannot delete your own admin account', 'warning');
    }
    if (!window.confirm('Are you sure you want to delete this user profile? This will cascade-delete all linked meal charts and tracking history.')) return;

    try {
      const res = await axios.delete(`/users/${userId}`);
      if (res.data.success) {
        showToast('User account successfully purged', 'success');
        fetchUsersList();
      }
    } catch (err) {
      showToast('Error purging account record', 'danger');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === '' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading Users Directory...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in-element">
      <div className="mb-4">
        <h2 className="fw-extrabold mb-1 text-primary">User Management</h2>
        <p className="text-secondary">Purge active profiles or edit system access authorization roles.</p>
      </div>

      {/* Filters panels */}
      <div className="glass-panel p-3 mb-4 d-flex flex-column flex-md-row gap-3">
        <div className="flex-grow-1">
          <input 
            type="text" 
            className="form-control custom-input" 
            placeholder="Search by name or email address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ minWidth: '160px' }}>
          <select 
            className="form-select custom-input" 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="User">User (Client)</option>
            <option value="Dietitian">Dietitian</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Users table */}
      <div className="glass-panel p-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle" style={{ color: 'var(--text-primary)' }}>
            <thead>
              <tr style={{ borderColor: 'var(--border-color)' }}>
                <th>User Details</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Manage Roles</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map(u => (
                  <tr key={u._id} style={{ borderColor: 'var(--border-color)' }}>
                    <td>
                      <div className="fw-bold text-primary">{u.name}</div>
                      <small className="text-secondary">{u.email}</small>
                    </td>
                    <td>{u.phone || '-'}</td>
                    <td>
                      <span className={`badge ${
                        u.role === 'Admin' ? 'bg-danger' :
                        u.role === 'Dietitian' ? 'bg-info' : 'bg-success'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      {u._id !== currentAdmin._id ? (
                        <div className="d-flex gap-1">
                          <button 
                            onClick={() => handleRoleToggle(u._id, 'User')} 
                            className="btn btn-xs btn-outline-success py-1 px-2"
                            style={{ fontSize: '0.75rem' }}
                            disabled={u.role === 'User'}
                          >
                            Set Client
                          </button>
                          <button 
                            onClick={() => handleRoleToggle(u._id, 'Dietitian')} 
                            className="btn btn-xs btn-outline-info py-1 px-2"
                            style={{ fontSize: '0.75rem' }}
                            disabled={u.role === 'Dietitian'}
                          >
                            Set Dietitian
                          </button>
                        </div>
                      ) : (
                        <span className="text-muted small">Self Admin</span>
                      )}
                    </td>
                    <td>
                      <button 
                        onClick={() => handleDeleteUser(u._id)} 
                        className="btn btn-outline-danger btn-sm border-0"
                        title="Delete User"
                        disabled={u._id === currentAdmin._id}
                      >
                        <i className="bi bi-trash3-fill"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-secondary py-4">No matching accounts located in directory.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
