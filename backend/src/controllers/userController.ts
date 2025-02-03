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
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const users = await User.find({
      _id: { $ne: req.user._id }
    })
      .select('username isOnline avatarColor')
      .sort({ username: 1 });

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      message: 'Failed to fetch users',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}, 'username avatarColor isOnline');
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const getOrCreateConversation = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { recipientId } = req.params;

    // Logic to find or create a conversation
  } catch (error) {
    console.error('Error in getOrCreateConversation:', error);
    res.status(500).json({ message: 'Error handling conversation' });
  }
};
