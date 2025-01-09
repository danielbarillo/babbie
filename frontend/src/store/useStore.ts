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
  guestName: string | null

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
  sendMessage: (content: string, guestName?: string) => Promise<void>
  fetchMessages: (channelId: string) => Promise<void>

  // DM actions
  fetchConversations: () => Promise<void>
  fetchDirectMessages: (userId: string) => Promise<void>
  sendDirectMessage: (content: string, recipientId: string) => Promise<void>
  setCurrentConversation: (conversation: Conversation | null) => void

  // Guest actions
  setGuestName: (name: string) => void
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
      guestName: null,

      checkAuth: async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            set({ isInitialized: true });
            return false;
          }

          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const { data } = await api.get('/auth/me');

          if (!data || !data.user) {
            throw new Error('Invalid response from server');
          }

          const authenticatedUser: AuthenticatedUser = {
            _id: data.user._id,
            username: data.user.username,
            email: data.user.email,
            type: 'authenticated'
          };

          set({
            userState: authenticatedUser,
            token,
            isLoading: false,
            error: null,
            isInitialized: true
          });

          // Fetch initial data
          await get().fetchChannels();
          await get().fetchConversations();

          return true;
        } catch (error) {
          console.error('Auth check error:', error);
          // Clear any invalid auth state
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];

          set({
            userState: null,
            token: null,
            error: null,
            isLoading: false,
            isInitialized: true,
            channels: [],
            messages: [],
            conversations: [],
            currentChannel: null,
            currentConversation: null,
            directMessages: []
          });

          return false;
        }
      },

      login: async (credentials) => {
        try {
          set({ isLoading: true, error: null });
          const { data } = await api.post('/auth/login', credentials);

          if (!data || !data.token || !data.user) {
            throw new Error('Invalid response from server');
          }

          const authenticatedUser: AuthenticatedUser = {
            _id: data.user._id,
            username: data.user.username,
            email: data.user.email,
            type: 'authenticated'
          };

          // Update axios default headers
          api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

          // Store token in localStorage
          localStorage.setItem('token', data.token);

          // Update store state
          set({
            userState: authenticatedUser,
            token: data.token,
            isLoading: false,
            error: null,
            isInitialized: true,
            channels: [],
            messages: [],
            conversations: [],
            currentChannel: null,
            currentConversation: null,
            directMessages: []
          });

          // Fetch initial data
          await get().fetchChannels();
          await get().fetchConversations();
        } catch (error: any) {
          console.error('Login error:', error);
          const errorMessage = error.response?.data?.message || error.message || 'Failed to login';

          // Clear any invalid auth state
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];

          set({
            error: errorMessage,
            isLoading: false,
            userState: null,
            token: null,
            channels: [],
            messages: [],
            conversations: [],
            currentChannel: null,
            currentConversation: null,
            directMessages: []
          });

          throw new Error(errorMessage);
        }
      },

      loginAsGuest: async () => {
        try {
          set({ isLoading: true, error: null });
          console.log("Starting guest login");

          const { guestName } = get();
          console.log("Current guest name:", guestName);

          const guestUser: GuestUser = {
            type: 'guest'
          };

          // Clear any existing auth
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];

          // Update store state
          set({
            userState: guestUser,
            token: null,
            isLoading: false,
            error: null,
            isInitialized: true
          });

          await get().fetchChannels();
        } catch (error: any) {
          console.error('Guest login error:', error);
          throw error;
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
          isLoading: false,
          isInitialized: true
        });

        console.log('Logout complete');
      },

      clearError: () => set({ error: null }),

      // Channel actions
      fetchChannels: async () => {
        try {
          const { data } = await api.get('/channels');
          set({ channels: data || [] });
        } catch (error) {
          console.error('Failed to fetch channels:', error);
          set({ channels: [] });
        }
      },

      createChannel: async (channelData) => {
        try {
          const { data } = await api.post('/channels', channelData);
          set((state) => ({
            channels: [...state.channels, data]
          }));
          return data;
        } catch (error) {
          console.error('Failed to create channel:', error);
          throw error;
        }
      },

      joinChannel: async (channelId) => {
        if (!channelId) return;
        try {
          const { data } = await api.post(`/channels/${channelId}/join`);
          set({ currentChannel: data });
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
      sendMessage: async (content, guestName) => {
        const { currentChannel, userState } = get();
        if (!currentChannel) return;

        try {
          console.log('Sending message:', { content, guestName }); // Debug
          const messageData = {
            content,
            ...(userState?.type === 'guest' && { guestName: guestName || 'Guest' })
          };

          const { data } = await api.post(
            `/messages/channel/${currentChannel._id}`,
            messageData
          );

          set((state) => ({
            messages: [...state.messages, data]
          }));
        } catch (error) {
          console.error('Failed to send message:', error);
          throw error;
        }
      },

      fetchMessages: async (channelId) => {
        try {
          const { data } = await api.get(`/messages/channel/${channelId}`);
          set({ messages: data || [] });
        } catch (error) {
          console.error('Failed to fetch messages:', error);
          set({ messages: [] });
        }
      },

      // DM actions
      fetchConversations: async () => {
        try {
          const { data } = await api.get('/dm/conversations');
          set({ conversations: data || [] });
        } catch (error) {
          console.error('Failed to fetch conversations:', error);
          set({ conversations: [] });
        }
      },

      fetchDirectMessages: async (userId) => {
        try {
          const { data } = await api.get(`/dm/${userId}`);
          set({ directMessages: data || [] });
        } catch (error) {
          console.error('Failed to fetch direct messages:', error);
          set({ directMessages: [] });
        }
      },

      sendDirectMessage: async (content, recipientId) => {
        try {
          const { data } = await api.post('/dm', { content, recipientId });
          set((state) => ({
            directMessages: [...state.directMessages, data]
          }));
          await get().fetchConversations();
        } catch (error) {
          console.error('Failed to send direct message:', error);
          throw error;
        }
      },

      setCurrentConversation: (conversation) => {
        set({ currentConversation: conversation });
        if (conversation) {
          get().fetchDirectMessages(conversation._id);
        }
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
            isInitialized: true,
            channels: [],
            messages: [],
            conversations: [],
            currentChannel: null,
            currentConversation: null,
            directMessages: []
          });

          // Store token in localStorage
          localStorage.setItem('token', data.token);
          console.log('Registration successful, user state updated');

          // Fetch initial data
          await get().fetchChannels();
          await get().fetchConversations();

        } catch (error) {
          const apiError = error as ApiError;
          const errorMessage = apiError.response?.data?.message || apiError.message;
          console.error('Registration error:', errorMessage);

          set({
            error: errorMessage,
            isLoading: false,
            userState: null,
            token: null,
            channels: [],
            messages: [],
            conversations: [],
            currentChannel: null,
            currentConversation: null,
            directMessages: []
          });

          throw new Error(errorMessage);
        }
      },

      setGuestName: (name) => {
        console.log('Setting guest name in store:', name);
        set({ guestName: name });
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