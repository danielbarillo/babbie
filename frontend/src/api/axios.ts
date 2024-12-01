import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

console.log('Axios config - API URL:', API_URL);
console.log('Axios config - Environment:', import.meta.env.MODE);

if (!API_URL) {
  console.error('VITE_API_URL is not defined in axios config!');
  console.error('Current environment variables:', import.meta.env);
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to add the token and log the request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Making request to:', config.baseURL + config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error);
    return Promise.reject(error);
  }
);

export default api;