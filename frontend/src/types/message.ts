export interface Message {
  _id: string;
  content: string;
  sender: {
    _id?: string;
    username: string;
    type: 'authenticated' | 'guest';
  };
  createdAt: string;
  channel?: string;
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

export interface User {
  _id: string;
  username: string;
  email?: string;
  isOnline?: boolean;
}

export interface DirectMessage extends Omit<Message, 'channel'> {
  recipient: {
    _id: string;
    username: string;
    type: 'authenticated';
  };
}