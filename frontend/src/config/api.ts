import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle token expiration
    if (error.response?.status === 401) {
      // Only redirect to login if we're not already trying to refresh the token
      if (!error.config._isRetry) {
        try {
          // Try to refresh the token
          const response = await api.post('/auth/refresh-token');
          const newToken = response.data.token;
          if (newToken) {
            localStorage.setItem('token', newToken);
            error.config.headers.Authorization = `Bearer ${newToken}`;
            error.config._isRetry = true;
            return api(error.config);
          }
        } catch (refreshError) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;