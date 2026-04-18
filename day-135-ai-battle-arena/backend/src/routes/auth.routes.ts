import { Router } from 'express';
import { register, login, verify, me, checkVerificationStatus, logout } from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { registerSchema, loginSchema, checkStatusSchema } from '../validators/auth.validator.js';

const router = Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/logout', logout);
router.get('/verify', verify);
router.get('/check-status', validateRequest(checkStatusSchema), checkVerificationStatus);
router.get('/me', requireAuth, me);

export default router;
