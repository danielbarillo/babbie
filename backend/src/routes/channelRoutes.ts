import { Router } from 'express';
import { requireAuth, attachUserState, AuthRequest, isAuthenticated } from '../middleware/auth';
import { Channel } from '../models/Channel';
import { validate } from '../middleware/validate';
import { schemas } from '../validation/schemas';
import mongoose from 'mongoose';
import { channelController } from '../controllers/channelController';

const router = Router();

// Get all channels (public and private if authenticated)
router.get('/', attachUserState, async (req: AuthRequest, res) => {
  try {
    // If user is authenticated, include private channels they're a member of
    const channels = await Channel.find(
      req.userState && isAuthenticated(req.userState)
        ? {
            $or: [
              { isPrivate: false },
              { isPrivate: true, members: new mongoose.Types.ObjectId(req.userState._id) }
            ]
          }
        : { isPrivate: false }
    ).select('name description isPrivate');

    res.json(channels);
  } catch (error) {
    console.error('Error fetching channels:', error);
    res.status(500).json({ message: 'Error fetching channels' });
  }
});

// Get channel by ID (public for open channels, auth for private)
router.get('/:id', attachUserState, async (req: AuthRequest, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    if (channel.isPrivate) {
      if (!req.userState || !isAuthenticated(req.userState)) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      const userId = new mongoose.Types.ObjectId(req.userState._id);
      if (!channel.members.some(id => id.equals(userId))) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    res.json(channel);
  } catch (error) {
    console.error('Error fetching channel:', error);
    res.status(500).json({ message: 'Error fetching channel' });
  }
});

// Create new channel (auth required)
router.post('/', requireAuth, validate(schemas.channel.create), async (req: AuthRequest, res) => {
  try {
    if (!req.userState || !isAuthenticated(req.userState)) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { name, description, isPrivate } = req.body;
    const channel = new Channel({
      name,
      description,
      isPrivate,
      members: [new mongoose.Types.ObjectId(req.userState._id)],
      createdBy: new mongoose.Types.ObjectId(req.userState._id)
    });

    await channel.save();
    res.status(201).json(channel);
  } catch (error) {
    console.error('Error creating channel:', error);
    if (error instanceof Error && 'code' in error && error.code === 11000) {
      return res.status(400).json({ message: 'Channel name already exists' });
    }
    res.status(500).json({ message: 'Error creating channel' });
  }
});

// Join channel (auth required for private channels)
router.post('/:id/join', attachUserState, async (req: AuthRequest, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    // For private channels, require authentication
    if (channel.isPrivate) {
      if (!req.userState || !isAuthenticated(req.userState)) {
        return res.status(401).json({ message: 'Authentication required for private channels' });
      }

      const userId = new mongoose.Types.ObjectId(req.userState._id);
      if (channel.members.some(id => id.equals(userId))) {
        return res.status(400).json({ message: 'Already a member' });
      }

      channel.members.push(userId);
      await channel.save();
    }

    res.json(channel);
  } catch (error) {
    console.error('Error joining channel:', error);
    res.status(500).json({ message: 'Error joining channel' });
  }
});

// Leave channel (auth required)
router.post('/:id/leave', requireAuth, async (req: AuthRequest, res) => {
  try {
    if (!req.userState || !isAuthenticated(req.userState)) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const channel = await Channel.findById(req.params.id);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    const userId = new mongoose.Types.ObjectId(req.userState._id);
    if (!channel.members.some(id => id.equals(userId))) {
      return res.status(400).json({ message: 'Not a member' });
    }

    channel.members = channel.members.filter(id => !id.equals(userId));
    await channel.save();

    res.json(channel);
  } catch (error) {
    console.error('Error leaving channel:', error);
    res.status(500).json({ message: 'Error leaving channel' });
  }
});

// Get channel users
router.get('/:channelId/users', channelController.getChannelUsers);

export default router;