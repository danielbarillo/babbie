export type UserStatus = 'online' | 'away' | 'offline' | 'busy';

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  soundEnabled: boolean;
}

export interface BaseUser {
  _id?: string;
  username: string;
  status: UserStatus;
  type: 'authenticated' | 'guest';
}

export interface AuthenticatedUser extends BaseUser {
  type: 'authenticated';
  email: string;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface GuestUser extends BaseUser {
  type: 'guest';
}

export type User = AuthenticatedUser | GuestUser;

export interface User {
  _id: string;
  username: string;
  email: string;
  isOnline: boolean;
  avatarColor: string;
  createdAt: string;
  updatedAt: string;
}