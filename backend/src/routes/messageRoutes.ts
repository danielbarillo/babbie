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

    // Check if channel is private
    if (channel.isPrivate) {
      if (!req.userState || !isAuthenticated(req.userState)) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      const userId = new mongoose.Types.ObjectId(req.userState._id);
      if (!channel.members.some(id => id.equals(userId))) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    // Hämta alla meddelanden för kanalen
    const messages = await Message.find({
      channel: req.params.channelId
    })
      .sort({ createdAt: 1 }) // Sortera äldst först
      .populate({
        path: 'sender',
        select: 'username',
        model: 'User'
      })
      .lean()
      .exec();

    // Formatera meddelanden med korrekt typning
    const formattedMessages = messages.map(msg => ({
      ...msg,
      sender: typeof msg.sender === 'object' && 'type' in msg.sender
        ? msg.sender  // Gästanvändare
        : {
            _id: (msg.sender as any)?._id,
            username: (msg.sender as any)?.username || 'Unknown User'
          }
    }));

    console.log(`Fetched ${formattedMessages.length} messages for channel ${req.params.channelId}`);
    res.json(formattedMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
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
        sender: req.userState._id
      });
      await message.save();
      // Populera sender-fältet för att få med användarnamnet
      await message.populate('sender', 'username');
    } else {
      // För gäster
      message = new Message({
        content: content.trim(),
        channel: channelId,
        sender: { type: 'guest', username: guestName || 'Guest' }
      });
      await message.save();
    }

    console.log('Message saved:', message);
    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
});

export default router;