import { Request, Response } from 'express';
import { User } from '../models/User';
import type { RouteHandler } from '../types/express';
import type { AuthRequest } from '../middleware/auth';

export const getOnlineUsers: RouteHandler = async (req, res) => {
  try {
    const users = await User.find({ isOnline: true })
      .select('username avatarColor');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching online users' });
  }
};

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const currentUserId = req.user?._id;

    const users = await User.find({
      _id: { $ne: currentUserId }
    })
      .select('username isOnline')
      .sort({ username: 1 });

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};
