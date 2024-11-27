import { Router } from 'express';
import { protect, guestOrAuth } from '../middleware/auth';
import authRoutes from './authRoutes';
import channelRoutes from './channelRoutes';
import messageRoutes from './messageRoutes';
import directMessageRoutes from './directMessageRoutes';
import { getPublicChannels } from '../controllers/channelController';
import { getOnlineUsers } from '../controllers/userController';

const router = Router();

// Public routes
router.get('/channels/public', guestOrAuth, getPublicChannels as any);
router.get('/users/online', guestOrAuth, getOnlineUsers as any);

// Protected routes
router.use('/auth', authRoutes);
router.use('/channels', protect, channelRoutes);
router.use('/messages', protect, messageRoutes);
router.use('/dm', protect, directMessageRoutes);

export default router;