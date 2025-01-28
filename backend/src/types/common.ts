import { Document } from 'mongoose';

export interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  avatarColor?: string;
  isOnline?: boolean;
  lastSeen?: Date;
}

export interface UserPreferences {
  theme: string;
  notifications: boolean;
  language: string;
}

export type GuestUser = {
  type: 'guest';
  username: string;
};

export type AuthenticatedUser = {
  type: 'authenticated';
  userId: string;
  username: string;
  email: string;
  preferences: UserPreferences;
};

export type UserState = GuestUser | AuthenticatedUser;