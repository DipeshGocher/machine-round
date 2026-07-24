import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFranchises, toggleFranchiseStatus } from '../../services/adminService.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import ConfirmationModal from '../../components/ConfirmationModal.jsx';
import SearchBar from '../../components/SearchBar.jsx';
import { showToast } from '../../utils/toast.js';
import {
  Store,
  Plus,
  Eye,
  Edit,
  Power,
  AlertCircle,
  MapPin,
  UserCheck
} from 'lucide-react';

const FranchiseList = () => {
  const [franchises, setFranchises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal State for Status Toggle Confirmation
  const [modalState, setModalState] = useState({
    isOpen: false,
    franchise: null,
    targetStatus: 'Inactive'
  });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchFranchises = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getFranchises();
      if (res?.success) {
        setFranchises(res.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load franchises');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFranchises();
  }, []);

  const openStatusModal = (franchise, targetStatus) => {
    setModalState({
      isOpen: true,
      franchise,
      targetStatus
    });
  };

  const closeModal = () => {
    if (!actionLoading) {
      setModalState({ isOpen: false, franchise: null, targetStatus: 'Inactive' });
    }
  };

  const handleConfirmStatusChange = async () => {
    if (!modalState.franchise) return;
    const { _id, name } = modalState.franchise;
    const { targetStatus } = modalState;

    try {
      setActionLoading(true);
      const res = await toggleFranchiseStatus(_id, targetStatus);
      if (res?.success) {
        showToast.success(`Franchise "${name}" status updated to ${targetStatus}`);
        setFranchises((prev) =>
          prev.map((f) => (f._id === _id ? { ...f, status: targetStatus } : f))
        );
      }
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
      closeModal();
    }
  };

  // Filtered Franchises
  const filteredFranchises = franchises.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.owner?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.owner?.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' || f.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <LoadingSpinner message="Fetching franchise records..." />;
  }

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h2>Franchise Directory</h2>
          <p>Manage all registered food franchise outlets, owners, and active statuses</p>
        </div>
        <Link to="/admin/franchises/create" className="btn btn-primary">
          <Plus size={18} />
          <span>Create Franchise</span>
        </Link>
      </div>

      {error && (
        <div className="card empty-state" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={40} className="text-danger empty-state-icon" />
          <p>{error}</p>
          <button className="btn btn-secondary btn-sm" onClick={fetchFranchises} style={{ marginTop: '0.5rem' }}>
            Retry
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem' }}>
        <div className="flex-between flex-wrap gap-2">
          <div style={{ flex: 1, minWidth: '240px' }}>
            <SearchBar
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by franchise name, city, owner..."
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

      {/* Franchises Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {filteredFranchises.length === 0 ? (
          <div className="empty-state">
            <Store size={48} className="empty-state-icon" />
            <h3>No Franchises Found</h3>
            <p>
              {searchQuery || statusFilter !== 'All'
                ? 'No franchise matches your search or filter criteria.'
                : 'Get started by creating your first franchise.'}
            </p>
            {(!searchQuery && statusFilter === 'All') && (
              <Link to="/admin/franchises/create" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
                <Plus size={16} />
                <span>Create Franchise</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Franchise Name</th>
                  <th>Owner Name</th>
                  <th>Owner Email</th>
                  <th>City</th>
                  <th>Status</th>
                  <th>Created Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFranchises.map((f) => (
                  <tr key={f._id}>
                    <td>
                      <div className="flex-center gap-2" style={{ justifyContent: 'flex-start' }}>
                        <Store size={16} className="text-primary" />
                        <span style={{ fontWeight: 600 }}>{f.name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex-center gap-1" style={{ justifyContent: 'flex-start' }}>
                        <UserCheck size={14} className="text-muted" />
                        <span>{f.owner?.name || 'N/A'}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{f.owner?.email || 'N/A'}</td>
                    <td>
                      <div className="flex-center gap-1" style={{ justifyContent: 'flex-start' }}>
                        <MapPin size={14} className="text-muted" />
                        <span>{f.city}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${f.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                        {f.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {new Date(f.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="flex-center gap-1" style={{ justifyContent: 'flex-end' }}>
                        <Link
                          to={`/admin/franchises/${f._id}`}
                          className="btn-icon"
                          title="View Overview"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link
                          to={`/admin/franchises/edit/${f._id}`}
                          className="btn-icon"
                          title="Edit Franchise"
                        >
                          <Edit size={16} />
                        </Link>

                        {f.status === 'Active' ? (
                          <button
                            className="btn-icon text-danger"
                            title="Deactivate Franchise"
                            onClick={() => openStatusModal(f, 'Inactive')}
                          >
                            <Power size={16} />
                          </button>
                        ) : (
                          <button
                            className="btn-icon text-success"
                            title="Activate Franchise"
                            onClick={() => openStatusModal(f, 'Active')}
                          >
                            <Power size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        title={modalState.targetStatus === 'Inactive' ? 'Deactivate Franchise?' : 'Activate Franchise?'}
        message={
          modalState.targetStatus === 'Inactive'
            ? `Are you sure you want to deactivate "${modalState.franchise?.name}"? All owner and staff logins for this franchise will be immediately disabled. Data will NOT be deleted.`
            : `Are you sure you want to activate "${modalState.franchise?.name}"? Owner and staff logins for this franchise will be restored.`
        }
        confirmText={modalState.targetStatus === 'Inactive' ? 'Deactivate' : 'Activate'}
        confirmVariant={modalState.targetStatus === 'Inactive' ? 'danger' : 'success'}
        isLoading={actionLoading}
        onConfirm={handleConfirmStatusChange}
        onClose={closeModal}
      />
    </div>
  );
};

export default FranchiseList;
