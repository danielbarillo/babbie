import { Response, NextFunction } from 'express';
import { AuthRequest, RequestHandler, AuthRequestHandler } from '../types/express';

export const wrapHandler = (handler: RequestHandler): RequestHandler => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export const wrapAuthHandler = (handler: AuthRequestHandler): AuthRequestHandler => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};