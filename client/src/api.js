import axios from 'axios';

// Get backend URL from environment or default to port 8000
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
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

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  verify: () => api.get('/auth/verify'),
};

// Meal Plans API
export const mealPlansAPI = {
  generate: (data) => api.post('/mealplans/generate', data),
  getAll: () => api.get('/mealplans/'),
  getOne: (id) => api.get(`/mealplans/${id}`),
  delete: (id) => api.delete(`/mealplans/${id}`),
  update: (id, data) => api.put(`/mealplans/${id}`, data),
};

// Dashboard API
export const dashboardAPI = {
  getSummary: () => api.get('/dashboard/summary'),
};

export default api;
