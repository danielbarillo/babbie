import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import type { AuthRequest } from '../types/express';

interface JWTPayload {
  _id: string;
  username: string;
  avatarColor?: string;
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Please authenticate.' });
    }

    const decoded = jwt.verify(token, config.jwtSecret) as JWTPayload;
    (req as AuthRequest).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate.' });
  }
};

export const guestOrAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (token) {
      const decoded = jwt.verify(token, config.jwtSecret) as JWTPayload;
      (req as AuthRequest).user = decoded;
    }
    next();
  } catch (error) {
    // Continue as guest if token is invalid
    next();
  }
};