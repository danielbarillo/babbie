export interface User {
  _id: string;
  username: string;
  avatarColor?: string;
  email?: string;
  isOnline?: boolean;
}

export interface Message {
  _id: string;
  content: string;
  sender: User;
  createdAt: string;
  channel?: string;
}

export interface Conversation {
  _id: string;
  participants: string[];
  messages: Message[];
}

export interface Channel {
  _id: string;
  name: string;
  description?: string;
  members: string[];
  messages: Message[];
  createdAt: string;
  isPrivate: boolean;
}