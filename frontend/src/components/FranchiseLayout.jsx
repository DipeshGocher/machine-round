import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  LayoutDashboard,
  Users,
  Utensils,
  LogOut,
  Store,
  ChefHat
} from 'lucide-react';

const FranchiseLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <Store size={24} className="text-primary" />
          <span>Franchise Portal</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/franchise/dashboard"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/franchise/staff"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Users size={20} />
            <span>Staff Management</span>
          </NavLink>

          <NavLink
            to="/franchise/products"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Utensils size={20} />
            <span>Product Catalog</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button className="btn btn-secondary flex-center gap-2" style={{ width: '100%' }} onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="flex-center gap-2">
            <ChefHat size={22} className="text-primary" />
            <span style={{ fontWeight: 600 }}>Franchise Manager</span>
          </div>

          <div className="flex-center gap-3">
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.name || 'Franchise Owner'}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</div>
            </div>
            <span className="badge badge-warning">Franchise Owner</span>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default FranchiseLayout;
