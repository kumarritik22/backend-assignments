import { Router } from 'express';
import { register, login, verify, me, checkVerificationStatus, logout } from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/verify', verify);
router.get('/check-status', checkVerificationStatus);
router.get('/me', requireAuth, me);

export default router;
