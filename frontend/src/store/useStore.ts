import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { StoreState, ChatState, AuthState } from '../types/store';
import type { Channel, Message } from '../types/messages';
import { createAuthSlice } from './slices/authSlice';
import { createChatSlice } from './slices/chatSlice';
import { createDirectMessageSlice } from './slices/directMessageSlice';
import type { User } from '../types/user';
import { authApi } from '../api/auth';
import axios from 'axios';

type StoreSet = (
  partial: StoreState | Partial<StoreState> | ((state: StoreState) => StoreState | Partial<StoreState>),
  replace?: boolean
) => void;

type StoreGet = () => StoreState;

// Update ChatState type to include lastFetch and clearState
declare module '../types/store' {
  interface ChatState {
    lastFetch: number;
    clearState: () => void;
    channels: Channel[];
    currentChannel: Channel | null;
    messages: Message[];
    isLoading: boolean;
    error: string | null;
    fetchChannels: () => Promise<void>;
    sendMessage: (content: string, channelId: string) => Promise<void>;
    fetchMessages: (channelId: string) => Promise<void>;
    joinChannel: (channelId: string) => Promise<void>;
    leaveChannel: (channelId: string) => Promise<void>;
    createChannel: (data: { name: string; isPrivate: boolean }) => Promise<void>;
    setCurrentChannel: (channel: Channel) => void;
  }
}

export const useStore = create<StoreState>()(
  devtools(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createChatSlice(...a),
      ...createDirectMessageSlice(...a)
    })
  )
);

// Convenience hooks
export const useAuth = () => useStore(state => state.auth);
export const useChat = () => useStore(state => state.chat);

// User selector with profile management
export const useUser = () => {
  const store = useStore();
  return {
    user: store.auth.user,
    isLoading: store.auth.isLoading,
    updateUser: store.auth.updateUser,
    userState: store.auth.user ? {
      type: 'authenticated' as const,
      userId: store.auth.user._id,
      username: store.auth.user.username,
      email: store.auth.user.email,
      preferences: store.auth.user.preferences
    } : {
      type: 'guest' as const,
      username: 'Guest'
    },
    logout: store.auth.logout
  };
};

export const guestLogin = async (username: string) => {
  const response = await axios.post('/api/auth/guest-login', { username });
  const { token } = response.data;
  if (token) {
    localStorage.setItem('token', token);
  }
  return response.data;
};

// Base selectors
export const useDirectMessage = () => useStore((state) => state.dm);

// Extended chat selector with combined functionality
export const useChatFeatures = () => useStore((state) => ({
  currentChannel: state.chat.currentChannel,
  messages: state.chat.messages,
  channels: state.chat.channels,
  isLoading: state.chat.isLoading,
  error: state.chat.error,
  sendMessage: state.chat.sendMessage,
  fetchMessages: state.chat.fetchMessages,
  joinChannel: state.chat.joinChannel,
  leaveChannel: state.chat.leaveChannel,
  fetchChannels: state.chat.fetchChannels,
  createChannel: state.chat.createChannel,
  setCurrentChannel: state.chat.setCurrentChannel,
  clearState: state.chat.clearState
}));

export const chatSlice = (set: StoreSet, get: StoreGet) => ({
  chat: {
    channels: [],
    currentChannel: null,
    messages: [],
    isLoading: false,
    error: null,
    lastFetch: 0,

    fetchChannels: async () => {
      const now = Date.now();
      const minInterval = 5000; // 5 seconds minimum between fetches
      const lastFetch = get().chat.lastFetch || 0;

      // If we've fetched recently, skip this fetch
      if (now - lastFetch < minInterval) {
        console.log('Skipping fetch due to rate limit');
        return;
      }

      set({ chat: { ...get().chat, isLoading: true, error: null } });

      try {
        const response = await fetch('/api/channels');
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment before trying again.');
        }
        if (!response.ok) {
          throw new Error(`Failed to fetch channels: ${response.statusText}`);
        }

        const channels = await response.json();
        set({
          chat: {
            ...get().chat,
            channels,
            isLoading: false,
            lastFetch: now
          }
        });
      } catch (error) {
        console.error('Error fetching channels:', error);
        set({
          chat: {
            ...get().chat,
            error: error instanceof Error ? error.message : 'Failed to fetch channels',
            isLoading: false
          }
        });
      }
    },

    sendMessage: async (content: string, channelId: string) => {
      try {
        const response = await fetch(`/api/channels/${channelId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content })
        });

        if (!response.ok) {
          throw new Error('Failed to send message');
        }

        const message = await response.json();
        set({
          chat: {
            ...get().chat,
            messages: [...get().chat.messages, message]
          }
        });
      } catch (error) {
        console.error('Error sending message:', error);
        set({
          chat: {
            ...get().chat,
            error: error instanceof Error ? error.message : 'Failed to send message'
          }
        });
      }
    },

    fetchMessages: async (channelId: string) => {
      try {
        const response = await fetch(`/api/channels/${channelId}/messages`);
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }

        const messages = await response.json();
        set({
          chat: {
            ...get().chat,
            messages
          }
        });
      } catch (error) {
        console.error('Error fetching messages:', error);
        set({
          chat: {
            ...get().chat,
            error: error instanceof Error ? error.message : 'Failed to fetch messages'
          }
        });
      }
    },

    joinChannel: async (channelId: string) => {
      try {
        const response = await fetch(`/api/channels/${channelId}/join`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          const error = await response.json();
          if (response.status === 403) {
            throw new Error('This channel requires authentication');
          }
          throw new Error(error.message || 'Failed to join channel');
        }

        // Refresh channels after joining
        await get().chat.fetchChannels();

      } catch (error) {
        console.error('Error joining channel:', error);
        set({
          chat: {
            ...get().chat,
            error: error instanceof Error ? error.message : 'Failed to join channel'
          }
        });
      }
    },

    leaveChannel: async (channelId: string) => {
      try {
        const response = await fetch(`/api/channels/${channelId}/leave`, {
          method: 'POST'
        });
        if (!response.ok) {
          throw new Error('Failed to leave channel');
        }
      } catch (error) {
        console.error('Error leaving channel:', error);
        set({
          chat: {
            ...get().chat,
            error: error instanceof Error ? error.message : 'Failed to leave channel'
          }
        });
      }
    },

    createChannel: async (data: { name: string; isPrivate: boolean }) => {
      try {
        const response = await fetch('/api/channels', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!response.ok) {
          throw new Error('Failed to create channel');
        }

        const channel = await response.json();
        set({
          chat: {
            ...get().chat,
            channels: [...get().chat.channels, channel]
          }
        });
      } catch (error) {
        console.error('Error creating channel:', error);
        set({
          chat: {
            ...get().chat,
            error: error instanceof Error ? error.message : 'Failed to create channel'
          }
        });
      }
    },

    setCurrentChannel: (channel: Channel) => {
      set({
        chat: {
          ...get().chat,
          currentChannel: channel
        }
      });
    },

    clearState: () => {
      const currentState = get().chat;
      set({
        chat: {
          ...currentState,
          channels: [],
          currentChannel: null,
          messages: [],
          isLoading: false,
          error: null,
          lastFetch: 0
        }
      });
    }
  } as ChatState
});