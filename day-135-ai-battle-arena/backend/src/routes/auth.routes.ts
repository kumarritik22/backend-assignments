import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, verify, me, checkVerificationStatus, logout } from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { registerSchema, loginSchema, checkStatusSchema } from '../validators/auth.validator.js';

const router = Router();

// Rate limiter for login & register: 10 requests per 20 minutes per IP
const authRateLimiter = rateLimit({
  windowMs: 20 * 60 * 1000, // 20 minutes
  max: 20,
  standardHeaders: true,  // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,    // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: 'Too many attempts. You have exhausted the limit of 10 requests per 20 minutes. Please try again later.',
    retryAfter: '20 minutes',
  },
});

router.post('/register', authRateLimiter, validateRequest(registerSchema), register);
router.post('/login', authRateLimiter, validateRequest(loginSchema), login);
router.post('/logout', logout);
router.get('/verify', verify);
router.get('/check-status', validateRequest(checkStatusSchema), checkVerificationStatus);
router.get('/me', requireAuth, me);

export default router;
