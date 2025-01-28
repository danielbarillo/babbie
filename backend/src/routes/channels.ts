import express from 'express';
import {
  getChannels,
  createChannel,
  joinChannel,
  leaveChannel,
  getChannel
} from '../controllers/channels';
import { getChannelMessages, createMessage } from '../controllers/messages';
import { auth, requireAuth } from '../middleware/auth';

const router = express.Router();

// Apply auth middleware to all channel routes
router.use(auth);

// Channel routes
router.get('/', getChannels);
router.post('/', requireAuth, createChannel);
router.post('/:id/join', joinChannel);
router.post('/:id/leave', requireAuth, leaveChannel);
router.get('/:channelId', getChannel);

// Messages routes
router.get('/:channelId/messages', getChannelMessages);
router.post('/:channelId/messages', createMessage);

export default router;