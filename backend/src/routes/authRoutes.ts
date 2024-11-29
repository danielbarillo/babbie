import express from 'express';
import { register, login, me } from '../controllers/authController';

const router = express.Router();

// Register
router.post('/register', register);

// Login
router.post('/login', login);

// Get current user
router.get('/me', me);

export default router;