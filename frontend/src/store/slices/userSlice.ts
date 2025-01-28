import type { AuthenticatedUser, UserPreferences } from '../../types/user';
import type { StateCreator } from 'zustand';
import type { StoreState } from '../../types/store';

export interface UserSlice {
  userState: AuthenticatedUser | null;
  guestName: string | null;

  updateProfile: (data: Partial<AuthenticatedUser>) => Promise<void>;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
  setGuestName: (name: string) => void;
}

export const createUserSlice: StateCreator<
  StoreState,
  [],
  [],
  UserSlice
> = (set, get) => {
  return {
    userState: null,
    guestName: localStorage.getItem('guestName'),

    updateProfile: async (data) => {
      try {
        const { api } = get();
        const response = await api.put('/users/profile', data);
        set((state) => ({
          userState: state.userState?.type === 'authenticated'
            ? { ...state.userState, ...response.data }
            : state.userState
        }));
      } catch (error) {
        console.error('Failed to update profile:', error);
        throw error;
      }
    },

    updatePreferences: async (prefs) => {
      try {
        const { api } = get();
        const userState = get().userState;
        if (userState?.type !== 'authenticated') {
          throw new Error('Only authenticated users can update preferences');
        }

        await api.put('/users/preferences', prefs);
        set((state) => ({
          userState: state.userState?.type === 'authenticated'
            ? { ...state.userState, preferences: { ...state.userState.preferences, ...prefs } }
            : state.userState
        }));
      } catch (error) {
        console.error('Failed to update preferences:', error);
        throw error;
      }
    },

    setGuestName: (name: string) => {
      localStorage.setItem('guestName', name);
      set({ guestName: name });
    }
  };
};