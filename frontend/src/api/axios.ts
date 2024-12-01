import axios from 'axios';

// Force the correct API URL
const API_URL = 'https://chappyv.onrender.com';

console.log('Axios config - API URL:', API_URL);
console.log('Axios config - Environment:', import.meta.env.MODE);
console.log('Axios config - All env vars:', import.meta.env);

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
    console.log('Making request:', {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      fullURL: config.baseURL + config.url,
      headers: config.headers,
      data: config.data
    });
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      message: error.message,
      response: error.response,
      request: error.request,
      config: error.config
    });
    return Promise.reject(error);
  }
);

export default api;