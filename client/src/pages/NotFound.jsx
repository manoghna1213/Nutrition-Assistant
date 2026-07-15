import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="fade-in-element min-vh-100 d-flex align-items-center justify-content-center text-center px-3" style={{ background: 'var(--bg-primary)' }}>
      <div>
        <h1 className="display-1 fw-extrabold text-success mb-2" style={{ fontSize: '7rem' }}>404</h1>
        <h3 className="fw-bold mb-3 text-primary">Page Not Found</h3>
        <p className="text-secondary mb-4" style={{ maxW: '480px' }}>
          The link you requested might be broken, or the directory was relocated during deployment. Use the option below to navigate safely back home.
        </p>
        <Link to="/" className="btn btn-primary-custom px-4 py-2">
          <i className="bi bi-house-door-fill me-2"></i> Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
