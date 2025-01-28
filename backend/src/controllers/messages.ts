import { Response } from 'express';
import { Message } from '../models/Message';
import { AuthRequest } from '../types/express';
import { ensureAuthenticated } from '../utils/auth';

export const getChannelMessages = async (req: AuthRequest, res: Response) => {
  try {
      const messages = await Message.find({ channel: req.params.channelId }) // Adjusted field name
          .sort({ createdAt: -1 })
          .limit(50);
      console.log(messages); // Log messages to check
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

    console.log('Incoming content:', content); // Log incoming content for debugging
    console.log('Incoming channelId:', channelId); // Log incoming channelId for debugging

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    if (!channelId) {
      return res.status(400).json({ message: 'Channel ID is required' });
    }

    console.log("req:", req)

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
    console.error('Error creating message:', error); // Log the error for debugging
    res.status(500).json({ message: 'Error creating message' });
  }
};