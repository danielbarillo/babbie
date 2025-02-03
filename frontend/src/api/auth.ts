import api from './axios';
import type { LoginResponse, LoginCredentials } from '../types/auth';

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<LoginResponse>('/api/auth/login', credentials);
    return response.data;
  },

  register: async (data: { username: string; email: string; password: string }) => {
    const response = await api.post<LoginResponse>('/api/auth/register', data);
    return response.data;
  },

  checkAuth: async () => {
    try {
      const response = await api.get('/api/auth/me');
      return response.data;
    } catch (error) {
      console.error('Check auth error:', error);
      throw error;
    }
  },

  logout: async () => {
    await api.post('/api/auth/logout');
  },

  guestLogin: async (username: string) => {
    const response = await api.post<LoginResponse>('/api/auth/guest-login', { username });
    return response.data;
  }
};