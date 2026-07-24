import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../../services/adminService.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import {
  Store,
  CheckCircle2,
  XCircle,
  Users,
  Package,
  Plus,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getDashboardStats();
      if (res?.success) {
        setStats(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading dashboard statistics..." />;
  }

  if (error) {
    return (
      <div className="card empty-state">
        <AlertCircle size={48} className="text-danger empty-state-icon" />
        <h3>Failed to Load Dashboard</h3>
        <p>{error}</p>
        <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={fetchStats}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h2>Admin Dashboard</h2>
          <p>Overview of franchises, users, staff, and platform statistics</p>
        </div>
        <Link to="/admin/franchises/create" className="btn btn-primary">
          <Plus size={18} />
          <span>Create Franchise</span>
        </Link>
      </div>

      {/* 5 Stat Cards */}
      <div className="grid grid-cols-5" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
            <Store size={26} />
          </div>
          <div>
            <div className="stat-title">Total Franchises</div>
            <div className="stat-value">{stats?.totalFranchises ?? 0}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <CheckCircle2 size={26} />
          </div>
          <div>
            <div className="stat-title">Active Franchises</div>
            <div className="stat-value">{stats?.activeFranchises ?? 0}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>
            <XCircle size={26} />
          </div>
          <div>
            <div className="stat-title">Inactive Franchises</div>
            <div className="stat-value">{stats?.inactiveFranchises ?? 0}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <Users size={26} />
          </div>
          <div>
            <div className="stat-title">Total Staff</div>
            <div className="stat-value">{stats?.totalStaff ?? 0}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
            <Package size={26} />
          </div>
          <div>
            <div className="stat-title">Total Products</div>
            <div className="stat-value">{stats?.totalProducts ?? 0}</div>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-2">
        <div className="card">
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <h3>Franchise Management</h3>
            <Store size={20} className="text-primary" />
          </div>
          <p style={{ marginBottom: '1.5rem' }}>
            Create new franchises, manage city locations, update franchise info, and activate or deactivate franchise operations.
          </p>
          <div className="flex gap-2">
            <Link to="/admin/franchises" className="btn btn-secondary btn-sm flex-center gap-1">
              <span>View Franchises</span>
              <ArrowRight size={14} />
            </Link>
            <Link to="/admin/franchises/create" className="btn btn-primary btn-sm flex-center gap-1">
              <Plus size={14} />
              <span>New Franchise</span>
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <h3>Platform User Directory</h3>
            <Users size={20} className="text-primary" />
          </div>
          <p style={{ marginBottom: '1.5rem' }}>
            View system-wide accounts including Admins, Franchise Owners, and Staff members across all active and inactive locations.
          </p>
          <Link to="/admin/users" className="btn btn-secondary btn-sm flex-center gap-1">
            <span>View User Directory</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
