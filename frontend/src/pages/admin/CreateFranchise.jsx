import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createFranchise } from '../../services/adminService.js';
import { showToast } from '../../utils/toast.js';
import { validatePassword, validateEmail } from '../../utils/validators.js';
import { Store, ArrowLeft, User, Mail, Lock, MapPin, CheckCircle } from 'lucide-react';

const CreateFranchise = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    ownerName: '',
    ownerEmail: '',
    ownerPassword: '',
    city: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

    if (!formData.ownerPassword) {
      newErrors.ownerPassword = 'Password is required';
    } else if (!validatePassword(formData.ownerPassword)) {
      newErrors.ownerPassword =
        'Password must be 8-20 characters long and contain uppercase, lowercase, number, and special character';
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
      const res = await createFranchise(formData);
      if (res?.success) {
        showToast.success('Franchise & Franchise Owner account created successfully!');
        navigate('/admin/franchises');
      }
    } catch (err) {
      const serverMessage = err.response?.data?.message || 'Failed to create franchise';
      showToast.error(serverMessage);
      if (serverMessage.toLowerCase().includes('email')) {
        setErrors((prev) => ({ ...prev, ownerEmail: serverMessage }));
      } else if (serverMessage.toLowerCase().includes('franchise name')) {
        setErrors((prev) => ({ ...prev, name: serverMessage }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/admin/franchises" className="btn btn-secondary btn-sm flex-center gap-1" style={{ width: 'fit-content', marginBottom: '1rem' }}>
          <ArrowLeft size={16} />
          <span>Back to Franchises</span>
        </Link>
        <h2>Create New Franchise</h2>
        <p>Register a new food franchise branch and create its Franchise Owner account</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          {/* Franchise Name */}
          <div className="form-group">
            <label className="form-label">Franchise Name</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="e.g. Tasty Bites Downtown"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>

          {/* City */}
          <div className="form-group">
            <label className="form-label">City / Location</label>
            <input
              type="text"
              name="city"
              className="form-input"
              placeholder="e.g. New York"
              value={formData.city}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.city && <div className="form-error">{errors.city}</div>}
          </div>

          <div style={{ margin: '1.5rem 0 1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>Owner Account Setup</h3>
            <p style={{ fontSize: '0.85rem' }}>An account with role "franchise" will be created for the owner.</p>
          </div>

          {/* Owner Name */}
          <div className="form-group">
            <label className="form-label">Owner Full Name</label>
            <input
              type="text"
              name="ownerName"
              className="form-input"
              placeholder="e.g. John Doe"
              value={formData.ownerName}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.ownerName && <div className="form-error">{errors.ownerName}</div>}
          </div>

          {/* Owner Email */}
          <div className="form-group">
            <label className="form-label">Owner Email Address</label>
            <input
              type="email"
              name="ownerEmail"
              className="form-input"
              placeholder="owner@franchise.com"
              value={formData.ownerEmail}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.ownerEmail && <div className="form-error">{errors.ownerEmail}</div>}
          </div>

          {/* Owner Password */}
          <div className="form-group">
            <label className="form-label">Owner Password</label>
            <input
              type="password"
              name="ownerPassword"
              className="form-input"
              placeholder="••••••••"
              value={formData.ownerPassword}
              onChange={handleChange}
              disabled={loading}
            />
            <div className="form-hint">
              Must be 8-20 characters long with uppercase, lowercase, number & special character.
            </div>
            {errors.ownerPassword && <div className="form-error">{errors.ownerPassword}</div>}
          </div>

          <div className="flex-between" style={{ marginTop: '2rem' }}>
            <Link to="/admin/franchises" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <span>Creating Franchise...</span>
              ) : (
                <>
                  <CheckCircle size={18} />
                  <span>Create Franchise & Owner</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFranchise;
