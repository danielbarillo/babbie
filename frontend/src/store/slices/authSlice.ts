import { StateCreator } from 'zustand';
import { authApi } from '../../api/auth';
import type { StoreState } from '../../types/store';
import type { User } from '../../types/user';
import type { AxiosError } from 'axios';

interface ErrorResponse {
  message: string;
}

type AuthError = AxiosError<ErrorResponse> | Error | unknown;

const getErrorMessage = (error: AuthError): string => {
  if (error && typeof error === 'object') {
    if ('response' in error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return axiosError.response?.data?.message || 'Request failed';
    }
    if (error instanceof Error) {
      return error.message;
    }
  }
  return 'An unexpected error occurred';
};

export const createAuthSlice: StateCreator<
  StoreState,
  [],
  [],
  Pick<StoreState, 'auth'>
> = (set, get) => ({
  auth: {
    user: null,
    isLoading: true,
    error: null,

    login: async (username: string, password: string) => {
      try {
        const { token, user } = await authApi.login({ username, password });
        localStorage.setItem('token', token);
        set(state => ({ auth: { ...state.auth, user, error: null } }));
        return user;
      } catch (error) {
        const message = getErrorMessage(error);
        set(state => ({ auth: { ...state.auth, error: message } }));
        throw new Error(message);
      }
    },

    register: async (username: string, email: string, password: string) => {
      try {
        const { token, user } = await authApi.register({ username, email, password });
        localStorage.setItem('token', token);
        set(state => ({ auth: { ...state.auth, user, error: null } }));
        return user;
      } catch (error) {
        const message = getErrorMessage(error);
        set(state => ({ auth: { ...state.auth, error: message } }));
        throw new Error(message);
      }
    },

    logout: async () => {
      try {
        await authApi.logout();
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        localStorage.removeItem('token');
        set(state => ({ auth: { ...state.auth, user: null, error: null } }));
      }
    },

    checkAuth: async () => {
      try {
        set(state => ({ auth: { ...state.auth, isLoading: true } }));
        const token = localStorage.getItem('token');

        if (!token) {
          set(state => ({ auth: { ...state.auth, user: null, isLoading: false } }));
          return;
        }

        const { user } = await authApi.checkAuth();
        set(state => ({
          auth: {
            ...state.auth,
            user,
            isLoading: false,
            error: null
          }
        }));
      } catch (error) {
        localStorage.removeItem('token');
        const message = getErrorMessage(error);
        set(state => ({
          auth: {
            ...state.auth,
            user: null,
            isLoading: false,
            error: message
          }
        }));
      }
    },

    updateUser: (userData: Partial<User>) => {
      const { auth } = get();
      if (auth.user) {
        set(state => ({
          auth: {
            ...state.auth,
            user: { ...auth.user, ...userData }
          }
        }));
      }
    },

    guestLogin: async (username: string) => {
      try {
        set(state => ({ auth: { ...state.auth, isLoading: true, error: null } }));
        const { token, user } = await authApi.guestLogin(username);
        
        localStorage.setItem('token', token);
        set(state => ({
          auth: {
            ...state.auth,
            user: { ...user },
            isLoading: false,
            error: null
          }
        }));
      } catch (error) {
        const message = getErrorMessage(error);
        set(state => ({
          auth: {
            ...state.auth,
            user: null,
            isLoading: false,
            error: message
          }
        }));
      }
    }
  }
});