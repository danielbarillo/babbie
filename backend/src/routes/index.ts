import { Router } from 'express';
import authRoutes from './authRoutes';
import channelRoutes from './channelRoutes';
import messageRoutes from './messageRoutes';
import directMessageRoutes from './directMessageRoutes';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Auth routes (/api/auth/*)
router.use('/auth', authRoutes);

// Channel routes (/api/channels/*)
router.use('/channels', channelRoutes);

// Message routes (/api/messages/*)
router.use('/messages', messageRoutes);

// Direct message routes (/api/dm/*)
router.use('/dm', directMessageRoutes);

export default router;