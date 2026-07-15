import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';

const DietitianDashboard = () => {
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  
  const [assignedClients, setAssignedClients] = useState([]);
  const [unassignedClients, setUnassignedClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    try {
      const assignedRes = await axios.get('/dietitian/clients');
      if (assignedRes.data.success) {
        setAssignedClients(assignedRes.data.data);
      }

      const unassignedRes = await axios.get('/dietitian/unassigned');
      if (unassignedRes.data.success) {
        setUnassignedClients(unassignedRes.data.data);
      }
    } catch (err) {
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [user]);

  const handleClaimClient = async (clientId) => {
    try {
      const res = await axios.put(`/dietitian/assign/${clientId}`);
      if (res.data.success) {
        showToast('Client assigned to you successfully', 'success');
        fetchClients();
      }
    } catch (err) {
      showToast('Error claiming client', 'danger');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading Dietitian Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in-element">
      <div className="mb-4">
        <h2 className="fw-extrabold mb-1 text-primary">Dietitian Dashboard</h2>
        <p className="text-secondary">Welcome, {user.name}. Manage your client portfolio and design nutrition guides.</p>
      </div>

      {/* Stats summaries */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6 col-lg-4">
          <div className="glass-panel p-3 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-secondary small fw-bold d-block">My Active Clients</span>
              <h3 className="fw-bold text-primary mb-0">{assignedClients.length}</h3>
            </div>
            <div className="metric-icon bg-success text-white" style={{ background: 'var(--accent-gradient)' }}>
              <i className="bi bi-people-fill"></i>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <div className="glass-panel p-3 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-secondary small fw-bold d-block">Unassigned Clients</span>
              <h3 className="fw-bold text-warning mb-0">{unassignedClients.length}</h3>
            </div>
            <div className="metric-icon bg-warning text-dark">
              <i className="bi bi-person-plus-fill"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Left panel: Active client management */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-8">
          <div className="glass-panel p-4">
            <h5 className="fw-bold mb-3 text-primary"><i className="bi bi-person-check-fill text-success me-2"></i>My Clients</h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle" style={{ color: 'var(--text-primary)' }}>
                <thead>
                  <tr style={{ borderColor: 'var(--border-color)' }}>
                    <th>Name</th>
                    <th>Diet preference</th>
                    <th>Allergies</th>
                    <th>Goals</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedClients.length > 0 ? (
                    assignedClients.map(client => (
                      <tr key={client._id} style={{ borderColor: 'var(--border-color)' }}>
                        <td className="fw-bold">{client.userId?.name || 'Deleted Account'}</td>
                        <td>
                          <span className="badge bg-secondary border text-primary">
                            {client.userId?.dietaryPreference || 'None'}
                          </span>
                        </td>
                        <td>
                          {client.allergies && client.allergies.length > 0 ? (
                            client.allergies.map((a, i) => (
                              <span key={i} className="badge bg-danger-subtle text-danger me-1">{a}</span>
                            ))
                          ) : (
                            <span className="text-secondary small">None</span>
                          )}
                        </td>
                        <td className="text-truncate" style={{ maxW: '160px' }}>{client.goals || 'No goals set'}</td>
                        <td>
                          <span className={`badge ${
                            client.status === 'Active' ? 'bg-success' : 'bg-warning text-dark'
                          }`}>
                            {client.status}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Link to={`/manage-client/${client.userId?._id}`} className="btn btn-outline-success btn-sm" title="View details and log notes">
                              <i className="bi bi-gear-fill"></i> Manage
                            </Link>
                            <Link to={{ pathname: '/create-meal-plan', search: `?clientId=${client.userId?._id}` }} className="btn btn-success btn-sm" style={{ background: 'var(--accent-gradient)', border: 'none' }} title="Create Meal Plan">
                              <i className="bi bi-calendar-plus"></i> Diet
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center text-secondary py-4">No active clients assigned yet. Claim an unassigned client from the dashboard.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Panel: Claiming queue */}
        <div className="col-12 col-lg-4">
          <div className="glass-panel p-4">
            <h5 className="fw-bold mb-3 text-primary"><i className="bi bi-search text-warning me-2"></i>Waiting Room Queue</h5>
            <p className="text-secondary small mb-4">Admit unassigned clients into your workspace to start generating diet plan charts.</p>
            
            <div className="d-flex flex-column gap-3">
              {unassignedClients.length > 0 ? (
                unassignedClients.map(client => (
                  <div key={client._id} className="p-3 bg-secondary rounded border" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="fw-bold text-primary mb-0">{client.userId?.name}</h6>
                      <span className="badge bg-secondary border text-primary small">
                        {client.userId?.dietaryPreference || 'None'}
                      </span>
                    </div>
                    <p className="text-secondary small mb-3 text-truncate">{client.goals || 'No goals specified'}</p>
                    <button 
                      onClick={() => handleClaimClient(client.userId?._id)} 
                      className="btn btn-sm btn-outline-success w-100"
                    >
                      <i className="bi bi-plus-lg me-1"></i> Accept Client
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-secondary small">
                  Queue is empty! All registered clients have dietitians.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietitianDashboard;
