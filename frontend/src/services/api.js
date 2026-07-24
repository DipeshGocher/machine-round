import axios from 'axios';
import { showToast } from '../utils/toast.js';

let rawBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
rawBaseUrl = rawBaseUrl.trim().replace(/\/+$/, '');

// Smart URL resolution: Local dev targets http://localhost:5000/api; Production Vercel targets /api
let API_BASE_URL = rawBaseUrl;
if (import.meta.env.DEV && (rawBaseUrl === '/api' || rawBaseUrl.startsWith('/'))) {
  API_BASE_URL = 'http://localhost:5000/api';
} else if (rawBaseUrl.startsWith('http') && !rawBaseUrl.endsWith('/api')) {
  API_BASE_URL = `${rawBaseUrl}/api`;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 25000
});

// Request Interceptor (Attaching JWT token)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor (Global Error Handling & Session Expiry Cleanup)
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const serverMessage = error.response?.data?.message;
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      showToast.error(serverMessage || 'Session expired or invalid token. Please log in again.');
    } else {
      showToast.error(serverMessage || error.message || 'An unexpected error occurred');
    }

    return Promise.reject(error);
  }
);

export default api;
