import express from 'express';
import {
  getDirectMessages,
  sendDirectMessage,
  getConversations
} from '../controllers/directMessages';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/', auth, getConversations);
router.get('/:userId', auth, getDirectMessages);
router.post('/', auth, sendDirectMessage);

export default router;