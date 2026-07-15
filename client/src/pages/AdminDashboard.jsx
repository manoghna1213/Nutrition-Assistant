import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend,
  PieChart, Pie, Cell
} from 'recharts';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);

  const [stats, setStats] = useState(null);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await axios.get('/admin/dashboard');
        if (res.data.success) {
          setStats(res.data.data);
          setActivityLogs(res.data.data.activityLogs || []);
        }
      } catch (err) {
        showToast('Error loading platform metrics', 'danger');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, [user]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading Admin console...</span>
        </div>
      </div>
    );
  }

  const { stats: statsCounts = {}, analytics = {} } = stats || {};

  // Formulating data for preferences charts
  const dietChartData = (analytics.dietDemographics || []).map(item => ({
    name: item._id || 'None',
    value: item.count
  }));

  const genderChartData = (analytics.genderDemographics || []).map(item => ({
    name: item._id || 'Unknown',
    value: item.count
  }));

  const userGrowthChart = (analytics.userGrowth || []).reverse().map(item => ({
    name: `${item._id.year}-${item._id.month}`,
    Registrations: item.count
  }));

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="fade-in-element">
      <div className="mb-4">
        <h2 className="fw-extrabold mb-1 text-primary">System Administrator Console</h2>
        <p className="text-secondary">Monitor database entities, chart preferences, and manage permissions.</p>
      </div>

      {/* Grid count cards */}
      <div className="row g-3 mb-4">
        {/* Total Users */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="glass-panel p-3 h-100 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-secondary small fw-bold d-block">Registered Clients</span>
              <h2 className="fw-bold text-primary mb-0">{statsCounts.totalUsers}</h2>
            </div>
            <div className="metric-icon bg-success text-white" style={{ background: 'var(--accent-gradient)' }}>
              <i className="bi bi-people-fill"></i>
            </div>
          </div>
        </div>

        {/* Total Dietitians */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="glass-panel p-3 h-100 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-secondary small fw-bold d-block">Staff Dietitians</span>
              <h2 className="fw-bold text-primary mb-0">{statsCounts.totalDietitians}</h2>
            </div>
            <div className="metric-icon bg-info text-white">
              <i className="bi bi-shield-lock-fill"></i>
            </div>
          </div>
        </div>

        {/* Total Meal Plans */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="glass-panel p-3 h-100 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-secondary small fw-bold d-block">Diet Plans Created</span>
              <h2 className="fw-bold text-primary mb-0">{statsCounts.totalMealPlans}</h2>
            </div>
            <div className="metric-icon bg-warning text-dark">
              <i className="bi bi-journal-check"></i>
            </div>
          </div>
        </div>

        {/* Active Clients connections */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="glass-panel p-3 h-100 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-secondary small fw-bold d-block">Active Clients Links</span>
              <h2 className="fw-bold text-primary mb-0">{statsCounts.totalActiveClients}</h2>
            </div>
            <div className="metric-icon bg-primary text-white">
              <i className="bi bi-arrow-repeat"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Trend charts and preferences distributions */}
      <div className="row g-4 mb-4">
        {/* Diet preferences distribution */}
        <div className="col-12 col-md-6 col-lg-4">
          <div className="glass-panel p-4 h-100 d-flex flex-column justify-content-between">
            <h5 className="fw-bold text-primary mb-3">Client Dietary Preferences</h5>
            <div style={{ width: '100%', height: '220px' }} className="d-flex justify-content-center align-items-center">
              {dietChartData.length > 0 ? (
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={dietChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {dietChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }} />
                    <Legend layout="horizontal" align="center" verticalAlign="bottom" />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-secondary small">No registration demographics recorded.</div>
              )}
            </div>
          </div>
        </div>

        {/* User registrations growth curves */}
        <div className="col-12 col-md-6 col-lg-8">
          <div className="glass-panel p-4 h-100">
            <h5 className="fw-bold text-primary mb-3">Monthly User Registrations</h5>
            <div style={{ width: '100%', height: '220px' }}>
              {userGrowthChart.length > 0 ? (
                <ResponsiveContainer>
                  <LineChart data={userGrowthChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                    <XAxis dataKey="name" stroke="var(--text-secondary)" />
                    <YAxis stroke="var(--text-secondary)" />
                    <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }} />
                    <Line type="monotone" dataKey="Registrations" stroke="#10b981" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="d-flex justify-content-center align-items-center h-100 text-secondary small">
                  Waiting for monthly log curves...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Activity logs */}
      <div className="glass-panel p-4">
        <h5 className="fw-bold mb-4 text-primary"><i className="bi bi-cpu-fill text-success me-2"></i>Live System Activity logs</h5>
        <div className="d-flex flex-column gap-3">
          {activityLogs.length > 0 ? (
            activityLogs.map((log, index) => (
              <div 
                key={index} 
                className="d-flex align-items-start gap-3 p-3 bg-secondary rounded border"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <div className="mt-1">
                  <span className={`badge ${
                    log.type === 'Registration' ? 'bg-success' :
                    log.type === 'Meal Plan' ? 'bg-primary' : 'bg-info'
                  }`}>
                    {log.type}
                  </span>
                </div>
                <div className="flex-grow-1">
                  <p className="mb-0 text-primary small fw-semibold">{log.message}</p>
                  <small className="text-secondary" style={{ fontSize: '0.75rem' }}>
                    {new Date(log.time).toLocaleString()}
                  </small>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-secondary small">
              No activity logs compiled. Run seed script or log items to generate logs.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
