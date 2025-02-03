import { Response } from 'express';
import { Message } from '../models/Message';
import { AuthRequest } from '../types/express';
import { ensureAuthenticated } from '../utils/auth';

export const getChannelMessages = async (req: AuthRequest, res: Response) => {
  try {
      const messages = await Message.find({ channel: req.params.channelId })
          .sort({ createdAt: -1 })
          .limit(50);
      res.json(messages.reverse());
  } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ message: 'Error fetching messages' });
  }
};

export const createMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { content, guestName } = req.body;
    const { channelId } = req.params;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    if (!channelId) {
      return res.status(400).json({ message: 'Channel ID is required' });
    }

    const message = new Message({
      content,
      channel: channelId,
      sender: req.userState?.type === 'authenticated'
        ? {
            userId: req.userState.userId,
            username: req.userState.username,
            type: 'authenticated'
          }
        : {
            username: guestName || 'Guest',
            type: 'guest'
          }
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ message: 'Error creating message' });
  }
};