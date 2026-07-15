import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';

const Notifications = () => {
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const handleMarkAsRead = async (id) => {
    try {
      const res = await axios.put(`/notifications/${id}`);
      if (res.data.success) {
        fetchNotifications();
      }
    } catch (err) {
      showToast('Error marking notification as read', 'danger');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await axios.put('/notifications/read-all');
      if (res.data.success) {
        showToast('All notifications marked as read', 'success');
        fetchNotifications();
      }
    } catch (err) {
      showToast('Error updating notifications', 'danger');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading Notifications...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in-element">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-extrabold mb-1 text-primary">Notification Center</h2>
          <p className="text-secondary mb-0">Stay informed with updates regarding your goals, assignments, and meal recommendations.</p>
        </div>
        {notifications.length > 0 && (
          <button onClick={handleMarkAllRead} className="btn btn-outline-success">
            <i className="bi bi-check-all me-1"></i> Mark All as Read
          </button>
        )}
      </div>

      <div className="glass-panel p-4">
        <div className="d-flex flex-column gap-3">
          {notifications.length > 0 ? (
            notifications.map(n => (
              <div 
                key={n._id} 
                className={`p-3 rounded border d-flex justify-content-between align-items-center ${
                  n.status === 'unread' ? 'bg-success-subtle border-success' : 'bg-secondary border-secondary'
                }`}
                style={{ 
                  borderColor: n.status === 'unread' ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-color)'
                }}
              >
                <div>
                  <h6 className="fw-bold text-primary mb-1 d-flex align-items-center gap-2">
                    {n.status === 'unread' && <span className="d-inline-block bg-danger rounded-circle" style={{ width: '8px', height: '8px' }}></span>}
                    {n.title}
                  </h6>
                  <p className="text-secondary small mb-1">{n.message}</p>
                  <small className="text-secondary" style={{ fontSize: '0.7rem' }}>
                    {new Date(n.createdAt).toLocaleString()}
                  </small>
                </div>
                {n.status === 'unread' && (
                  <button 
                    onClick={() => handleMarkAsRead(n._id)} 
                    className="btn btn-xs btn-outline-success"
                    style={{ fontSize: '0.8rem' }}
                  >
                    Mark read
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-5 text-secondary">
              <i className="bi bi-bell-slash fs-1 d-block mb-3 text-muted"></i>
              <h5 className="fw-bold text-primary">No Notifications</h5>
              <p className="small mb-0">You are completely caught up! We'll alert you here when new actions register.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
