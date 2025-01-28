import { UserState, AuthenticatedUser } from '../types/common';
import { AppError } from './errors';

export const isAuthenticated = (userState: UserState | undefined): userState is AuthenticatedUser => {
  return userState?.type === 'authenticated';
};

export const ensureAuthenticated = (userState: UserState | undefined): AuthenticatedUser => {
  if (!isAuthenticated(userState)) {
    throw new AppError(401, 'User must be authenticated');
  }
  return userState;
};