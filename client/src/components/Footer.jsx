import React from 'react';

const Footer = () => {
  return (
    <footer className="footer py-3 mt-auto border-top bg-secondary text-center" style={{ borderTopColor: 'var(--border-color) !important' }}>
      <div className="container text-center">
        <span className="text-secondary small">
          &copy; {new Date().getFullYear()} Nutrition Assistant Inc. All rights reserved. Secure MERN architecture.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
