import type { User } from './user';

export interface Channel {
  _id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  members: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  channelId: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatState {
  channels: Channel[];
  currentChannel: Channel | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface Conversation {
  _id: string;
  username: string;
  lastMessage?: Message;
  unreadCount?: number;
}