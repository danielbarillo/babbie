import type { User } from './user';

export interface BaseMessage {
  _id: string;
  content: string;
  createdAt: string;
  sender: {
    _id?: string;
    username: string;
    type: 'authenticated' | 'guest';
  };
}

export interface Message {
  _id: string;
  content: string;
  sender: {
    _id?: string;
    username: string;
    type: 'authenticated' | 'guest';
  };
  channel: string;
  createdAt: string;
  updatedAt: string;
}

export interface DirectMessage {
  _id: string;
  content: string;
  sender: {
    _id: string;
    username: string;
    avatarColor?: string;
  };
  recipient: {
    _id: string;
    username: string;
  } | null;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Channel {
  _id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  isRestricted?: boolean;
  members: string[];
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Conversation {
  _id: string;
  username: string;
  isOnline?: boolean;
  lastMessage?: {
    content: string;
    createdAt: string;
    sender: {
      _id: string;
      username: string;
      type: 'authenticated' | 'guest';
    };
  };
}