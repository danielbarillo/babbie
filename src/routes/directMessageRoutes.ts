import { Router } from 'express';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { schemas } from '../validation/schemas';
import {
  getDirectMessages,
  sendDirectMessage,
  getConversations,
  markAsRead
} from '../controllers/directMessageController';
import { wrapAuthHandler } from '../utils/wrapHandler';

const router = Router();

// Get all conversations for the current user
router.get('/conversations', protect, wrapAuthHandler(getConversations));

// Get messages between current user and another user
router.get('/:userId', protect, wrapAuthHandler(getDirectMessages));

// Send a message to another user
router.post('/:userId', protect, validate(schemas.message.create), wrapAuthHandler(sendDirectMessage));

// Mark a message as read
router.patch('/:messageId/read', protect, wrapAuthHandler(markAsRead));

export default router;