import { Router } from 'express';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { schemas } from '../validation/schemas';
import { getMessages, sendMessage, deleteMessage } from '../controllers/messageController';
import { wrapAuthHandler } from '../utils/wrapHandler';

const router = Router();

router.get('/:channelId', protect, wrapAuthHandler(getMessages));
router.post('/:channelId', protect, validate(schemas.message.create), wrapAuthHandler(sendMessage));
router.delete('/:messageId', protect, wrapAuthHandler(deleteMessage));

export default router;