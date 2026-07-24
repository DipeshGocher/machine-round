import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container flex-center" style={{ flex: 1, padding: '3rem 1rem' }}>
      <div className="card" style={{ textAlign: 'center', maxWidth: '480px' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--primary)' }}>404</h1>
        <h2>Page Not Found</h2>
        <p style={{ marginBottom: '1.5rem' }}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
