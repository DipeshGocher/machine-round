import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { addStaff } from '../../services/franchiseOwnerService.js';
import { showToast } from '../../utils/toast.js';
import { validatePassword, validateEmail } from '../../utils/validators.js';
import { ArrowLeft, UserPlus, CheckCircle } from 'lucide-react';

const AddStaff = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    designation: ''
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
      newErrors.name = 'Staff name is required';
    } else if (formData.name.trim().length < 3 || formData.name.trim().length > 40) {
      newErrors.name = 'Staff name must be between 3 and 40 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password =
        'Password must be 8-20 characters long with uppercase, lowercase, number, and special character';
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
      const res = await addStaff(formData);
      if (res?.success) {
        showToast.success('Staff member added successfully!');
        navigate('/franchise/staff');
      }
    } catch (err) {
      const serverMessage = err.response?.data?.message || 'Failed to add staff member';
      showToast.error(serverMessage);
      if (serverMessage.toLowerCase().includes('email')) {
        setErrors((prev) => ({ ...prev, email: serverMessage }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/franchise/staff" className="btn btn-secondary btn-sm flex-center gap-1" style={{ width: 'fit-content', marginBottom: '1rem' }}>
          <ArrowLeft size={16} />
          <span>Back to Staff List</span>
        </Link>
        <h2>Add New Staff Member</h2>
        <p>Create a staff user account assigned to your franchise</p>
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
              placeholder="e.g. Alice Smith"
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
              placeholder="alice@franchise.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>

          {/* Designation */}
          <div className="form-group">
            <label className="form-label">Designation / Role Description</label>
            <input
              type="text"
              name="designation"
              className="form-input"
              placeholder="e.g. Shift Manager, Line Cook, Cashier"
              value={formData.designation}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.designation && <div className="form-error">{errors.designation}</div>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Account Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
            <div className="form-hint">
              Must be 8-20 characters long with uppercase, lowercase, number & special character.
            </div>
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>

          <div className="flex-between" style={{ marginTop: '2rem' }}>
            <Link to="/franchise/staff" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <span>Adding Staff...</span>
              ) : (
                <>
                  <UserPlus size={18} />
                  <span>Add Staff Member</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStaff;
