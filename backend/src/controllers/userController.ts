import { Request, Response } from 'express';
import { User } from '../models/User';
import type { RouteHandler } from '../types/express';

export const getOnlineUsers: RouteHandler = async (req, res) => {
  try {
    const users = await User.find({ isOnline: true })
      .select('username avatarColor');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching online users' });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find()
      .select('username email')
      .sort({ username: 1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};
