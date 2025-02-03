import { Response } from 'express';
import { Message } from '../models/Message';
import type { AuthRequest } from '../types/express';
import { Channel } from '../models/Channel';
import { Types } from 'mongoose';

export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { channelId } = req.params;

    // Kontrollera att kanalen finns
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    // Kontrollera behörighet för privata kanaler
    if (channel.isPrivate) {
      if (req.userState?.type !== 'authenticated') {
        return res.status(403).json({ message: 'Authentication required for private channels' });
      }

      const userId = new Types.ObjectId(req.userState._id);
      const isChannelMember = channel.members.some(id => id.equals(userId));

      if (!isChannelMember) {
        return res.status(403).json({ message: 'You are not a member of this channel' });
      }
    }

    const messages = await Message.find({ channel: channelId })
      .sort({ createdAt: 1 })
      .limit(100);

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { channelId } = req.params;
    const { content, guestName } = req.body;

    // Basic validation
    if (!content?.trim()) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    // Check channel exists and get its properties
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    // Check permissions
    if ((channel.isPrivate || channel.isRestricted) && req.userState?.type !== 'authenticated') {
      return res.status(403).json({
        message: 'Only registered users can send messages in this channel'
      });
    }

    // Create and save message
    const message = new Message({
      content: content.trim(),
      channel: channelId,
      sender: req.userState?.type === 'authenticated'
        ? {
            _id: req.userState._id,
            username: req.userState.username,
            type: 'authenticated'
          }
        : {
            username: guestName || 'Guest',
            type: 'guest'
          }
    });

    await message.save();
    return res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { messageId } = req.params;
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await message.deleteOne();
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Error deleting message' });
  }
};

export const createMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { channelId } = req.params;
    const { content } = req.body;
    const userId = req.user?.id; // Assuming you have user info in request

    // Validate input
    if (!content || typeof content !== 'string') {
      return res.status(400).json({ message: 'Invalid message content' });
    }

    if (!channelId) {
      return res.status(400).json({ message: 'Channel ID is required' });
    }

    // Create message in database
    const message = new Message({
      content,
      channel: channelId,
      sender: {
        _id: userId,
        username: req.user?.username,
        type: 'authenticated'
      }
    });

    await message.save();
    return res.status(201).json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};