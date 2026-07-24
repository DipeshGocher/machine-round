import api from './api.js';

export const getDashboardStats = async () => {
  return await api.get('/admin/dashboard');
};

export const getFranchises = async () => {
  return await api.get('/admin/franchises');
};

export const createFranchise = async (data) => {
  return await api.post('/admin/franchises', data);
};

export const getFranchiseOverview = async (id) => {
  return await api.get(`/admin/franchises/${id}`);
};

export const updateFranchise = async (id, data) => {
  return await api.put(`/admin/franchises/${id}`, data);
};

export const toggleFranchiseStatus = async (id, status) => {
  return await api.patch(`/admin/franchises/${id}/status`, { status });
};

export const getUsers = async () => {
  return await api.get('/admin/users');
};

export const getAdminStaff = async () => {
  return await api.get('/admin/staff');
};

export const getAdminProducts = async () => {
  return await api.get('/admin/products');
};
