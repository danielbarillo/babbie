import { Router } from 'express';
import { login, register, me } from '../controllers/authController';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { schemas } from '../validation/schemas';
import { wrapHandler, wrapAuthHandler } from '../utils/wrapHandler';
import type { RequestHandler, AuthRequestHandler } from '../types/express';

const router = Router();

router.post('/register', validate(schemas.auth.register), wrapHandler(register as RequestHandler));
router.post('/login', validate(schemas.auth.login), wrapHandler(login as RequestHandler));
router.get('/me', protect, wrapAuthHandler(me as AuthRequestHandler));

export default router;