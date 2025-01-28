import express from 'express';
import { auth } from '../middleware/auth';
import {
  updateStatus,
  updatePreferences,
  updateProfile,
  getUserProfile
} from '../controllers/users';
import { statusLimiter } from '../middleware/rateLimiter';

const router = express.Router();

router.get('/profile/:userId', auth, getUserProfile);
router.patch('/profile', auth, updateProfile);
router.post('/status', auth, statusLimiter, updateStatus);
router.patch('/preferences', auth, updatePreferences);

export default router;