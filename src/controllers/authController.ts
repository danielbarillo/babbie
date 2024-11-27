import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { config } from '../config/config';
import type { AuthRequest } from '../types/express';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Username or email is already registered'
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { _id: user._id, username: user.username },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatarColor: user.avatarColor
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error during registration'
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Find user by username and select password field
    const user = await User.findOne({ username }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid username or password'
      });
    }

    // Generate token
    const token = jwt.sign(
      { _id: user._id, username: user.username },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    // Update user's online status
    user.isOnline = true;
    await user.save();

    // Don't send password in response
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      avatarColor: user.avatarColor
    };

    res.json({
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error during login'
    });
  }
};

export const me = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.json({
      status: 'success',
      data: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          avatarColor: user.avatarColor
        }
      }
    });
  } catch (error) {
    console.error('Me endpoint error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching user data'
    });
  }
};