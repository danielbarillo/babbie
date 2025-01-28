import { Response } from 'express';
import { DirectMessage } from '../models/DirectMessage';
import { User } from '../models/User';
import { AuthRequest } from '../types/express';
import { ensureAuthenticated } from '../utils/auth';
import { handleControllerError } from '../utils/errors';
import mongoose from 'mongoose';

export const getConversations = async (req: AuthRequest, res: Response) => {
  try {
    const authenticatedUser = ensureAuthenticated(req.userState);
    const userId = new mongoose.Types.ObjectId(authenticatedUser.userId);

    const conversations = await DirectMessage.aggregate([
      {
        $match: {
          $or: [
            { sender: userId },
            { recipient: userId }
          ]
        }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', userId] },
              '$recipient',
              '$sender'
            ]
          },
          lastMessage: { $last: '$$ROOT' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      }
    ]);

    res.json(conversations);
  } catch (error) {
    const { statusCode, message } = handleControllerError(error);
    res.status(statusCode).json({ message });
  }
};

export const getDirectMessages = async (req: AuthRequest, res: Response) => {
  try {
    const authenticatedUser = ensureAuthenticated(req.userState);
    const userId = new mongoose.Types.ObjectId(authenticatedUser.userId);
    const otherUserId = new mongoose.Types.ObjectId(req.params.userId);

    const messages = await DirectMessage.find({
      $or: [
        { sender: userId, recipient: otherUserId },
        { sender: otherUserId, recipient: userId }
      ]
    }).sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    const { statusCode, message } = handleControllerError(error);
    res.status(statusCode).json({ message });
  }
};

export const sendDirectMessage = async (req: AuthRequest, res: Response) => {
  try {
    const authenticatedUser = ensureAuthenticated(req.userState);
    const { content, recipientId } = req.body;

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    const message = new DirectMessage({
      content,
      sender: new mongoose.Types.ObjectId(authenticatedUser.userId),
      recipient: new mongoose.Types.ObjectId(recipientId)
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    const { statusCode, message } = handleControllerError(error);
    res.status(statusCode).json({ message });
  }
};