import express from 'express';
import { login, register, getMe, logout } from '../controllers/auth';
import { auth } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/register', register);

// Protected routes
router.get('/me', auth, getMe);
router.post('/logout', auth, logout);

export default router;