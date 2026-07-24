import api from './api.js';

export const getStaffDashboard = async () => {
  return await api.get('/staff/dashboard');
};

export const getStaffProducts = async (params) => {
  return await api.get('/staff/products', { params });
};

export const toggleStaffProductAvailability = async (id, availability) => {
  return await api.patch(`/staff/products/${id}/availability`, { availability });
};
