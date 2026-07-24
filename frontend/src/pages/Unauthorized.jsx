import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container flex-center" style={{ flex: 1, padding: '3rem 1rem' }}>
      <div className="card" style={{ textAlign: 'center', maxWidth: '480px', padding: '2.5rem 2rem' }}>
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', padding: '0.85rem', borderRadius: '50%', display: 'inline-flex', marginBottom: '1rem' }}>
          <ShieldAlert size={44} className="text-danger" />
        </div>
        <h2>403 - Access Denied</h2>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
          You do not have permission or authorization to access this feature or API resource.
        </p>
        <div className="flex-center gap-2">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary">
              <ArrowLeft size={16} />
              <span>Back to My Portal</span>
            </Link>
          ) : (
            <Link to="/login" className="btn btn-primary">
              <ArrowLeft size={16} />
              <span>Return to Login</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
