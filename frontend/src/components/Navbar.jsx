import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { LogOut, User, ShieldAlert, Home, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', padding: '0.8rem 1.5rem' }}>
      <div className="container flex-between" style={{ padding: 0 }}>
        <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}>
          MERN App
        </Link>

        <div className="flex gap-2" style={{ alignItems: 'center' }}>
          <Link to="/" className="flex gap-1" style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: '0.9rem' }}>
            <Home size={16} /> Home
          </Link>

          {isAuthenticated && (
            <Link to="/dashboard" className="flex gap-1" style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: '0.9rem' }}>
              <LayoutDashboard size={16} /> Dashboard
            </Link>
          )}

          {isAuthenticated ? (
            <div className="flex gap-2" style={{ alignItems: 'center' }}>
              <span className="badge badge-primary flex gap-1">
                {role === 'admin' ? <ShieldAlert size={14} /> : <User size={14} />}
                {user?.name || 'User'} ({role})
              </span>
              <button className="btn btn-secondary btn-sm flex gap-1" onClick={handleLogout}>
                <LogOut size={14} /> Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
