import express from 'express';
import {
  getChannelMessages,
  createMessage
} from '../controllers/messages';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/channel/:channelId', getChannelMessages);
router.post('/channel/:channelId', createMessage);

export default router;