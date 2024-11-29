import express, { Request, Response, NextFunction } from 'express';
import { register, login, me } from '../controllers/authController';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

// Helper to wrap async route handlers
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Register
router.post('/register', asyncHandler(register));

// Login
router.post('/login', asyncHandler(login));

// Get current user (protected route)
router.get('/me', requireAuth, asyncHandler(me));

export default router;