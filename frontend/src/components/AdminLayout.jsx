import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  LayoutDashboard,
  Store,
  Users,
  UserCheck,
  LogOut,
  UtensilsCrossed,
  Utensils
} from 'lucide-react';

const AdminLayout = () => {
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
          <UtensilsCrossed size={24} className="text-primary" />
          <span>Food Franchise</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/franchises"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Store size={20} />
            <span>Franchises</span>
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Utensils size={20} />
            <span>All Products</span>
          </NavLink>

          <NavLink
            to="/admin/staff"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <UserCheck size={20} />
            <span>Staff Directory</span>
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Users size={20} />
            <span>All Users</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button className="btn btn-secondary w-full flex-center gap-2" style={{ width: '100%' }} onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="flex-center gap-2">
            <UserCheck size={20} className="text-primary" />
            <span style={{ fontWeight: 600 }}>Admin Portal</span>
          </div>

          <div className="flex-center gap-3">
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.name || 'Admin User'}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</div>
            </div>
            <span className="badge badge-primary">Super Admin</span>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
