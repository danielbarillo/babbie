import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

export interface AuthRequest extends Request {
  user: {
    _id: string;
    username: string;
    avatarColor?: string;
  };
}

export type RequestHandler<T = any> = (
  req: Request,
  res: Response
) => Promise<T | void>;

export type AuthRequestHandler<T = any> = (
  req: AuthRequest,
  res: Response
) => Promise<T | void>;

export type RouteHandler = (
  req: Request<ParamsDictionary, any, any>,
  res: Response
) => Promise<void>;