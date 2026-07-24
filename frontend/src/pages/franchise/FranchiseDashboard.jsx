import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFranchiseDashboard } from '../../services/franchiseOwnerService.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import {
  Store,
  Users,
  Utensils,
  CheckCircle2,
  XCircle,
  Plus,
  ArrowRight,
  AlertCircle,
  Clock,
  Globe
} from 'lucide-react';

const FranchiseDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getFranchiseDashboard();
      if (res?.success) {
        setData(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load franchise dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading franchise stats..." />;
  }

  if (error || !data) {
    return (
      <div className="card empty-state">
        <AlertCircle size={48} className="text-danger empty-state-icon" />
        <h3>Failed to Load Dashboard</h3>
        <p>{error || 'An unexpected error occurred'}</p>
        <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={fetchDashboard}>
          Retry
        </button>
      </div>
    );
  }

  const {
    franchiseName,
    ownerName,
    totalSystemFranchises,
    totalStaff,
    totalProducts,
    activeProducts,
    outOfStockProducts,
    recentlyAddedProducts = []
  } = data;

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <div>
          <div className="flex-center gap-2" style={{ justifyContent: 'flex-start' }}>
            <h2>{franchiseName} Dashboard</h2>
            <span className="badge badge-success">Operational</span>
          </div>
          <p>Logged in as: <strong style={{ color: 'var(--text-main)' }}>{ownerName}</strong></p>
        </div>
        <div className="flex gap-2">
          <Link to="/franchise/staff/add" className="btn btn-secondary btn-sm">
            <Plus size={16} />
            <span>Add Staff</span>
          </Link>
          <Link to="/franchise/products/add" className="btn btn-primary btn-sm">
            <Plus size={16} />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* 5 Stat Cards */}
      <div className="grid grid-cols-5" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
            <Globe size={26} />
          </div>
          <div>
            <div className="stat-title">Platform Franchises</div>
            <div className="stat-value">{totalSystemFranchises ?? 1}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <Users size={26} />
          </div>
          <div>
            <div className="stat-title">My Total Staff</div>
            <div className="stat-value">{totalStaff}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
            <Utensils size={26} />
          </div>
          <div>
            <div className="stat-title">My Total Products</div>
            <div className="stat-value">{totalProducts}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <CheckCircle2 size={26} />
          </div>
          <div>
            <div className="stat-title">Available Products</div>
            <div className="stat-value">{activeProducts}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>
            <XCircle size={26} />
          </div>
          <div>
            <div className="stat-title">Out of Stock</div>
            <div className="stat-value">{outOfStockProducts}</div>
          </div>
        </div>
      </div>

      {/* Recently Added Products Table */}
      <div className="card">
        <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
          <div className="flex-center gap-2">
            <Clock size={20} className="text-primary" />
            <h3 style={{ margin: 0 }}>Recently Added Products</h3>
          </div>
          <Link to="/franchise/products" className="btn btn-secondary btn-sm flex-center gap-1">
            <span>View All Catalog</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {recentlyAddedProducts.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem' }}>
            <Utensils size={40} className="empty-state-icon" />
            <p>No products added to this franchise yet.</p>
            <Link to="/franchise/products/add" className="btn btn-primary btn-sm" style={{ marginTop: '0.75rem' }}>
              Add First Product
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Added Date</th>
                </tr>
              </thead>
              <tbody>
                {recentlyAddedProducts.map((p) => (
                  <tr key={p._id}>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td>
                      <span className="badge badge-neutral">{p.category}</span>
                    </td>
                    <td style={{ fontWeight: 600 }}>${p.price.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${p.availability ? 'badge-success' : 'badge-danger'}`}>
                        {p.availability ? 'Available' : 'Out of Stock'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FranchiseDashboard;
