import express from 'express';
import { auth } from '../middleware/auth';
import {
  getDirectMessages,
  sendDirectMessage,
  getConversations,
  markAsRead,
} from '../controllers/directMessageController';

const router = express.Router();

router.get('/conversations', auth, getConversations);
router.get('/conversations/:recipientId', auth, getConversations);
router.get('/:userId', auth, getDirectMessages);
router.post('/:userId', auth, sendDirectMessage);
/* router.post('/dm/:userId', auth, sendDirectMessage); */
router.put('/:messageId/read', auth, markAsRead);

export default router;