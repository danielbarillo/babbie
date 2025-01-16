import express from 'express';
import authRoutes from './authRoutes';
import channelRoutes from './channelRoutes';
import messageRoutes from './messageRoutes';
import directMessageRoutes from './directMessageRoutes';
import { getUsers } from '../controllers/userController';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

// Health check
router.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});

// Auth routes
router.use('/auth', authRoutes);

// Channel routes
router.use('/channels', channelRoutes);

// Message routes
router.use('/messages', messageRoutes);

// Direct message routes
router.use('/dm', directMessageRoutes);

// User routes
router.get('/users', requireAuth, getUsers);

export default router;