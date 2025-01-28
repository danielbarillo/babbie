import { Response } from 'express';
import { User } from '../models/User';
import { AuthRequest } from '../types/express';
import { ensureAuthenticated } from '../utils/auth';
import { AppError, handleControllerError } from '../utils/errors';

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      throw new AppError(404, 'User not found');
    }
    res.json(user);
  } catch (error) {
    const { statusCode, message } = handleControllerError(error);
    res.status(statusCode).json({ message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const authenticatedUser = ensureAuthenticated(req.userState);
    const { username, email } = req.body;

    const user = await User.findById(authenticatedUser.userId);
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();
    res.json(user);
  } catch (error) {
    const { statusCode, message } = handleControllerError(error);
    res.status(statusCode).json({ message });
  }
};

export const updateStatus = async (req: AuthRequest, res: Response) => {
  try {
    const authenticatedUser = ensureAuthenticated(req.userState);
    const { status } = req.body;

    // Validate status value
    const validStatuses = ['online', 'offline', 'away'];
    if (!validStatuses.includes(status)) {
      throw new AppError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const user = await User.findById(authenticatedUser.userId);
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    user.status = status;
    user.lastSeen = new Date();
    await user.save();

    // Broadcast status change to other users
    req.app.get('io').emit('user_status', {
      userId: user._id.toString(),
      status,
      lastSeen: user.lastSeen
    });

    res.json({ status, lastSeen: user.lastSeen });
  } catch (error) {
    const { statusCode, message } = handleControllerError(error);
    res.status(statusCode).json({ message });
  }
};

export const updatePreferences = async (req: AuthRequest, res: Response) => {
  try {
    const authenticatedUser = ensureAuthenticated(req.userState);
    const { preferences } = req.body;

    const user = await User.findById(authenticatedUser.userId);
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    user.preferences = {
      ...user.preferences,
      ...preferences
    };

    await user.save();
    res.json(user.preferences);
  } catch (error) {
    const { statusCode, message } = handleControllerError(error);
    res.status(statusCode).json({ message });
  }
};