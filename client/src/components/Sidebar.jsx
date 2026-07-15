import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''} d-flex flex-column`}>
      {/* Header (Branding inside sidebar for mobile) */}
      <div className="p-4 border-bottom border-secondary d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-heart-pulse-fill text-success fs-4"></i>
          <span className="fw-bold fs-5 tracking-tight text-white">Wellness Hub</span>
        </div>
        <button 
          className="btn btn-close btn-close-white d-lg-none" 
          onClick={closeSidebar}
          aria-label="Close"
        ></button>
      </div>

      {/* Nav Links */}
      <nav className="flex-grow-1 py-3">
        <NavLink 
          to="/" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          onClick={closeSidebar}
          end
        >
          <i className="bi bi-grid-1x2-fill"></i>
          <span>Dashboard</span>
        </NavLink>

        {user.role === 'User' && (
          <>
            <NavLink 
              to="/progress" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <i className="bi bi-activity"></i>
              <span>Log Daily Meals</span>
            </NavLink>

            <NavLink 
              to="/mealplans" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <i className="bi bi-calendar-heart-fill"></i>
              <span>Meal Plans</span>
            </NavLink>

            <NavLink 
              to="/ai-recommend" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <i className="bi bi-robot"></i>
              <span>AI Diet Recommendation</span>
            </NavLink>

            <NavLink 
              to="/barcode" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <i className="bi bi-qr-code-scan"></i>
              <span>Barcode Scanner</span>
            </NavLink>
          </>
        )}

        {user.role === 'Dietitian' && (
          <>
            <NavLink 
              to="/create-meal-plan" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <i className="bi bi-plus-circle-fill"></i>
              <span>Create Meal Plan</span>
            </NavLink>
          </>
        )}

        {user.role === 'Admin' && (
          <>
            <NavLink 
              to="/admin-users" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <i className="bi bi-people-fill"></i>
              <span>User Management</span>
            </NavLink>
          </>
        )}

        <NavLink 
          to="/profile" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          onClick={closeSidebar}
        >
          <i className="bi bi-person-bounding-box"></i>
          <span>My Profile</span>
        </NavLink>
      </nav>

      {/* Footer / User display */}
      <div className="p-3 border-top border-secondary bg-dark text-center">
        <div className="text-secondary small">Logged in as:</div>
        <div className="text-white fw-bold text-truncate">{user.name}</div>
        <div className="badge bg-success text-white mt-1" style={{ fontSize: '0.75rem' }}>{user.role}</div>
      </div>
    </aside>
  );
};

export default Sidebar;
