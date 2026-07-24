import axios from 'axios';
import { showToast } from '../utils/toast.js';

let rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
rawBaseUrl = rawBaseUrl.trim().replace(/\/+$/, '');

// Ensure /api suffix is attached if missing on remote host URLs
let API_BASE_URL = rawBaseUrl;
if (rawBaseUrl.startsWith('http') && !rawBaseUrl.endsWith('/api')) {
  API_BASE_URL = `${rawBaseUrl}/api`;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 25000 // Increased timeout for cold-starting free tier hosts like Render
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

// Response Interceptor (Global Error Handling)
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    
    if (error.response?.status === 401) {
      showToast.error('Session expired or unauthorized. Please login.');
    } else {
      showToast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
