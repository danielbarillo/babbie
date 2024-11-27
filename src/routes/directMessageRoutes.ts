import { Router } from 'express';
import { requireAuth, AuthRequest, isAuthenticated } from '../middleware/auth';
import { DirectMessage } from '../models/DirectMessage';
import { User } from '../models/User';
import { validate } from '../middleware/validate';
import { schemas } from '../validation/schemas';
import mongoose from 'mongoose';

const router = Router();

// Get all DM conversations for the authenticated user
router.get('/conversations', requireAuth, async (req: AuthRequest, res) => {
  try {
    if (!req.userState || !isAuthenticated(req.userState)) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const userId = new mongoose.Types.ObjectId(req.userState._id);

    // Find all unique conversations
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
        $sort: { createdAt: -1 }
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
      {
        $unwind: '$user'
      },
      {
        $project: {
          _id: 1,
          username: '$user.username',
          lastMessage: 1
        }
      }
    ]);

    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Error fetching conversations' });
  }
});

// Get messages between two users
router.get('/:userId', requireAuth, async (req: AuthRequest, res) => {
  try {
    if (!req.userState || !isAuthenticated(req.userState)) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const currentUserId = new mongoose.Types.ObjectId(req.userState._id);
    const otherUserId = new mongoose.Types.ObjectId(req.params.userId);

    // Verify other user exists
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get messages between the two users
    const messages = await DirectMessage.find({
      $or: [
        { sender: currentUserId, recipient: otherUserId },
        { sender: otherUserId, recipient: currentUserId }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('sender', 'username')
      .populate('recipient', 'username');

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

// Send a direct message
router.post('/', requireAuth, validate(schemas.directMessage.create), async (req: AuthRequest, res) => {
  try {
    if (!req.userState || !isAuthenticated(req.userState)) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { content, recipientId } = req.body;

    // Verify recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    // Create and save the message
    const message = new DirectMessage({
      content,
      sender: new mongoose.Types.ObjectId(req.userState._id),
      recipient: new mongoose.Types.ObjectId(recipientId)
    });

    await message.save();
    await message.populate('sender', 'username');
    await message.populate('recipient', 'username');

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
});

export default router;