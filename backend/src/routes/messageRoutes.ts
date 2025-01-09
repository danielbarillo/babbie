import { Router } from 'express';
import { requireAuth, attachUserState, AuthRequest, isAuthenticated } from '../middleware/auth';
import { Message } from '../models/Message';
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

    // Hämta alla meddelanden för kanalen
    const messages = await Message.find({
      channel: req.params.channelId
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'username')
      .exec();

    // Enklare formatering av meddelanden
    const formattedMessages = messages.map(msg => {
      // Om det är ett gästmeddelande
      if (msg.sender && typeof msg.sender === 'object' && 'type' in msg.sender) {
        return msg;
      }
      // Om det är ett användarmeddelande
      return {
        ...msg.toObject(),
        sender: {
          _id: msg.sender?._id,
          username: (msg.sender as any)?.username || 'Unknown User'
        }
      };
    });

    console.log('Messages:', formattedMessages);
    res.json(formattedMessages);
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

// Send a message to a channel
router.post('/channel/:channelId', attachUserState, async (req: AuthRequest, res) => {
  try {
    const { channelId } = req.params;
    const { content, guestName } = req.body;
    console.log('Processing message:', { channelId, content, guestName });

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    // Allow guest messages in public channels
    if (channel.isPrivate) {
      if (!req.userState || !isAuthenticated(req.userState)) {
        return res.status(401).json({ message: 'Authentication required for private channels' });
      }
    }

    let message;
    if (req.userState && isAuthenticated(req.userState)) {
      // För inloggade användare
      message = new Message({
        content: content.trim(),
        channel: channelId,
        sender: {
          _id: req.userState._id,
          username: req.userState.username,
          type: 'user'
        }
      });
    } else {
      // För gäster
      message = new Message({
        content: content.trim(),
        channel: channelId,
        sender: {
          type: 'guest',
          username: guestName || 'Guest'
        }
      });
    }

    await message.save();
    console.log('Message saved:', message);
    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
});

export default router;