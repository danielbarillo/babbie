import { Request, Response, NextFunction } from 'express';
import { UserDocument } from '../models/User';
import mongoose from 'mongoose';

// Base types
export interface AuthenticatedUser extends UserDocument {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
}

export interface GuestUser {
  type: 'guest';
  username: string;
}

// Request types
export interface AuthRequest extends Request {
  userState?: AuthenticatedUser | GuestUser | null;
  user?: AuthenticatedUser;
}

// Handler types
export type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any> | any;

export type AuthRequestHandler = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => Promise<any> | any;

export type RouteHandler = (
  req: AuthRequest,
  res: Response,
  next?: NextFunction
) => Promise<any> | any;