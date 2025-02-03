import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express';
import { User } from '../models/User';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserState, AuthenticatedUser, UserPreferences } from '../types/common';
import { AppError } from '../utils/errors';
import { config } from '../config/config';
import { AuthenticatedRequest } from '../types/express';

// Re-export AuthRequest type
export type { AuthRequest } from '../types/express';

// Default preferences
const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'light',
  notifications: true,
  language: 'en'
};

// Add verifyToken function
export const verifyToken = async (token: string): Promise<AuthenticatedUser> => {
  try {
    const decoded = jwt.verify(
      token,
      config.jwtSecret
    ) as { userId: string };

    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      type: 'authenticated',
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
      preferences: user.preferences || DEFAULT_PREFERENCES
    };
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Helper function to check if user is authenticated
export const isAuthenticated = (userState: UserState | undefined): userState is AuthenticatedUser => {
  return Boolean(userState && userState.type === 'authenticated');
};

// Helper function to ensure user is authenticated and get ID
export const getAuthenticatedUserId = (userState: UserState | undefined): string => {
  if (!userState || userState.type !== 'authenticated') {
    throw new Error('User must be authenticated');
  }
  return userState.userId;
};

// Main auth middleware
export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      req.userState = { type: 'guest', username: 'Guest' };
      return next();
    }

    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;

    if (!decoded.userId) {
      req.userState = { type: 'guest', username: 'Guest' };
      return next();
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      req.userState = { type: 'guest', username: 'Guest' };
      return next();
    }

    req.user = user;
    req.userState = {
      type: 'authenticated',
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
      preferences: user.preferences
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    req.userState = { type: 'guest', username: 'Guest' };
    next();
  }
};

// Middleware that allows both authenticated and guest users
export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      req.userState = { type: 'guest', username: 'Guest' };
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const user = await User.findById(decoded.userId);

    if (user) {
      req.userState = {
        type: 'authenticated',
        userId: decoded.userId,
        username: user.username,
        email: user.email,
        preferences: user.preferences || DEFAULT_PREFERENCES
      };
    } else {
      req.userState = { type: 'guest', username: 'Guest' };
    }

    next();
  } catch (error) {
    req.userState = { type: 'guest', username: 'Guest' };
    next();
  }
};

// Middleware to require authentication
export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  next();
};

// Middleware to attach user state - either authenticated or guest
// backend/src/middleware/auth.ts

export const attachUserState = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      req.userState = { type: 'guest', username: 'Guest' };
      return next();
    }

    const decoded = jwt.verify(
      token,
      config.jwtSecret
    ) as { userId?: string; isGuest?: boolean; guestUsername?: string };

    if (decoded.isGuest && decoded.guestUsername) {
      req.userState = {
        type: 'guest',
        username: decoded.guestUsername
      };
      return next();
    }

    if (!decoded.userId) {
      req.userState = { type: 'guest', username: 'Guest' };
      return next();
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      req.userState = { type: 'guest', username: 'Guest' };
      return next();
    }

    req.userState = {
      type: 'authenticated',
      userId: decoded.userId,
      username: user.username,
      email: user.email,
      preferences: user.preferences || DEFAULT_PREFERENCES
    };

    next();
  } catch (error) {
    req.userState = { type: 'guest', username: 'Guest' };
    next();
  }
};

export const ensureAuthenticated = (userState: UserState | undefined): AuthenticatedUser => {
  if (!userState || userState.type !== 'authenticated') {
    throw new AppError(401, 'User must be authenticated');
  }
  return userState;
};