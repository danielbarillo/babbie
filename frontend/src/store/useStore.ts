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
          const { data } = await api.get('/auth/me');
          set({ isInitialized: true });
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
          const { data } = await api.post('/auth/login', credentials);
          console.log('Login response:', data);

          if (!data.token || !data.user) {
            throw new Error('Invalid response from server');
          }

          const authenticatedUser: AuthenticatedUser = {
            _id: data.user.id,
            username: data.user.username,
            email: data.user.email,
            type: 'authenticated'
          };

          // Update axios default headers
          api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

          // Update store state
          set({
            userState: authenticatedUser,
            token: data.token,
            isLoading: false,
            error: null,
            isInitialized: true
          });

          // Store token in localStorage
          localStorage.setItem('token', data.token);
          console.log('Login successful, user state updated');

          // Fetch initial data
          const store = get();
          await store.fetchChannels();
          await store.fetchConversations();

          // Join first available channel if none is selected
          const channels = get().channels;
          if (channels.length > 0 && !get().currentChannel) {
            await store.joinChannel(channels[0]._id);
          }

        } catch (error) {
          const apiError = error as ApiError;
          const errorMessage = apiError.response?.data?.message || apiError.message;
          console.error('Login error:', errorMessage);

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
          set({ isLoading: true, error: null });
          console.log('Setting up guest user');

          const guestUser: GuestUser = {
            type: 'guest'
          };

          set({
            userState: guestUser,
            token: null,
            isLoading: false,
            error: null,
            isInitialized: true
          });

          console.log('Guest login successful');
        } catch (error) {
          const apiError = error as ApiError;
          console.error('Guest login error:', apiError);

          set({
            error: apiError.message || 'Failed to login as guest',
            isLoading: false,
            userState: null,
            token: null
          });

          throw new Error(apiError.message || 'Failed to login as guest');
        }
      },

      logout: () => {
        console.log('Logging out...');
        // Clear auth header
        delete api.defaults.headers.common['Authorization'];
        // Clear localStorage
        localStorage.removeItem('token');
        // Reset store state
        set({
          userState: null,
          token: null,
          error: null,
          currentChannel: null,
          currentConversation: null,
          channels: [],
          messages: [],
          directMessages: [],
          conversations: [],
          isLoading: false
        });
        console.log('Logout complete');
      },

      clearError: () => set({ error: null }),

      // Channel actions
      fetchChannels: async () => {
        try {
          const { data } = await api.get('/channels');
          set({ channels: data.channels });
        } catch (error) {
          console.error('Failed to fetch channels:', error);
        }
      },

      createChannel: async (channelData) => {
        try {
          const { data } = await api.post('/channels', channelData);
          set((state) => ({
            channels: [...state.channels, data.channel]
          }));
          return data.channel;
        } catch (error) {
          console.error('Failed to create channel:', error);
          throw error;
        }
      },

      joinChannel: async (channelId) => {
        if (!channelId) return;
        try {
          const { data } = await api.post(`/channels/${channelId}/join`);
          set({ currentChannel: data.channel });
          await get().fetchMessages(channelId);
        } catch (error) {
          console.error('Failed to join channel:', error);
        }
      },

      leaveChannel: async (channelId) => {
        try {
          await api.post(`/channels/${channelId}/leave`);
          set((state) => ({
            currentChannel: state.currentChannel?._id === channelId ? null : state.currentChannel,
            channels: state.channels.filter((c) => c._id !== channelId)
          }));
        } catch (error) {
          console.error('Failed to leave channel:', error);
        }
      },

      // Message actions
      sendMessage: async (content) => {
        const { currentChannel } = get();
        if (!currentChannel) return;

        try {
          const { data } = await api.post(`/messages/${currentChannel._id}`, { content });
          set((state) => ({
            messages: [...state.messages, data.message]
          }));
        } catch (error) {
          console.error('Failed to send message:', error);
          throw error;
        }
      },

      fetchMessages: async (channelId) => {
        try {
          const { data } = await api.get(`/messages/${channelId}`);
          set({ messages: data.messages });
        } catch (error) {
          console.error('Failed to fetch messages:', error);
        }
      },

      // DM actions
      fetchConversations: async () => {
        try {
          const { data } = await api.get('/dm/conversations');
          set({ conversations: data.conversations });
        } catch (error) {
          console.error('Failed to fetch conversations:', error);
        }
      },

      fetchDirectMessages: async (userId) => {
        try {
          const { data } = await api.get(`/dm/${userId}`);
          set({ directMessages: data.messages });
        } catch (error) {
          console.error('Failed to fetch direct messages:', error);
        }
      },

      sendDirectMessage: async (content, recipientId) => {
        try {
          const { data } = await api.post('/dm', { content, recipientId });
          set((state) => ({
            directMessages: [...state.directMessages, data.message]
          }));
        } catch (error) {
          console.error('Failed to send direct message:', error);
          throw error;
        }
      },

      setCurrentConversation: (conversation) => {
        set({ currentConversation: conversation });
      },

      register: async (userData) => {
        try {
          set({ isLoading: true, error: null });
          console.log('Attempting registration:', { ...userData, password: '[REDACTED]' });

          const { data } = await api.post('/auth/register', userData);
          console.log('Registration response:', data);

          if (!data.token || !data.user) {
            throw new Error('Invalid response from server');
          }

          const authenticatedUser: AuthenticatedUser = {
            _id: data.user.id,
            username: data.user.username,
            email: data.user.email,
            type: 'authenticated'
          };

          // Update axios default headers
          api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

          // Update store state
          set({
            userState: authenticatedUser,
            token: data.token,
            isLoading: false,
            error: null,
            isInitialized: true
          });

          // Store token in localStorage
          localStorage.setItem('token', data.token);
          console.log('Registration successful, user state updated');

        } catch (error) {
          const apiError = error as ApiError;
          const errorMessage = apiError.response?.data?.message || apiError.message;
          console.error('Registration error:', errorMessage);

          set({
            error: errorMessage,
            isLoading: false,
            userState: null,
            token: null
          });

          throw new Error(errorMessage);
        }
      }
    }),
    {
      name: 'chappy-store',
      partialize: (state) => ({
        userState: state.userState,
        token: state.token
      })
    }
  )
);