import { create } from 'zustand';
import type { StoreState } from '../types/store';
import { createAuthSlice } from './slices/authSlice';
import { createChatSlice } from './slices/chatSlice';
import { createDirectMessageSlice } from './slices/directMessageSlice';

export const useStore = create<StoreState>()((set, get) => ({
  auth: createAuthSlice(set),
  chat: createChatSlice(set, get),
  dm: createDirectMessageSlice(set, get)
}));