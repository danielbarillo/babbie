import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserDocument } from '../models/User';

// Define specific types for different user states
type AuthenticatedUser = {
  _id: string;
  username: string;
  email: string;
  type: 'authenticated';
};

type GuestUser = {
  type: 'guest';
};

type UserState = AuthenticatedUser | GuestUser;

// Extend Request with our specific user type
export interface AuthRequest extends Request {
  userState?: UserState;
  user?: { _id: string };
}

interface JwtPayload {
  userId: string;
}

// Helper function to check if user is authenticated
export const isAuthenticated = (userState: UserState): userState is AuthenticatedUser => {
  return userState.type === 'authenticated';
};

// Middleware to attach user state - either authenticated or guest
export const attachUserState = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      req.userState = { type: 'guest' };
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const user = await User.findById(decoded.userId).select('_id username email') as UserDocument | null;

    if (!user) {
      req.userState = { type: 'guest' };
      return next();
    }

    const userState: AuthenticatedUser = {
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      type: 'authenticated'
    };

    req.userState = userState;
    req.user = { _id: userState._id };
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    req.userState = { type: 'guest' };
    next();
  }
};

// Middleware to require authentication
export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const user = await User.findById(decoded.userId) as UserDocument | null;

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const userState: AuthenticatedUser = {
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      type: 'authenticated'
    };

    req.userState = userState;
    req.user = { _id: userState._id };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};