import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getFranchiseOverview, updateFranchise } from '../../services/adminService.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import { showToast } from '../../utils/toast.js';
import { validateEmail } from '../../utils/validators.js';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';

const EditFranchise = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    ownerName: '',
    ownerEmail: '',
    city: '',
    status: 'Active'
  });

  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    const fetchFranchise = async () => {
      try {
        setInitialLoading(true);
        const res = await getFranchiseOverview(id);
        if (res?.success) {
          const { franchise, owner } = res.data;
          setFormData({
            name: franchise.name || '',
            ownerName: owner?.name || '',
            ownerEmail: owner?.email || '',
            city: franchise.city || '',
            status: franchise.status || 'Active'
          });
        }
      } catch (err) {
        setFetchError(err.response?.data?.message || 'Failed to fetch franchise details');
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) {
      fetchFranchise();
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
      newErrors.name = 'Franchise name is required';
    } else if (formData.name.trim().length < 3 || formData.name.trim().length > 60) {
      newErrors.name = 'Franchise name must be between 3 and 60 characters';
    }

    if (!formData.ownerName.trim()) {
      newErrors.ownerName = 'Owner name is required';
    } else if (formData.ownerName.trim().length < 3 || formData.ownerName.trim().length > 40) {
      newErrors.ownerName = 'Owner name must be between 3 and 40 characters';
    }

    if (!formData.ownerEmail.trim()) {
      newErrors.ownerEmail = 'Owner email is required';
    } else if (!validateEmail(formData.ownerEmail)) {
      newErrors.ownerEmail = 'Enter a valid email address';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    } else if (formData.city.trim().length > 50) {
      newErrors.city = 'City cannot exceed 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      const res = await updateFranchise(id, formData);
      if (res?.success) {
        showToast.success('Franchise updated successfully!');
        navigate('/admin/franchises');
      }
    } catch (err) {
      const serverMessage = err.response?.data?.message || 'Failed to update franchise';
      showToast.error(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <LoadingSpinner message="Loading franchise data..." />;
  }

  if (fetchError) {
    return (
      <div className="card empty-state" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <AlertCircle size={44} className="text-danger empty-state-icon" />
        <h3>Error Loading Franchise</h3>
        <p>{fetchError}</p>
        <Link to="/admin/franchises" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
          Back to Franchise List
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/admin/franchises" className="btn btn-secondary btn-sm flex-center gap-1" style={{ width: 'fit-content', marginBottom: '1rem' }}>
          <ArrowLeft size={16} />
          <span>Back to Franchises</span>
        </Link>
        <h2>Edit Franchise</h2>
        <p>Update details for franchise outlet and owner</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          {/* Franchise Name */}
          <div className="form-group">
            <label className="form-label">Franchise Name</label>
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

          {/* City */}
          <div className="form-group">
            <label className="form-label">City</label>
            <input
              type="text"
              name="city"
              className="form-input"
              value={formData.city}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.city && <div className="form-error">{errors.city}</div>}
          </div>

          {/* Status */}
          <div className="form-group">
            <label className="form-label">Franchise Status</label>
            <select
              name="status"
              className="form-select"
              value={formData.status}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div style={{ margin: '1.5rem 0 1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>Owner Account Details</h3>
          </div>

          {/* Owner Name */}
          <div className="form-group">
            <label className="form-label">Owner Name</label>
            <input
              type="text"
              name="ownerName"
              className="form-input"
              value={formData.ownerName}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.ownerName && <div className="form-error">{errors.ownerName}</div>}
          </div>

          {/* Owner Email */}
          <div className="form-group">
            <label className="form-label">Owner Email</label>
            <input
              type="email"
              name="ownerEmail"
              className="form-input"
              value={formData.ownerEmail}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.ownerEmail && <div className="form-error">{errors.ownerEmail}</div>}
          </div>

          <div className="flex-between" style={{ marginTop: '2rem' }}>
            <Link to="/admin/franchises" className="btn btn-secondary">
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

export default EditFranchise;
