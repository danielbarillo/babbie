import express from 'express';
import { auth } from '../middleware/auth';
import * as conversationController from '../controllers/conversationController';

const router = express.Router();

router.post('/', auth, conversationController.createConversation);

export default router; 