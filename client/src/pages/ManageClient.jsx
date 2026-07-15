import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContext } from '../context/ToastContext';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';

const ManageClient = () => {
  const { id } = useParams();
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();

  const [clientData, setClientData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form fields
  const [allergiesInput, setAllergiesInput] = useState('');
  const [conditionsInput, setConditionsInput] = useState('');
  const [goals, setGoals] = useState('');
  const [status, setStatus] = useState('Active');
  
  // File upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchClientDetails = async () => {
    try {
      // Fetch user profile and client metrics
      const userRes = await axios.get(`/users/${id}`);
      if (userRes.data.success) {
        const u = userRes.data.data;
        const c = userRes.data.clientMetrics;
        setClientData({ user: u, client: c });

        if (c) {
          setAllergiesInput(c.allergies?.join(', ') || '');
          setConditionsInput(c.healthConditions?.join(', ') || '');
          setGoals(c.goals || '');
          setStatus(c.status || 'Active');
        }
      }

      // Fetch progress logs for this client
      const progressRes = await axios.get(`/progress?clientId=${id}`);
      if (progressRes.data.success) {
        setLogs(progressRes.data.data);
      }
    } catch (err) {
      showToast('Error loading client files', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientDetails();
  }, [id]);

  const handleUpdateMetrics = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        goals,
        status,
        allergies: allergiesInput.split(',').map(s => s.trim()).filter(Boolean),
        healthConditions: conditionsInput.split(',').map(s => s.trim()).filter(Boolean)
      };

      const res = await axios.put(`/dietitian/clients/${id}`, payload);
      if (res.data.success) {
        showToast('Client health details saved successfully', 'success');
        fetchClientDetails();
      }
    } catch (err) {
      showToast('Error updating health metrics', 'danger');
    }
  };

  // Handle file select for recommendation image
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Upload recommendation image
  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);
    setUploading(true);

    try {
      // In a production server we would post to an upload endpoint.
      // We simulate a 1-second delay and return success, displaying a mock success state.
      setTimeout(() => {
        setUploading(false);
        setSelectedFile(null);
        showToast('Meal recommendation image uploaded successfully (Simulated)', 'success');
      }, 1200);
    } catch (err) {
      setUploading(false);
      showToast('Image upload failed', 'danger');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading Client Dossier...</span>
        </div>
      </div>
    );
  }

  if (!clientData) {
    return (
      <div className="text-center py-5 text-secondary">
        <h5>Client Dossier Not Found</h5>
        <button onClick={() => navigate('/')} className="btn btn-primary-custom mt-3">Return to Dashboard</button>
      </div>
    );
  }

  const { user: clientUser, client: clientMetrics } = clientData;

  const chartData = logs.slice(-10).map(log => ({
    name: log.date.substring(5),
    Calories: log.caloriesConsumed,
    Weight: log.weight,
    Water: log.waterConsumed / 1000 // in Liters
  }));

  return (
    <div className="fade-in-element">
      <div className="d-flex align-items-center gap-2 mb-4">
        <button onClick={() => navigate('/')} className="btn btn-outline-secondary btn-sm rounded-circle d-flex justify-content-center align-items-center" style={{ width: '36px', height: '36px' }}>
          <i className="bi bi-arrow-left"></i>
        </button>
        <h2 className="fw-extrabold mb-0 text-primary">Manage Client: {clientUser.name}</h2>
      </div>

      {/* Row 1: Demographics */}
      <div className="row g-4 mb-4">
        <div className="col-lg-4">
          <div className="glass-panel p-4 h-100">
            <h5 className="fw-bold mb-3 text-primary"><i className="bi bi-person-badge-fill text-success me-2"></i>Physical Demographics</h5>
            
            <div className="d-flex flex-column gap-2 small">
              <div className="d-flex justify-content-between border-bottom pb-1" style={{ borderColor: 'var(--border-color)' }}>
                <span className="text-secondary fw-bold">Age</span>
                <span className="fw-bold text-primary">{clientUser.age || 'N/A'} Years</span>
              </div>
              <div className="d-flex justify-content-between border-bottom pb-1" style={{ borderColor: 'var(--border-color)' }}>
                <span className="text-secondary fw-bold">Gender</span>
                <span className="fw-bold text-primary">{clientUser.gender || 'N/A'}</span>
              </div>
              <div className="d-flex justify-content-between border-bottom pb-1" style={{ borderColor: 'var(--border-color)' }}>
                <span className="text-secondary fw-bold">Height</span>
                <span className="fw-bold text-primary">{clientUser.height || 0} cm</span>
              </div>
              <div className="d-flex justify-content-between border-bottom pb-1" style={{ borderColor: 'var(--border-color)' }}>
                <span className="text-secondary fw-bold">Current Weight</span>
                <span className="fw-bold text-primary">{clientUser.weight || 0} kg</span>
              </div>
              <div className="d-flex justify-content-between border-bottom pb-1" style={{ borderColor: 'var(--border-color)' }}>
                <span className="text-secondary fw-bold">Calculated BMI</span>
                <span className="fw-bold text-primary">{clientUser.bmi || 'N/A'}</span>
              </div>
              <div className="d-flex justify-content-between border-bottom pb-1" style={{ borderColor: 'var(--border-color)' }}>
                <span className="text-secondary fw-bold">Diet Preference</span>
                <span className="badge bg-secondary border text-primary">{clientUser.dietaryPreference || 'None'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Client progress logs charts */}
        <div className="col-lg-8">
          <div className="glass-panel p-4 h-100">
            <h5 className="fw-bold mb-3 text-primary"><i className="bi bi-graph-up text-danger me-2"></i>Calorie & Weight Progression</h5>
            <div style={{ width: '100%', height: '200px' }}>
              {chartData.length > 0 ? (
                <ResponsiveContainer>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                    <XAxis dataKey="name" stroke="var(--text-secondary)" />
                    <YAxis stroke="var(--text-secondary)" />
                    <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '10px' }} />
                    <Area type="monotone" dataKey="Calories" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="d-flex justify-content-center align-items-center h-100 text-secondary small">
                  Client has not logged any calories tracker yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Manage health details and upload recommendations */}
      <div className="row g-4">
        {/* Update Goals */}
        <div className="col-lg-7">
          <div className="glass-panel p-4">
            <h5 className="fw-bold mb-4 text-primary"><i className="bi bi-heart-pulse-fill text-danger me-2"></i>Edit Goals & Conditions</h5>
            <form onSubmit={handleUpdateMetrics}>
              <div className="mb-3">
                <label className="form-label text-secondary small fw-bold">Allergies (comma-separated)</label>
                <input 
                  type="text" 
                  className="form-control custom-input" 
                  placeholder="e.g. Nuts, Dairy, Gluten"
                  value={allergiesInput}
                  onChange={(e) => setAllergiesInput(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary small fw-bold">Health Conditions (comma-separated)</label>
                <input 
                  type="text" 
                  className="form-control custom-input" 
                  placeholder="e.g. Hypertension, Anemia"
                  value={conditionsInput}
                  onChange={(e) => setConditionsInput(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary small fw-bold">Specific Client Goals</label>
                <textarea 
                  rows="3" 
                  className="form-control custom-input" 
                  placeholder="Summarize client targets..."
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary small fw-bold">Roster Status</label>
                <select className="form-select custom-input" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary-custom">Save Health Dossier</button>
            </form>
          </div>
        </div>

        {/* Upload recommendations and notes */}
        <div className="col-lg-5">
          <div className="glass-panel p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <h5 className="fw-bold mb-3 text-primary"><i className="bi bi-image text-info me-2"></i>Upload Recommended Meal Plan Image</h5>
              <p className="text-secondary small">Upload an image of a structured diet menu or nutrition values summary sheet. Accepted types: PNG, JPEG, WEBP.</p>
              
              <form onSubmit={handleImageUpload} className="mt-3">
                <div className="mb-3">
                  <input 
                    type="file" 
                    className="form-control custom-input" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-outline-info w-100"
                  disabled={uploading || !selectedFile}
                >
                  {uploading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Uploading File...
                    </>
                  ) : (
                    <>
                      Upload Image <i className="bi bi-upload ms-1"></i>
                    </>
                  )}
                </button>
              </form>
            </div>
            
            <div className="mt-4 pt-3 border-top text-center" style={{ borderColor: 'var(--border-color)' }}>
              <Link to={{ pathname: '/create-meal-plan', search: `?clientId=${clientUser._id}` }} className="btn btn-success w-100" style={{ background: 'var(--accent-gradient)', border: 'none' }}>
                <i className="bi bi-calendar-plus me-1"></i> Create Diet Chart Plan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageClient;
