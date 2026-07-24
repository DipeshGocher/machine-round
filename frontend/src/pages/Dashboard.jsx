import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const Dashboard = () => {
  const { role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    } else if (role === 'franchise') {
      navigate('/franchise/dashboard', { replace: true });
    } else if (role === 'staff') {
      navigate('/staff/dashboard', { replace: true });
    }
  }, [role, navigate]);

  return <LoadingSpinner fullPage message="Redirecting to your role portal..." />;
};

export default Dashboard;
