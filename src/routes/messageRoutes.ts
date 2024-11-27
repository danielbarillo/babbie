import { Router } from 'express';
import { requireAuth, attachUserState, AuthRequest, isAuthenticated } from '../middleware/auth';
import { Message, IMessage } from '../models/Message';
import { Channel } from '../models/Channel';
import { validate } from '../middleware/validate';
import { schemas } from '../validation/schemas';
import mongoose from 'mongoose';

const router = Router();

// Get messages for a channel
router.get('/channel/:channelId', attachUserState, async (req: AuthRequest, res) => {
  try {
    const channel = await Channel.findById(req.params.channelId);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    // Check if channel is private and user is authenticated and a member
    if (channel.isPrivate) {
      if (!req.userState || !isAuthenticated(req.userState)) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      const userId = new mongoose.Types.ObjectId(req.userState._id);
      if (!channel.members.some(id => id.equals(userId))) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    const messages = await Message.find({ channel: req.params.channelId })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('sender', 'username')
      .exec();

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

// Send a message to a channel
router.post('/channel/:channelId', attachUserState, validate(schemas.message.create), async (req: AuthRequest, res) => {
  try {
    if (!req.userState) {
      return res.status(401).json({ message: 'User state is required' });
    }

    const channel = await Channel.findById(req.params.channelId);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    // For private channels, require authentication
    if (channel.isPrivate) {
      if (!isAuthenticated(req.userState)) {
        return res.status(401).json({ message: 'Authentication required for private channels' });
      }
      const userId = new mongoose.Types.ObjectId(req.userState._id);
      if (!channel.members.some(id => id.equals(userId))) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    // Create message with appropriate sender info
    const messageData = {
      content: req.body.content,
      channel: new mongoose.Types.ObjectId(req.params.channelId),
      sender: isAuthenticated(req.userState)
        ? new mongoose.Types.ObjectId(req.userState._id)
        : { username: 'Guest', type: 'guest' as const }
    };

    const message = new Message(messageData);
    await message.save();

    // Only populate sender if it's a reference to a User
    if (isAuthenticated(req.userState)) {
      await message.populate('sender', 'username');
    }

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
});

export default router;