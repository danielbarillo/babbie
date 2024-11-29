import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../api/axios';

interface ApiError extends Error {
  response?: {
    data?: {
      message?: string
      details?: string
    }
    status?: number
  }
}

// Define user states
type AuthenticatedUser = {
  _id: string
  username: string
  email: string
  type: 'authenticated'
}

type GuestUser = {
  type: 'guest'
}

type UserState = AuthenticatedUser | GuestUser

interface Channel {
  _id: string
  name: string
  description?: string
  isPrivate: boolean
  members: string[]
}

interface Message {
  _id: string
  content: string
  sender: AuthenticatedUser | { username: string; type: 'guest' }
  createdAt: string
}

interface DirectMessage {
  _id: string;
  content: string;
  sender: AuthenticatedUser;
  recipient: AuthenticatedUser;
  createdAt: string;
}

interface Conversation {
  _id: string;
  username: string;
  lastMessage: DirectMessage;
}

interface StoreState {
  userState: UserState | null
  token: string | null
  error: string | null
  currentChannel: Channel | null
  currentConversation: Conversation | null
  channels: Channel[]
  messages: Message[]
  directMessages: DirectMessage[]
  conversations: Conversation[]
  isLoading: boolean
  isInitialized: boolean

  // Auth actions
  login: (credentials: { username: string; password: string }) => Promise<void>
  loginAsGuest: () => Promise<void>
  register: (userData: { username: string; email: string; password: string }) => Promise<void>
  logout: () => void
  clearError: () => void
  checkAuth: () => Promise<boolean>

  // Channel actions
  fetchChannels: () => Promise<void>
  createChannel: (channelData: { name: string; isPrivate: boolean; description?: string }) => Promise<void>
  joinChannel: (channelId?: string) => Promise<void>
  leaveChannel: (channelId: string) => Promise<void>

  // Message actions
  sendMessage: (content: string) => Promise<void>
  fetchMessages: (channelId: string) => Promise<void>

  // DM actions
  fetchConversations: () => Promise<void>
  fetchDirectMessages: (userId: string) => Promise<void>
  sendDirectMessage: (content: string, recipientId: string) => Promise<void>
  setCurrentConversation: (conversation: Conversation | null) => void
}

const API_URL = import.meta.env.VITE_API_URL;

console.log('Environment:', import.meta.env.MODE);
console.log('API URL:', API_URL);
console.log('Base URL from axios:', api.defaults.baseURL);

if (!API_URL) {
  console.error('VITE_API_URL is not defined!')
}

// Helper function to check if user is authenticated
const isAuthenticated = (userState: UserState | null): userState is AuthenticatedUser => {
  return userState?.type === 'authenticated'
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      userState: null,
      token: null,
      error: null,
      currentChannel: null,
      currentConversation: null,
      channels: [],
      messages: [],
      directMessages: [],
      conversations: [],
      isLoading: false,
      isInitialized: false,

      checkAuth: async () => {
        const { userState, token } = get();
        if (!isAuthenticated(userState) || !token) {
          set({ isInitialized: true });
          return false;
        }

        try {
          const { data } = await api.get('/api/auth/me');
          set({ isInitialized: true });

          // Fetch channels after verifying auth
          const store = get();
          await store.fetchChannels();

          if (store.channels.length > 0 && !store.currentChannel) {
            await store.joinChannel(store.channels[0]._id);
          }

          return true;
        } catch (error) {
          get().logout();
          set({ isInitialized: true });
          return false;
        }
      },

      login: async (credentials) => {
        try {
          set({ isLoading: true, error: null });
          console.log('Attempting login with credentials:', { ...credentials, password: '[REDACTED]' });
          const { data } = await api.post('/api/auth/login', credentials);

          const authenticatedUser: AuthenticatedUser = {
            _id: data.user.id,
            username: data.user.username,
            email: data.user.email,
            type: 'authenticated'
          };

          set({
            userState: authenticatedUser,
            token: data.token,
            isLoading: false,
            error: null,
            isInitialized: true
          });

          // Store token in localStorage for axios interceptor
          localStorage.setItem('token', data.token);

          // Fetch channels after login
          const store = get();
          await store.fetchChannels();

          if (store.channels.length > 0) {
            await store.joinChannel(store.channels[0]._id);
          }
        } catch (error) {
          const apiError = error as ApiError;
          const errorMessage = apiError.response?.data?.message || apiError.message;
          set({
            error: errorMessage,
            isLoading: false,
            userState: null,
            token: null
          });
          throw new Error(errorMessage);
        }
      },

      loginAsGuest: async () => {
        try {
          set({ isLoading: true, error: null })

          const guestUser: GuestUser = {
            type: 'guest'
          }

          set({
            userState: guestUser,
            isLoading: false,
            error: null,
            isInitialized: true
          })

          // Fetch public channels
          const store = get()
          await store.fetchChannels()

          // Join first public channel if available
          const publicChannels = store.channels.filter(ch => !ch.isPrivate)
          if (publicChannels.length > 0) {
            await store.joinChannel(publicChannels[0]._id)
          }
        } catch (error) {
          const apiError = error as ApiError
          set({
            error: apiError.message || 'Failed to login as guest',
            isLoading: false,
            userState: null
          })
          throw new Error(apiError.message || 'Failed to login as guest')
        }
      },

      register: async (userData) => {
        try {
          set({ isLoading: true, error: null });
          const { data } = await api.post('/api/auth/register', userData);

          const authenticatedUser: AuthenticatedUser = {
            _id: data.user.id,
            username: data.user.username,
            email: data.user.email,
            type: 'authenticated'
          };

          set({
            userState: authenticatedUser,
            token: data.token,
            isLoading: false,
            error: null,
            isInitialized: true
          });

          localStorage.setItem('token', data.token);

          const store = get();
          await store.fetchChannels();

          if (store.channels.length > 0) {
            await store.joinChannel(store.channels[0]._id);
          }
        } catch (error) {
          const apiError = error as ApiError;
          const errorMessage = apiError.response?.data?.message || apiError.message;
          set({
            error: errorMessage,
            isLoading: false,
            userState: null
          });
          throw new Error(errorMessage);
        }
      },

      logout: () => {
        set({
          userState: null,
          token: null,
          currentChannel: null,
          channels: [],
          messages: [],
          error: null,
          isInitialized: true
        })
      },

      clearError: () => set({ error: null }),

      fetchChannels: async () => {
        try {
          set({ isLoading: true, error: null });
          const { data } = await api.get('/api/channels');
          set({ channels: data, isLoading: false });
        } catch (error) {
          const apiError = error as ApiError;
          set({
            error: apiError.response?.data?.message || 'Failed to fetch channels',
            isLoading: false
          });
        }
      },

      createChannel: async (channelData) => {
        try {
          set({ isLoading: true, error: null });
          const { data: newChannel } = await api.post('/api/channels', channelData);
          set(state => ({
            channels: [...state.channels, newChannel],
            currentChannel: newChannel,
            isLoading: false
          }));
        } catch (error) {
          const apiError = error as ApiError;
          set({
            error: apiError.response?.data?.message || 'Failed to create channel',
            isLoading: false
          });
          throw error;
        }
      },

      joinChannel: async (channelId?: string) => {
        try {
          if (!channelId) {
            console.log('No channel ID provided, skipping join');
            return;
          }

          set({ isLoading: true, error: null });
          const { channels } = get();

          const channel = channels.find(c => c._id === channelId);
          if (!channel) {
            console.log('Channel not found in local state:', channelId);
            return;
          }

          await api.post(`/api/channels/${channelId}/join`);
          set({ currentChannel: channel, isLoading: false });
          await get().fetchMessages(channelId);
        } catch (error) {
          const apiError = error as ApiError;
          set({
            error: apiError.response?.data?.message || 'Failed to join channel',
            isLoading: false
          });
        }
      },

      leaveChannel: async (channelId) => {
        try {
          set({ isLoading: true, error: null });
          await api.post(`/api/channels/${channelId}/leave`);

          set(state => ({
            channels: state.channels.filter(ch => ch._id !== channelId),
            currentChannel: state.currentChannel?._id === channelId ? null : state.currentChannel,
            isLoading: false
          }));
        } catch (error) {
          const apiError = error as ApiError;
          set({
            error: apiError.response?.data?.message || 'Failed to leave channel',
            isLoading: false
          });
        }
      },

      sendMessage: async (content) => {
        const { currentChannel } = get();
        if (!currentChannel) {
          set({ error: 'No channel selected' });
          return;
        }

        try {
          set({ isLoading: true, error: null });
          const { data } = await api.post(`/api/messages/channel/${currentChannel._id}`, { content });
          set(state => ({
            messages: [...state.messages, data],
            isLoading: false
          }));
        } catch (error) {
          const apiError = error as ApiError;
          set({
            error: apiError.response?.data?.message || 'Failed to send message',
            isLoading: false
          });
        }
      },

      fetchMessages: async (channelId) => {
        try {
          set({ isLoading: true, error: null });
          const { data } = await api.get(`/api/messages/channel/${channelId}`);
          set({ messages: data, isLoading: false });
        } catch (error) {
          const apiError = error as ApiError;
          set({
            error: apiError.response?.data?.message || 'Failed to fetch messages',
            isLoading: false
          });
        }
      },

      fetchConversations: async () => {
        try {
          set({ isLoading: true, error: null });
          const { data } = await api.get('/api/dm/conversations');
          set({ conversations: data, isLoading: false });
        } catch (error) {
          console.error('Fetch conversations error:', error);
          const apiError = error as ApiError;
          set({
            error: apiError.response?.data?.message || 'Failed to fetch conversations',
            isLoading: false
          });
        }
      },

      fetchDirectMessages: async (userId: string) => {
        try {
          set({ isLoading: true, error: null });
          const { data } = await api.get(`/api/dm/${userId}`);
          set({ directMessages: data, isLoading: false });
        } catch (error) {
          console.error('Fetch direct messages error:', error);
          const apiError = error as ApiError;
          set({
            error: apiError.response?.data?.message || 'Failed to fetch messages',
            isLoading: false
          });
        }
      },

      sendDirectMessage: async (content: string, recipientId: string) => {
        try {
          set({ isLoading: true, error: null });
          const { data: message } = await api.post('/api/dm', { content, recipientId });

          set(state => ({
            directMessages: [...state.directMessages, message],
            isLoading: false
          }));

          await get().fetchConversations();
        } catch (error) {
          console.error('Send direct message error:', error);
          const apiError = error as ApiError;
          set({
            error: apiError.response?.data?.message || 'Failed to send message',
            isLoading: false
          });
        }
      },

      setCurrentConversation: (conversation: Conversation | null) => {
        set({ currentConversation: conversation });
        if (conversation) {
          get().fetchDirectMessages(conversation._id);
        }
      }
    }),
    {
      name: 'chappy-storage',
      partialize: (state) => ({
        userState: state.userState,
        token: state.token
      })
    }
  )
)