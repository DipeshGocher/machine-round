import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStaffDashboard, toggleStaffProductAvailability } from '../../services/staffService.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import { showToast } from '../../utils/toast.js';
import {
  Store,
  MapPin,
  Utensils,
  CheckCircle2,
  XCircle,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

const StaffDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toggleLoadingId, setToggleLoadingId] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getStaffDashboard();
      if (res?.success) {
        setData(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load staff dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleToggleAvailability = async (product) => {
    try {
      setToggleLoadingId(product._id);
      const newStatus = !product.availability;
      const res = await toggleStaffProductAvailability(product._id, newStatus);
      if (res?.success) {
        showToast.success(`"${product.name}" status updated to ${newStatus ? 'Available' : 'Out of Stock'}`);
        setData((prev) => {
          if (!prev) return prev;
          const updatedList = prev.productList.map((p) =>
            p._id === product._id ? { ...p, availability: newStatus } : p
          );
          const availableCount = updatedList.filter((p) => p.availability).length;
          const outOfStockCount = updatedList.filter((p) => !p.availability).length;
          return {
            ...prev,
            productList: updatedList,
            availableProducts: availableCount,
            outOfStockProducts: outOfStockCount
          };
        });
      }
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to update stock status');
    } finally {
      setToggleLoadingId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading staff dashboard..." />;
  }

  if (error || !data) {
    return (
      <div className="card empty-state">
        <AlertCircle size={48} className="text-danger empty-state-icon" />
        <h3>Failed to Load Staff Dashboard</h3>
        <p>{error || 'An unexpected error occurred'}</p>
        <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={fetchDashboard}>
          Retry
        </button>
      </div>
    );
  }

  const {
    franchiseName,
    franchiseCity,
    totalProducts,
    availableProducts,
    outOfStockProducts,
    productList = []
  } = data;

  return (
    <div>
      {/* Header Banner */}
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <div>
          <div className="flex-center gap-2" style={{ justifyContent: 'flex-start' }}>
            <h2>{franchiseName} - Staff Portal</h2>
            <span className="badge badge-success">Active Franchise</span>
          </div>
          <div className="flex-center gap-1" style={{ justifyContent: 'flex-start', marginTop: '0.25rem', color: 'var(--text-muted)' }}>
            <MapPin size={16} />
            <span>Location: {franchiseCity}</span>
          </div>
        </div>
        <Link to="/staff/products" className="btn btn-secondary btn-sm flex-center gap-1">
          <span>Full Inventory</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-3" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
            <Utensils size={26} />
          </div>
          <div>
            <div className="stat-title">Total Products</div>
            <div className="stat-value">{totalProducts}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <CheckCircle2 size={26} />
          </div>
          <div>
            <div className="stat-title">Available Items</div>
            <div className="stat-value">{availableProducts}</div>
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

      {/* Product Stock List */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="flex-between" style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <h3 className="flex-center gap-2" style={{ margin: 0 }}>
            <Utensils size={20} className="text-primary" />
            <span>Product Inventory ({totalProducts})</span>
          </h3>
          <span className="badge badge-neutral">Quick Availability Toggle</span>
        </div>

        {productList.length === 0 ? (
          <div className="empty-state" style={{ padding: '2.5rem' }}>
            <Utensils size={44} className="empty-state-icon" />
            <p>No products available for this franchise yet.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock Status</th>
                  <th style={{ textAlign: 'right' }}>Toggle Stock</th>
                </tr>
              </thead>
              <tbody>
                {productList.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div className="flex-center gap-2" style={{ justifyContent: 'flex-start' }}>
                        {p.imageUrl ? (
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div style={{ width: '40px', height: '40px', background: 'var(--bg-input)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Utensils size={18} className="text-muted" />
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 600 }}>{p.name}</div>
                          {p.description && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {p.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-neutral">{p.category}</span>
                    </td>
                    <td style={{ fontWeight: 600 }}>${p.price.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${p.availability ? 'badge-success' : 'badge-danger'}`}>
                        {p.availability ? 'Available' : 'Out of Stock'}
                      </span>
                    </td>
                    <td>
                      <div className="flex-center" style={{ justifyContent: 'flex-end' }}>
                        <button
                          className="btn btn-secondary btn-sm flex-center gap-1"
                          disabled={toggleLoadingId === p._id}
                          onClick={() => handleToggleAvailability(p)}
                          title="Click to toggle stock status"
                        >
                          {p.availability ? (
                            <ToggleRight size={22} className="text-success" />
                          ) : (
                            <ToggleLeft size={22} className="text-danger" />
                          )}
                          <span>{p.availability ? 'Mark Out of Stock' : 'Mark Available'}</span>
                        </button>
                      </div>
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

export default StaffDashboard;
