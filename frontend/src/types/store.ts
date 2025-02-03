import type { User } from './user';
import type { ChatState } from './chat';
import type { Conversation, DirectMessage } from './messages';

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<User>;
  register: (username: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

export interface StoreState {
  auth: AuthState;
  chat: ChatState;
}

export interface DirectMessageState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: DirectMessage[];
  error: string | null;
  loading: boolean;
  fetchConversations: () => Promise<void>;
  startConversation: (userId: string) => Promise<void>;
  setCurrentConversation: (conversation: Conversation | null) => void;
  sendDirectMessage: (content: string, recipientId: string) => Promise<void>;
  fetchDirectMessages: (userId: string) => Promise<void>;
}