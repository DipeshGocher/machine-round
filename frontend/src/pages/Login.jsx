import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { validateForm } from '../utils/formValidation.js';
import { authService } from '../services/authService.js';
import { showToast } from '../utils/toast.js';
import { UtensilsCrossed, LogIn } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateForm({
      email: { value: formData.email, required: true, isEmail: true },
      password: { value: formData.password, required: true, minLength: 6 }
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      setSubmitting(true);
      const res = await authService.login(formData);
      if (res?.success) {
        const { user, token } = res.data;
        login(user, token);
        showToast.success(`Welcome back, ${user.name}!`);

        if (user.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (user.role === 'franchise') {
          navigate('/franchise/dashboard');
        } else if (user.role === 'staff') {
          navigate('/staff/dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      // Error handled by api interceptor
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container flex-center" style={{ flex: 1, padding: '3rem 1rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '2rem' }}>
        <div className="flex-center flex-column gap-2" style={{ textAlign: 'center', marginBottom: '1.5rem', flexDirection: 'column' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '0.75rem', borderRadius: '50%', display: 'inline-flex', marginBottom: '0.5rem' }}>
            <UtensilsCrossed size={32} className="text-primary" />
          </div>
          <h2>Franchise Platform Login</h2>
          <p>Sign in with your Admin, Franchise Owner, or Staff credentials</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="user@franchise.com"
              value={formData.email}
              onChange={handleChange}
              disabled={submitting}
            />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={submitting}
            />
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={submitting}
          >
            {submitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <LogIn size={18} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
