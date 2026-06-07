import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, verify, me, checkVerificationStatus, logout, forgotPassword, resetPassword } from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { registerSchema, loginSchema, checkStatusSchema, forgotPasswordSchema, resetPasswordSchema } from '../validators/auth.validator.js';

const router = Router();

// Rate limiter for login & register: 20 requests per 20 minutes per IP
const authRateLimiter = rateLimit({
  windowMs: 20 * 60 * 1000, // 20 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many attempts. You have exhausted the limit of 20 requests per 20 minutes. Please try again later.',
    retryAfter: '20 minutes',
  },
});

// Rate limiter for forgot-password: 5 requests per hour per IP (prevent abuse)
const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many password reset attempts. Please try again after an hour.',
  },
});

router.post('/register', authRateLimiter, validateRequest(registerSchema), register);
router.post('/login', authRateLimiter, validateRequest(loginSchema), login);
router.post('/logout', logout);
router.get('/verify', verify);
router.get('/check-status', validateRequest(checkStatusSchema), checkVerificationStatus);
router.get('/me', requireAuth, me);
router.post('/forgot-password', forgotPasswordLimiter, validateRequest(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validateRequest(resetPasswordSchema), resetPassword);

export default router;
