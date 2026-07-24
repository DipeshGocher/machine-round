import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getFranchiseOverview } from '../../services/adminService.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import {
  Store,
  UserCheck,
  Users,
  Package,
  MapPin,
  Calendar,
  Mail,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';

const FranchiseOverview = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await getFranchiseOverview(id);
        if (res?.success) {
          setData(res.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch franchise overview');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOverview();
    }
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Loading franchise overview details..." />;
  }

  if (error || !data) {
    return (
      <div className="card empty-state" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <AlertCircle size={44} className="text-danger empty-state-icon" />
        <h3>Franchise Overview Unavailable</h3>
        <p>{error || 'Franchise not found'}</p>
        <Link to="/admin/franchises" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
          Back to Franchises
        </Link>
      </div>
    );
  }

  const { franchise, owner, totalStaff, totalProducts, staffList, productList } = data;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/admin/franchises" className="btn btn-secondary btn-sm flex-center gap-1" style={{ width: 'fit-content', marginBottom: '1rem' }}>
          <ArrowLeft size={16} />
          <span>Back to Franchises</span>
        </Link>
        <div className="flex-between">
          <div>
            <div className="flex-center gap-2" style={{ justifyContent: 'flex-start' }}>
              <h2>{franchise.name}</h2>
              <span className={`badge ${franchise.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                {franchise.status}
              </span>
            </div>
            <p>Read-only overview of franchise details, owner, staff, and products</p>
          </div>
          <Link to={`/admin/franchises/edit/${franchise._id}`} className="btn btn-primary btn-sm">
            Edit Franchise
          </Link>
        </div>
      </div>

      {/* Top Details Grid */}
      <div className="grid grid-cols-2" style={{ marginBottom: '1.5rem' }}>
        {/* Franchise Details */}
        <div className="card">
          <div className="flex-center gap-2" style={{ justifyContent: 'flex-start', marginBottom: '1rem' }}>
            <Store size={20} className="text-primary" />
            <h3 style={{ margin: 0 }}>Franchise Details</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="flex-between">
              <span style={{ color: 'var(--text-muted)' }}>City / Location:</span>
              <span className="flex-center gap-1" style={{ fontWeight: 500 }}>
                <MapPin size={14} className="text-muted" />
                {franchise.city}
              </span>
            </div>
            <div className="flex-between">
              <span style={{ color: 'var(--text-muted)' }}>Status:</span>
              <span className={`badge ${franchise.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                {franchise.status}
              </span>
            </div>
            <div className="flex-between">
              <span style={{ color: 'var(--text-muted)' }}>Created On:</span>
              <span className="flex-center gap-1" style={{ fontSize: '0.9rem' }}>
                <Calendar size={14} className="text-muted" />
                {new Date(franchise.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Owner Details */}
        <div className="card">
          <div className="flex-center gap-2" style={{ justifyContent: 'flex-start', marginBottom: '1rem' }}>
            <UserCheck size={20} className="text-primary" />
            <h3 style={{ margin: 0 }}>Owner Details</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="flex-between">
              <span style={{ color: 'var(--text-muted)' }}>Owner Name:</span>
              <span style={{ fontWeight: 600 }}>{owner?.name || 'N/A'}</span>
            </div>
            <div className="flex-between">
              <span style={{ color: 'var(--text-muted)' }}>Owner Email:</span>
              <span className="flex-center gap-1" style={{ fontSize: '0.9rem' }}>
                <Mail size={14} className="text-muted" />
                {owner?.email || 'N/A'}
              </span>
            </div>
            <div className="flex-between">
              <span style={{ color: 'var(--text-muted)' }}>Owner Status:</span>
              <span className={`badge ${owner?.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                {owner?.status || 'Active'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="stat-title">Total Staff Members</div>
            <div className="stat-value">{totalStaff}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
            <Package size={24} />
          </div>
          <div>
            <div className="stat-title">Total Products</div>
            <div className="stat-value">{totalProducts}</div>
          </div>
        </div>
      </div>

      {/* Staff List Table */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="flex-between" style={{ marginBottom: '1rem' }}>
          <h3 className="flex-center gap-2" style={{ margin: 0 }}>
            <Users size={18} className="text-primary" />
            <span>Staff Members ({totalStaff})</span>
          </h3>
          <span className="badge badge-neutral">Read Only</span>
        </div>

        {staffList.length === 0 ? (
          <div className="empty-state" style={{ padding: '1.5rem' }}>
            <p>No staff members assigned to this franchise yet.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Staff Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Created Date</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((staff) => (
                  <tr key={staff._id}>
                    <td style={{ fontWeight: 500 }}>{staff.name}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{staff.email}</td>
                    <td>
                      <span className={`badge ${staff.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                        {staff.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {new Date(staff.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product List Table */}
      <div className="card">
        <div className="flex-between" style={{ marginBottom: '1rem' }}>
          <h3 className="flex-center gap-2" style={{ margin: 0 }}>
            <Package size={18} className="text-primary" />
            <span>Products Catalog ({totalProducts})</span>
          </h3>
          <span className="badge badge-neutral">Read Only</span>
        </div>

        {productList.length === 0 ? (
          <div className="empty-state" style={{ padding: '1.5rem' }}>
            <p>No products associated with this franchise yet.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Created Date</th>
                </tr>
              </thead>
              <tbody>
                {productList.map((prod) => (
                  <tr key={prod._id}>
                    <td style={{ fontWeight: 500 }}>{prod.name}</td>
                    <td style={{ fontWeight: 600 }}>${prod.price.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${prod.status === 'Available' ? 'badge-success' : 'badge-warning'}`}>
                        {prod.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {new Date(prod.createdAt).toLocaleDateString()}
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

export default FranchiseOverview;
