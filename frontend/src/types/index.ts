export type UserStatus = 'online' | 'offline' | 'away';

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
}

export interface BaseUser {
  username: string;
  status: UserStatus;
  lastSeen?: string;
}

export interface AuthenticatedUser extends BaseUser {
  _id: string;
  email?: string;
  type: 'authenticated';
  preferences: UserPreferences;
}

export interface GuestUser extends BaseUser {
  type: 'guest';
}

export type User = AuthenticatedUser | GuestUser;

export interface Channel {
  _id: string;
  name: string;
  isPrivate: boolean;
  members: User[];
  createdAt: string;
}

export interface Message {
  _id: string;
  content: string;
  sender: User;
  channelId?: string;
  recipientId?: string;
  createdAt: string;
}

export interface Conversation {
  _id: string;
  username: string;
  lastMessage?: Message;
  unreadCount?: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}
