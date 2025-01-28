import { StateCreator } from 'zustand';
import { StoreState } from '../../types/store';
import { Channel } from '../../types/messages';
import api from '../../config/api';

export interface ChannelSlice {
  channels: Channel[];
  currentChannel: Channel | null;
  createChannel: (name: string, isPrivate: boolean) => Promise<void>;
  fetchChannels: () => Promise<void>;
  setCurrentChannel: (channel: Channel | null) => void;
  deleteChannel: (channelId: string) => Promise<void>;
}

export const createChannelSlice: StateCreator<StoreState, [], [], ChannelSlice> = (set) => ({
  channels: [],
  currentChannel: null,

  createChannel: async (name, isPrivate) => {
    try {
      const { data } = await api.post('/channels', { name, isPrivate });
      set((state) => ({
        channels: [...state.channels, data]
      }));
    } catch (error) {
      console.error('Failed to create channel:', error);
      throw error;
    }
  },

  fetchChannels: async () => {
    try {
      const { data } = await api.get('/channels');
      set({ channels: data });
    } catch (error) {
      console.error('Failed to fetch channels:', error);
      throw error;
    }
  },

  setCurrentChannel: (channel) => {
    set({ currentChannel: channel });
  },

  deleteChannel: async (channelId) => {
    try {
      await api.delete(`/channels/${channelId}`);
      set((state) => ({
        channels: state.channels.filter((channel) => channel._id !== channelId),
        currentChannel: state.currentChannel?._id === channelId ? null : state.currentChannel
      }));
    } catch (error) {
      console.error('Failed to delete channel:', error);
      throw error;
    }
  }
});
