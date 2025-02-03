import express from 'express';
import { getUsers, getOnlineUsers } from '../controllers/userController';
import { isAuthenticated } from '../middleware/auth';

const router = express.Router();

router.get('/', isAuthenticated, getUsers);
router.get('/online', isAuthenticated, getOnlineUsers);

export default router; 