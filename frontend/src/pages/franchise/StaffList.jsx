import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStaffList, toggleStaffStatus } from '../../services/franchiseOwnerService.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import ConfirmationModal from '../../components/ConfirmationModal.jsx';
import SearchBar from '../../components/SearchBar.jsx';
import { showToast } from '../../utils/toast.js';
import { Users, Plus, Edit, Power, AlertCircle, Briefcase, Mail } from 'lucide-react';

const StaffList = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Confirmation Modal State
  const [modalState, setModalState] = useState({
    isOpen: false,
    staffMember: null,
    targetStatus: 'Inactive'
  });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getStaffList();
      if (res?.success) {
        setStaff(res.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load staff list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const openStatusModal = (staffMember, targetStatus) => {
    setModalState({
      isOpen: true,
      staffMember,
      targetStatus
    });
  };

  const closeModal = () => {
    if (!actionLoading) {
      setModalState({ isOpen: false, staffMember: null, targetStatus: 'Inactive' });
    }
  };

  const handleConfirmStatusChange = async () => {
    if (!modalState.staffMember) return;
    const { _id, name } = modalState.staffMember;
    const { targetStatus } = modalState;

    try {
      setActionLoading(true);
      const res = await toggleStaffStatus(_id, targetStatus);
      if (res?.success) {
        showToast.success(`Staff member "${name}" status set to ${targetStatus}`);
        setStaff((prev) =>
          prev.map((s) => (s._id === _id ? { ...s, status: targetStatus } : s))
        );
      }
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to update staff status');
    } finally {
      setActionLoading(false);
      closeModal();
    }
  };

  const filteredStaff = staff.filter((s) => {
    const query = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(query) ||
      s.email.toLowerCase().includes(query) ||
      (s.designation && s.designation.toLowerCase().includes(query))
    );
  });

  if (loading) {
    return <LoadingSpinner message="Fetching staff records..." />;
  }

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h2>Staff Management</h2>
          <p>Manage team members, roles, designations, and account access</p>
        </div>
        <Link to="/franchise/staff/add" className="btn btn-primary">
          <Plus size={18} />
          <span>Add Staff Member</span>
        </Link>
      </div>

      {error && (
        <div className="card empty-state" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={40} className="text-danger empty-state-icon" />
          <p>{error}</p>
          <button className="btn btn-secondary btn-sm" onClick={fetchStaff} style={{ marginTop: '0.5rem' }}>
            Retry
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem' }}>
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by staff name, email, designation..."
        />
      </div>

      {/* Staff Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {filteredStaff.length === 0 ? (
          <div className="empty-state">
            <Users size={48} className="empty-state-icon" />
            <h3>No Staff Members Found</h3>
            <p>
              {searchQuery
                ? 'No staff member matches your search criteria.'
                : 'Get started by adding your first staff member.'}
            </p>
            {!searchQuery && (
              <Link to="/franchise/staff/add" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
                <Plus size={16} />
                <span>Add Staff Member</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Staff Name</th>
                  <th>Email</th>
                  <th>Designation</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
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
                      <span className="badge badge-neutral">staff</span>
                    </td>
                    <td>
                      <span className={`badge ${s.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="flex-center gap-1" style={{ justifyContent: 'flex-end' }}>
                        <Link
                          to={`/franchise/staff/edit/${s._id}`}
                          className="btn-icon"
                          title="Edit Staff"
                        >
                          <Edit size={16} />
                        </Link>

                        {s.status === 'Active' ? (
                          <button
                            className="btn-icon text-danger"
                            title="Deactivate Staff Account"
                            onClick={() => openStatusModal(s, 'Inactive')}
                          >
                            <Power size={16} />
                          </button>
                        ) : (
                          <button
                            className="btn-icon text-success"
                            title="Activate Staff Account"
                            onClick={() => openStatusModal(s, 'Active')}
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

      {/* Status Toggle Modal */}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        title={modalState.targetStatus === 'Inactive' ? 'Deactivate Staff Member?' : 'Activate Staff Member?'}
        message={
          modalState.targetStatus === 'Inactive'
            ? `Are you sure you want to deactivate "${modalState.staffMember?.name}"? Inactive staff cannot log in.`
            : `Are you sure you want to activate "${modalState.staffMember?.name}"? Staff login access will be restored.`
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

export default StaffList;
