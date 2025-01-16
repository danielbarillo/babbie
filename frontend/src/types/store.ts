export interface Conversation {
  _id: string;
  username: string;
  isOnline?: boolean;
  lastMessage?: {
    content: string;
    createdAt: string;
  };
}