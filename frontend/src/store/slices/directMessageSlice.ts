import type { StateCreator } from 'zustand';
import type { StoreState, DirectMessageState } from '../../types/store';
import api from '../../config/api';

export const createDirectMessageSlice: StateCreator<
  StoreState,
  [],
  [],
  DirectMessageState
> = (set, get, store) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  error: null,
  loading: false,

  fetchConversations: async () => {
    try {
      set({ loading: true });
      const response = await api.get('/api/dm/conversations');
      set({
        conversations: response.data,
        loading: false
      });
    } catch (error) {
      set({
        error: 'Failed to fetch conversations',
        loading: false
      });
    }
  },

  startConversation: async (userId: string) => {
    try {
      set((state) => ({ ...state, loading: true }));
      const response = await api.post('/dm/conversations', { userId });
      set((state) => ({
        ...state,
        conversations: [...state.conversations, response.data],
        currentConversation: response.data,
        loading: false
      }));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start conversation';
      set((state) => ({
        ...state,
        error: errorMessage,
        loading: false
      }));
      throw error;
    }
  },

  setCurrentConversation: (conversation) => {
    set((state) => ({
      ...state,
      currentConversation: conversation,
      messages: []
    }));
  },

  sendDirectMessage: async (content: string, recipientId: string) => {
    try {
      set((state) => ({ ...state, loading: true }));
      const response = await api.post(`/api/dm/${recipientId}`, { content });
      set((state) => ({
        ...state,
        messages: [...state.messages, response.data],
        loading: false
      }));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      set((state) => ({
        ...state,
        error: errorMessage,
        loading: false
      }));
      throw error;
    }
  },

  fetchDirectMessages: async (userId: string) => {
    try {
      set({ loading: true });
      const response = await api.get(`/api/dm/${userId}`);
      set({
        messages: response.data,
        loading: false
      });
    } catch (error) {
      set({
        error: 'Failed to fetch messages',
        loading: false
      });
    }
  },

  clearMessages: () => {
    set((state) => ({
      ...state,
      messages: []
    }));
  }
});