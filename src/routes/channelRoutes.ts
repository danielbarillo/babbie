import { Router } from 'express';
import { protect, guestOrAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { schemas } from '../validation/schemas';
import {
  getChannels,
  createChannel,
  joinChannel,
  leaveChannel,
} from '../controllers/channelController';
import { wrapAuthHandler } from '../utils/wrapHandler';

const router = Router();

router.get('/', guestOrAuth, wrapAuthHandler(getChannels));
router.post('/', protect, validate(schemas.channel.create), wrapAuthHandler(createChannel));
router.post('/:channelId/join', protect, wrapAuthHandler(joinChannel));
router.post('/:channelId/leave', protect, wrapAuthHandler(leaveChannel));

export default router;