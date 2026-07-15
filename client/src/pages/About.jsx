import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="fade-in-element container py-5 min-vh-100 d-flex flex-column justify-content-between">
      <div>
        <div className="d-flex align-items-center gap-2 mb-4">
          <Link to="/" className="btn btn-outline-secondary btn-sm rounded-circle d-flex justify-content-center align-items-center" style={{ width: '36px', height: '36px' }}>
            <i className="bi bi-arrow-left"></i>
          </Link>
          <span className="text-secondary small">Back to Home</span>
        </div>

        <div className="row g-5">
          <div className="col-lg-8">
            <h1 className="fw-extrabold text-primary mb-3">System Architecture & Tech Stack</h1>
            <p className="lead text-secondary mb-4">
              Nutrition Assistant is a premium full-stack web application constructed with clean MERN stack principles, focusing on separation of concerns, secure authentications, and intuitive dashboard interfaces.
            </p>

            <div className="row g-4 mt-2">
              <div className="col-md-6">
                <div className="glass-panel p-4 h-100">
                  <h5 className="fw-bold text-success mb-3">
                    <i className="bi bi-server me-2"></i> Backend API Stack
                  </h5>
                  <ul className="text-secondary list-unstyled d-flex flex-column gap-2 small">
                    <li><strong className="text-primary">Express & Node:</strong> High performance MVC router stack with custom centralized middleware handles.</li>
                    <li><strong className="text-primary">Mongoose:</strong> Relational schema modelling mapping Users, Clients, MealPlans, and Progress logs.</li>
                    <li><strong className="text-primary">JWT & Bcrypt:</strong> Standard token-based request authorization and secure cryptographic hashing.</li>
                    <li><strong className="text-primary">Security:</strong> Rate limiters, Helmet header secures, CORS rules, and NoSQL sanitizations.</li>
                  </ul>
                </div>
              </div>

              <div className="col-md-6">
                <div className="glass-panel p-4 h-100">
                  <h5 className="fw-bold text-info mb-3">
                    <i className="bi bi-layout-text-window-reverse me-2"></i> Frontend UI Stack
                  </h5>
                  <ul className="text-secondary list-unstyled d-flex flex-column gap-2 small">
                    <li><strong className="text-primary">Vite & React:</strong> Optimized, fast-bundled modular state interface engine.</li>
                    <li><strong className="text-primary">Recharts:</strong> Vector chart graphs render water logs, calories, and historical weights.</li>
                    <li><strong className="text-primary">React Hook Form:</strong> Optimized validation routines on data submission inputs.</li>
                    <li><strong className="text-primary">Context Providers:</strong> Shared Global Auth state, Toast notifications portal, and Theme hooks.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="glass-panel p-4 mt-4">
              <h5 className="fw-bold text-primary mb-3"><i className="bi bi-diagram-3-fill me-2"></i> Database ERD Relationships</h5>
              <p className="text-secondary small">
                The database consists of a central <strong>User</strong> table describing personal profile details. If role is 'User', a corresponding <strong>Client</strong> link hooks the user to their selected <strong>Dietitian</strong>. Dietitians create <strong>MealPlans</strong> for their clients. Clients record daily calorie and water entries in the <strong>Progress</strong> collection. System updates trigger <strong>Notifications</strong>.
              </p>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="glass-panel p-4 text-center">
              <div className="p-3 bg-secondary rounded-circle d-inline-flex justify-content-center align-items-center mb-3 text-success" style={{ width: '70px', height: '70px' }}>
                <i className="bi bi-cpu fs-2"></i>
              </div>
              <h5 className="fw-bold text-primary">Development Details</h5>
              <p className="text-secondary small">
                Built as a production-grade template complying with strict web development guidelines: including dark mode layouts, fluid typography, clean loaders, and strict input validation rules.
              </p>
              <hr className="my-3" style={{ color: 'var(--border-color)' }} />
              <Link to="/register" className="btn btn-primary-custom w-100">Register Now</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center py-4 border-top mt-5" style={{ borderColor: 'var(--border-color) !important' }}>
        <span className="text-secondary small">&copy; {new Date().getFullYear()} Nutrition Assistant. Technical overview sheet.</span>
      </div>
    </div>
  );
};

export default About;
