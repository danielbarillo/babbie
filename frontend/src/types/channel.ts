export interface Channel {
  _id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  isRestricted?: boolean;
  members: Array<{
    _id: string;
    username: string;
  }>;
  unreadCount?: number;
  createdAt: string;
  updatedAt: string;
}