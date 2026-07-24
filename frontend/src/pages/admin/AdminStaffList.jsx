import React, { useEffect, useState } from 'react';
import { getAdminStaff } from '../../services/adminService.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import SearchBar from '../../components/SearchBar.jsx';
import { Users, AlertCircle, Store, Briefcase, Mail } from 'lucide-react';

const AdminStaffList = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchStaffDirectory = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getAdminStaff();
      if (res?.success) {
        setStaffList(res.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load staff directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffDirectory();
  }, []);

  const filteredStaff = staffList.filter((s) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      s.name.toLowerCase().includes(query) ||
      s.email.toLowerCase().includes(query) ||
      (s.designation && s.designation.toLowerCase().includes(query)) ||
      (s.franchise?.name && s.franchise.name.toLowerCase().includes(query));

    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <LoadingSpinner message="Fetching system staff directory..." />;
  }

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <div>
          <div className="flex-center gap-2" style={{ justifyContent: 'flex-start' }}>
            <h2>System Staff Directory</h2>
            <span className="badge badge-neutral">Read Only</span>
          </div>
          <p>View all staff members employed across all franchise locations</p>
        </div>
      </div>

      {error && (
        <div className="card empty-state" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={40} className="text-danger empty-state-icon" />
          <p>{error}</p>
          <button className="btn btn-secondary btn-sm" onClick={fetchStaffDirectory} style={{ marginTop: '0.5rem' }}>
            Retry
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem' }}>
        <div className="flex-between flex-wrap gap-2">
          <div style={{ flex: 1, minWidth: '250px' }}>
            <SearchBar
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by staff name, email, designation, or franchise..."
            />
          </div>

          <div className="flex-center gap-2">
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status:</span>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.4rem 0.8rem' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {filteredStaff.length === 0 ? (
          <div className="empty-state">
            <Users size={48} className="empty-state-icon" />
            <h3>No Staff Members Found</h3>
            <p>No staff records matched the given criteria.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Staff Name</th>
                  <th>Email</th>
                  <th>Designation</th>
                  <th>Franchise Location</th>
                  <th>Status</th>
                  <th>Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((s) => (
                  <tr key={s._id}>
                    <td style={{ fontWeight: 600 }}>{s.name}</td>
                    <td>
                      <div className="flex-center gap-1" style={{ justifyContent: 'flex-start', color: 'var(--text-muted)' }}>
                        <Mail size={14} />
                        <span>{s.email}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex-center gap-1" style={{ justifyContent: 'flex-start' }}>
                        <Briefcase size={14} className="text-muted" />
                        <span>{s.designation || 'Staff'}</span>
                      </div>
                    </td>
                    <td>
                      {s.franchise?.name ? (
                        <div className="flex-center gap-1" style={{ justifyContent: 'flex-start' }}>
                          <Store size={14} className="text-primary" />
                          <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{s.franchise.name}</span>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Unassigned</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${s.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {new Date(s.createdAt).toLocaleDateString()}
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

export default AdminStaffList;
