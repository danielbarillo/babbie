import { Response } from 'express';
import { Message } from '../models/Message';
import type { AuthRequest } from '../types/express';
import { Channel } from '../models/Channel';

export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { channelId } = req.params;
    const messages = await Message.find({ channel: channelId })
      .populate('sender', 'username')
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
    console.log('Received message request:', { channelId, content, guestName }); // Debug

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    // Kontrollera att kanalen finns
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    // Skapa meddelandet
    const message = new Message({
      content: content.trim(),
      channel: channelId,
      sender: req.user ? {
        _id: req.user._id,
        username: req.user.username,
        type: 'authenticated'
      } : {
        type: 'guest',
        username: guestName || 'Guest'
      }
    });

    await message.save();
    console.log('Message saved:', message); // Debug

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
};

export const deleteMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { messageId } = req.params;
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.sender.toString() !== req.user._id) {
      return res.status(403).json({ message: 'Not authorized to delete this message' });
    }

    await message.deleteOne();
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Error deleting message' });
  }
};