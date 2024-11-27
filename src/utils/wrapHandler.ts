import { Request, Response, NextFunction } from 'express';
import { AuthRequest, RequestHandler, AuthRequestHandler } from '../types/express';

export const wrapHandler = (handler: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res);
    } catch (error) {
      next(error);
    }
  };
};

export const wrapAuthHandler = (handler: AuthRequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await handler(req as AuthRequest, res);
      if (result) return result;
    } catch (error) {
      next(error);
    }
  };
};