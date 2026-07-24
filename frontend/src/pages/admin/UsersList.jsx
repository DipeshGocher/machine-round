import React, { useEffect, useState } from 'react';
import { getUsers } from '../../services/adminService.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import SearchBar from '../../components/SearchBar.jsx';
import { Users, AlertCircle, Shield, Store, UserCheck } from 'lucide-react';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getUsers();
      if (res?.success) {
        setUsers(res.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.franchise?.name && u.franchise.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <span className="badge badge-primary flex-center gap-1"><Shield size={12} /> Admin</span>;
      case 'franchise':
        return <span className="badge badge-warning flex-center gap-1"><Store size={12} /> Franchise Owner</span>;
      case 'staff':
        return <span className="badge badge-neutral flex-center gap-1"><UserCheck size={12} /> Staff</span>;
      default:
        return <span className="badge badge-neutral">{role}</span>;
    }
  };

  if (loading) {
    return <LoadingSpinner message="Fetching user directory..." />;
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2>User Directory</h2>
        <p>Read-only view of all platform accounts across Super Admin, Franchise Owners, and Staff</p>
      </div>

      {error && (
        <div className="card empty-state" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={40} className="text-danger empty-state-icon" />
          <p>{error}</p>
          <button className="btn btn-secondary btn-sm" onClick={fetchUsers} style={{ marginTop: '0.5rem' }}>
            Retry
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem' }}>
        <div className="flex-between flex-wrap gap-2">
          <div style={{ flex: 1, minWidth: '240px' }}>
            <SearchBar
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by user name, email, or franchise..."
            />
          </div>

          <div className="flex-center gap-2">
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Role:</span>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.4rem 0.8rem' }}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="All">All Roles</option>
              <option value="admin">Admin</option>
              <option value="franchise">Franchise Owner</option>
              <option value="staff">Staff</option>
            </select>

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

      {/* Users Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {filteredUsers.length === 0 ? (
          <div className="empty-state">
            <Users size={48} className="empty-state-icon" />
            <h3>No Users Found</h3>
            <p>No user accounts matched the given criteria.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Franchise Name</th>
                  <th>Status</th>
                  <th>Created Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u._id}>
                    <td style={{ fontWeight: 600 }}>{u.name}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                    <td>{getRoleBadge(u.role)}</td>
                    <td>
                      {u.franchise?.name ? (
                        <div className="flex-center gap-1" style={{ justifyContent: 'flex-start' }}>
                          <Store size={14} className="text-primary" />
                          <span>{u.franchise.name}</span>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>N/A (System)</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${u.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
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

export default UsersList;
