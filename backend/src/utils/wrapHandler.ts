import { Response, NextFunction } from 'express';
import { AuthRequest, AuthRequestHandler } from '../types/express';

export const wrapHandler = (
  handler: AuthRequestHandler
): AuthRequestHandler => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};