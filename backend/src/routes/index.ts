import express from 'express';
import authRoutes from './authRoutes';
import channelRoutes from './channelRoutes';
import messageRoutes from './messageRoutes';
import dmRoutes from './dmRoutes';

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
router.use('/dm', dmRoutes);

export default router;