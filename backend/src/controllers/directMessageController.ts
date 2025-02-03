import { Response } from 'express';
import { DirectMessage } from '../models/DirectMessage';
import { User } from '../models/User';
import type { AuthRequest } from '../types/express';
import mongoose from 'mongoose';
import { handleControllerError } from '../utils/errors';

export const getDirectMessages = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { userId } = req.params;
    const currentUserId = req.user._id;

    const messages = await DirectMessage.find({
      $or: [
        { sender: currentUserId, recipient: userId },
        { sender: userId, recipient: currentUserId }
      ]
    })
      .populate('sender', 'username avatarColor')
      .populate('recipient', 'username avatarColor')
      .sort({ createdAt: -1 })
      .limit(100);

    // Mark messages as read
    await DirectMessage.updateMany(
      {
        recipient: currentUserId,
        sender: userId,
        read: false
      },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    const { statusCode, message } = handleControllerError(error);
    res.status(statusCode).json({ message });
  }
};

export const sendDirectMessage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { userId } = req.params;
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    const message = new DirectMessage({
      content: content.trim(),
      sender: req.user._id,
      recipient: userId,
      read: false
    });

    await message.save();
    await message.populate([
      { path: 'sender', select: 'username avatarColor' },
      { path: 'recipient', select: 'username avatarColor' }
    ]);

    // Remove socket emission
    res.status(201).json(message);
  } catch (error) {
    const { statusCode, message } = handleControllerError(error);
    res.status(statusCode).json({ message });
  }
};

export const getConversations = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const userId = req.user._id;

    const conversations = await DirectMessage.aggregate([
      {
        $match: {
          $or: [
            { sender: new mongoose.Types.ObjectId(userId) },
            { recipient: new mongoose.Types.ObjectId(userId) }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ['$sender', new mongoose.Types.ObjectId(userId)] },
              then: '$recipient',
              else: '$sender'
            }
          },
          lastMessage: { $first: '$$ROOT' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 1,
          user: {
            _id: 1,
            username: 1,
            avatarColor: 1,
            isOnline: 1
          },
          lastMessage: 1
        }
      }
    ]);

    res.json(conversations);
  } catch (error) {
    const { statusCode, message } = handleControllerError(error);
    res.status(statusCode).json({ message });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await DirectMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Only recipient can mark message as read
    if (message.recipient.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    message.read = true;
    await message.save();

    res.json(message);
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ message: 'Error marking message as read' });
  }
};