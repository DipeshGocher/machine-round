import api from './api.js';

export const authService = {
  login: async (credentials) => {
    return await api.post('/auth/login', credentials);
  },
  getHealth: async () => {
    return await api.get('/health');
  }
};

export default authService;
