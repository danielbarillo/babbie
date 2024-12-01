import React, { createContext, useContext, useState } from 'react';
import api from '../api/axios';

interface User {
  id?: string;
  username: string;
  email?: string;
  type: 'authenticated' | 'guest';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('Attempting login for user:', username);
      const response = await api.post('/auth/login', { username, password });
      console.log('Login response:', response.data);

      const userData = response.data.user;
      const token = response.data.token;

      if (!token) {
        throw new Error('No token received from server');
      }

      setUser({
        id: userData.id,
        username: userData.username,
        email: userData.email,
        type: 'authenticated'
      });

      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('Login successful, token stored');
    } catch (error: any) {
      console.error('Login error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsGuest = async () => {
    setIsLoading(true);
    try {
      console.log('Setting up guest user');
      setUser({
        username: 'Guest',
        type: 'guest'
      });
      // Remove any existing auth token
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      console.log('Guest login successful');
    } catch (error: any) {
      console.error('Guest login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('Logging out user');
    setUser(null);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    console.log('Logout successful');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}