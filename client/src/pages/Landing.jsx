import React, { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Landing = () => {
  const { isAuthenticated } = useContext(AuthContext);

  // If already logged in, redirect straight to their role-specific dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="fade-in-element min-vh-100 d-flex flex-column justify-content-between" style={{ background: 'radial-gradient(circle at 10% 20%, var(--bg-secondary) 0%, var(--bg-primary) 90.1%)' }}>
      
      {/* Navigation Header */}
      <header className="px-4 py-3 border-bottom d-flex align-items-center justify-content-between" style={{ borderColor: 'var(--border-color) !important' }}>
        <div className="d-flex align-items-center gap-2">
          <div className="bg-success text-white p-2 rounded d-flex justify-content-center align-items-center" style={{ width: '40px', height: '40px' }}>
            <i className="bi bi-heart-pulse-fill fs-5"></i>
          </div>
          <span className="fw-extrabold fs-4 tracking-tight text-primary">Nutrition Assistant</span>
        </div>
        <div className="d-flex gap-2">
          <Link to="/login" className="btn btn-outline-success px-4" style={{ borderRadius: '10px' }}>Log In</Link>
          <Link to="/register" className="btn btn-success px-4" style={{ borderRadius: '10px', background: 'var(--accent-gradient)', border: 'none' }}>Get Started</Link>
        </div>
      </header>

      {/* Hero Body */}
      <main className="container my-auto py-5">
        <div className="row align-items-center justify-content-between g-5">
          {/* Tagline & Info */}
          <div className="col-lg-6">
            <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill fw-bold mb-3 d-inline-flex align-items-center gap-2">
              <i className="bi bi-shield-check"></i> Advanced Wellness Architecture
            </span>
            <h1 className="display-4 fw-extrabold mb-3 text-primary" style={{ lineHeight: 1.15 }}>
              Create, Manage, and Track Your <span className="text-success" style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Personalized Diet Plans</span>
            </h1>
            <p className="lead text-secondary mb-4">
              A comprehensive MERN-stack environment linking users with expert dietitians. Calculate BMI, log daily calorie/water intake, view analytical trend charts, and receive smart nutritional recommendations.
            </p>
            <div className="d-flex gap-3 flex-wrap">
              <Link to="/register" className="btn btn-primary-custom btn-lg">
                Create Free Account <i className="bi bi-arrow-right-short ms-2"></i>
              </Link>
              <Link to="/about" className="btn btn-outline-secondary btn-lg" style={{ borderRadius: '10px' }}>
                Learn Tech Stack
              </Link>
            </div>
            
            {/* Quick Metrics */}
            <div className="row mt-5 pt-3 border-top" style={{ borderColor: 'var(--border-color) !important' }}>
              <div className="col-4">
                <h3 className="fw-bold text-primary mb-0">14 Days</h3>
                <small className="text-secondary">Progress Analytics</small>
              </div>
              <div className="col-4">
                <h3 className="fw-bold text-primary mb-0">100%</h3>
                <small className="text-secondary">Secure Hashing</small>
              </div>
              <div className="col-4">
                <h3 className="fw-bold text-primary mb-0">Live</h3>
                <small className="text-secondary">Client Monitoring</small>
              </div>
            </div>
          </div>

          {/* Graphical Card panel */}
          <div className="col-lg-5">
            <div className="glass-panel p-4 position-relative overflow-hidden" style={{ border: '2px solid var(--border-color)' }}>
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="bg-success text-white p-3 rounded-circle" style={{ width: '56px', height: '56px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <i className="bi bi-clipboard-pulse fs-4"></i>
                </div>
                <div>
                  <h5 className="fw-bold mb-0 text-primary">Interactive Calorie Tracker</h5>
                  <small className="text-secondary">Log snacks, lunch, dinner</small>
                </div>
              </div>

              {/* Mock Chart / Graph UI */}
              <div className="p-3 bg-secondary rounded-3 mb-3" style={{ border: '1px solid var(--border-color)' }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-primary small fw-bold">Calorie Burn Rate</span>
                  <span className="badge bg-success text-white">82% Adherence</span>
                </div>
                <div className="d-flex align-items-end gap-2 pt-2" style={{ height: '100px' }}>
                  <div className="bg-success opacity-50 flex-grow-1 rounded-top" style={{ height: '40%' }}></div>
                  <div className="bg-success opacity-50 flex-grow-1 rounded-top" style={{ height: '60%' }}></div>
                  <div className="bg-success opacity-50 flex-grow-1 rounded-top" style={{ height: '55%' }}></div>
                  <div className="bg-success opacity-75 flex-grow-1 rounded-top" style={{ height: '80%' }}></div>
                  <div className="bg-success flex-grow-1 rounded-top" style={{ height: '95%' }}></div>
                </div>
              </div>

              <div className="d-flex gap-2">
                <span className="badge bg-secondary-subtle border text-secondary px-3 py-2 rounded">
                  <i className="bi bi-droplet-fill text-info me-1"></i> Water Logs
                </span>
                <span className="badge bg-secondary-subtle border text-secondary px-3 py-2 rounded">
                  <i className="bi bi-egg-fried text-warning me-1"></i> Macros Breakdown
                </span>
                <span className="badge bg-secondary-subtle border text-secondary px-3 py-2 rounded">
                  <i className="bi bi-people-fill text-primary me-1"></i> Dietitians Assigned
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="py-4 border-top text-center" style={{ borderColor: 'var(--border-color) !important' }}>
        <span className="text-secondary small">&copy; {new Date().getFullYear()} Nutrition Assistant. Powered by React, Express, MongoDB Atlas, Node.</span>
      </footer>
    </div>
  );
};

export default Landing;
