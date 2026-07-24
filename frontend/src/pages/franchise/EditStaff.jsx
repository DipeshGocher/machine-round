import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getStaffList, updateStaff } from '../../services/franchiseOwnerService.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import { showToast } from '../../utils/toast.js';
import { validateEmail } from '../../utils/validators.js';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';

const EditStaff = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    designation: ''
  });

  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    const fetchStaffMember = async () => {
      try {
        setInitialLoading(true);
        const res = await getStaffList();
        if (res?.success) {
          const target = res.data.find((s) => s._id === id);
          if (target) {
            setFormData({
              name: target.name || '',
              email: target.email || '',
              designation: target.designation || ''
            });
          } else {
            setFetchError('Staff member not found or access denied');
          }
        }
      } catch (err) {
        setFetchError(err.response?.data?.message || 'Failed to fetch staff member details');
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) {
      fetchStaffMember();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Staff name is required';
    } else if (formData.name.trim().length < 3 || formData.name.trim().length > 40) {
      newErrors.name = 'Staff name must be between 3 and 40 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.designation.trim()) {
      newErrors.designation = 'Designation is required';
    } else if (formData.designation.trim().length > 50) {
      newErrors.designation = 'Designation cannot exceed 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      const res = await updateStaff(id, formData);
      if (res?.success) {
        showToast.success('Staff member updated successfully!');
        navigate('/franchise/staff');
      }
    } catch (err) {
      const serverMessage = err.response?.data?.message || 'Failed to update staff member';
      showToast.error(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <LoadingSpinner message="Loading staff record..." />;
  }

  if (fetchError) {
    return (
      <div className="card empty-state" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <AlertCircle size={44} className="text-danger empty-state-icon" />
        <h3>Error Loading Staff Member</h3>
        <p>{fetchError}</p>
        <Link to="/franchise/staff" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
          Back to Staff List
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/franchise/staff" className="btn btn-secondary btn-sm flex-center gap-1" style={{ width: 'fit-content', marginBottom: '1rem' }}>
          <ArrowLeft size={16} />
          <span>Back to Staff List</span>
        </Link>
        <h2>Edit Staff Member</h2>
        <p>Update name, email address, or designation</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">Staff Full Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>

          {/* Designation */}
          <div className="form-group">
            <label className="form-label">Designation</label>
            <input
              type="text"
              name="designation"
              className="form-input"
              value={formData.designation}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.designation && <div className="form-error">{errors.designation}</div>}
          </div>

          <div className="flex-between" style={{ marginTop: '2rem' }}>
            <Link to="/franchise/staff" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <span>Saving Changes...</span>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStaff;
