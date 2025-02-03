import express from 'express';
import {
  getChannels,
  createChannel,
  joinChannel,
  leaveChannel,
  getChannel,
  deleteChannel,
  getChannelUsers
} from '../controllers/channelController';
import { getChannelMessages, createMessage } from '../controllers/messages';
import { auth, requireAuth } from '../middleware/auth';

const router = express.Router();

// Apply auth middleware to all channel routes
router.use(auth);

// Channel routes
router.get('/', getChannels);
router.post('/', requireAuth, createChannel);
router.post('/:channelId/join', joinChannel);
router.post('/:channelId/leave', requireAuth, leaveChannel);
router.get('/:channelId', getChannel);
router.delete('/:channelId', requireAuth, deleteChannel);
router.get('/:channelId/users', getChannelUsers);

// Messages routes
router.get('/:channelId/messages', getChannelMessages);
router.post('/:channelId/messages', createMessage);

export default router;