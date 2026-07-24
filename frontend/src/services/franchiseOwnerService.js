import api from './api.js';

export const getFranchiseDashboard = async () => {
  return await api.get('/franchise/dashboard');
};

// Staff APIs
export const getStaffList = async () => {
  return await api.get('/franchise/staff');
};

export const addStaff = async (data) => {
  return await api.post('/franchise/staff', data);
};

export const updateStaff = async (id, data) => {
  return await api.put(`/franchise/staff/${id}`, data);
};

export const toggleStaffStatus = async (id, status) => {
  return await api.patch(`/franchise/staff/${id}/status`, { status });
};

// Product APIs
export const getProducts = async (params) => {
  return await api.get('/franchise/products', { params });
};

export const addProduct = async (data) => {
  return await api.post('/franchise/products', data);
};

export const updateProduct = async (id, data) => {
  return await api.put(`/franchise/products/${id}`, data);
};

export const deleteProduct = async (id) => {
  return await api.delete(`/franchise/products/${id}`);
};

export const toggleProductAvailability = async (id, availability) => {
  return await api.patch(`/franchise/products/${id}/availability`, { availability });
};
