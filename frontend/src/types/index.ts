export interface User {
  _id: string;
  id: string;
  username: string;
  email: string;
}

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
