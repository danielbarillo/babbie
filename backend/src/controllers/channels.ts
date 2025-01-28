import { Response } from 'express';
import { Channel } from '../models/Channel';
import { AuthRequest } from '../types/express';
import { ensureAuthenticated } from '../utils/auth';
import { handleControllerError } from '../utils/errors';
import { AppError } from '../utils/errors';

export const getChannels = async (req: AuthRequest, res: Response) => {
  try {
    // For non-authenticated users, only show public non-restricted channels
    // For authenticated users, show all non-private channels
    const query = req.userState?.type === 'authenticated'
      ? { isPrivate: false }
      : { isPrivate: false, isRestricted: false };

    const channels = await Channel.find(query)
      .populate('createdBy', 'username')
      .select('-members');
    res.json(channels);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching channels' });
  }
};

export const createChannel = async (req: AuthRequest, res: Response) => {
  try {
    const authenticatedUser = ensureAuthenticated(req.userState);
    const { name, isPrivate, description } = req.body;

    const channel = new Channel({
      name,
      isPrivate,
      description,
      createdBy: authenticatedUser.userId,
      members: [authenticatedUser.userId]
    });

    await channel.save();
    res.status(201).json(channel);
  } catch (error) {
    const { statusCode, message } = handleControllerError(error);
    res.status(statusCode).json({ message });
  }
};

export const joinChannel = async (req: AuthRequest, res: Response) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    if (channel.isPrivate && (!req.userState || req.userState.type !== 'authenticated')) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(channel);
  } catch (error) {
    res.status(500).json({ message: 'Error joining channel' });
  }
};

export const leaveChannel = async (req: AuthRequest, res: Response) => {
  try {
    const authenticatedUser = ensureAuthenticated(req.userState);
    const channel = await Channel.findById(req.params.channelId);

    if (!channel) {
      throw new AppError(404, 'Channel not found');
    }

    channel.members = channel.members.filter(
      memberId => memberId.toString() !== authenticatedUser.userId
    );
    await channel.save();

    res.json({ message: 'Left channel successfully' });
  } catch (error) {
    const { statusCode, message } = handleControllerError(error);
    res.status(statusCode).json({ message });
  }
};

export const getChannel = async (req: AuthRequest, res: Response) => {
  try {
    const channelId = req.params.channelId;
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }
    res.json(channel);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching channel' });
  }
};