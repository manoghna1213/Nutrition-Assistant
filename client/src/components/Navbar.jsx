import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Navbar = ({ toggleSidebarOpen }) => {
  const { user, logout, toggleTheme, theme } = useContext(AuthContext);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  // Load unread notification count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!user) return;
      try {
        const res = await axios.get('/notifications');
        if (res.data.success) {
          const unread = res.data.data.filter(n => n.status === 'unread').length;
          setUnreadCount(unread);
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };

    fetchUnreadCount();
    
    // Poll notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg border-bottom px-3 py-2 bg-secondary" style={{ borderBottomColor: 'var(--border-color) !important' }}>
      <div className="container-fluid p-0">
        {/* Toggle Sidebar Button for Mobile */}
        <button 
          className="btn d-lg-none me-3" 
          onClick={toggleSidebarOpen}
          style={{ color: 'var(--text-primary)' }}
        >
          <i className="bi bi-list fs-3"></i>
        </button>

        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <div className="bg-success text-white p-1 rounded d-flex justify-content-center align-items-center" style={{ width: '32px', height: '32px' }}>
            <i className="bi bi-heart-pulse-fill"></i>
          </div>
          <span className="fw-bold tracking-tight text-primary">Nutrition Assistant</span>
        </Link>

        {/* Action Items */}
        <div className="d-flex align-items-center gap-3 ms-auto">
          {/* Light/Dark Toggle */}
          <button 
            className="theme-toggle-btn" 
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <i className={`bi ${theme === 'dark' ? 'bi-sun-fill text-warning' : 'bi-moon-fill'}`}></i>
          </button>

          {user && (
            <>
              {/* Notification Bell */}
              <Link 
                to="/notifications" 
                className="position-relative d-flex align-items-center text-decoration-none"
                style={{ color: 'var(--text-primary)' }}
                title="Notifications"
              >
                <i className="bi bi-bell-fill fs-5"></i>
                {unreadCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                    {unreadCount}
                  </span>
                )}
              </Link>

              {/* Profile Dropdown */}
              <div className="dropdown">
                <button 
                  className="btn d-flex align-items-center gap-2 border-0 dropdown-toggle" 
                  type="button" 
                  id="navbarDropdown" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <div 
                    className="rounded-circle bg-success text-white d-flex justify-content-center align-items-center text-uppercase fw-bold"
                    style={{ width: '34px', height: '34px', fontSize: '0.9rem' }}
                  >
                    {user.name.charAt(0)}
                  </div>
                  <span className="d-none d-md-inline fw-semibold">{user.name.split(' ')[0]}</span>
                </button>
                <ul 
                  className="dropdown-menu dropdown-menu-end shadow border-0 p-2" 
                  aria-labelledby="navbarDropdown"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
                >
                  <li className="px-3 py-2 border-bottom mb-2 text-primary" style={{ borderBottomColor: 'var(--border-color) !important' }}>
                    <div className="fw-bold">{user.name}</div>
                    <small className="text-secondary">{user.role}</small>
                  </li>
                  <li>
                    <Link className="dropdown-item rounded py-2 text-primary" to="/profile">
                      <i className="bi bi-person-fill me-2 text-secondary"></i> My Profile
                    </Link>
                  </li>
                  <li>
                    <button 
                      className="dropdown-item rounded py-2 text-danger" 
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i> Log Out
                    </button>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
