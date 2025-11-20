import { Router } from 'express';
import * as authController from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { checkApplicationPeriodForAuth } from '../middleware/applicationPeriod';
import { authLimiter, passwordResetLimiter } from '../middleware/rateLimiter';

const router = Router();

// POST /api/auth/register - Register new user
// Rate limit: 5 attempts per 15 minutes per IP
router.post('/register', authLimiter, authController.register);

// POST /api/auth/login - Login user
// Rate limit: 5 attempts per 15 minutes per IP
router.post('/login', authLimiter, authController.login);

// POST /api/auth/refresh - Refresh access token
router.post('/refresh', authController.refresh);

// POST /api/auth/logout - Logout user
router.post('/logout', authController.logout);

// POST /api/auth/verify-email - Verify email with code
router.post('/verify-email', authController.verifyEmail);

// POST /api/auth/resend-code - Resend verification code
router.post('/resend-code', authController.resendVerificationCode);

// POST /api/auth/forgot-password - Request password reset
// Rate limit: 3 attempts per 15 minutes per IP (stricter to prevent email spam)
router.post('/forgot-password', passwordResetLimiter, authController.forgotPassword);

// POST /api/auth/verify-reset-code - Verify reset code
router.post('/verify-reset-code', authController.verifyResetCode);

// POST /api/auth/reset-password - Reset password with code
router.post('/reset-password', authController.resetPassword);

// GET /api/auth/me - Get current user info
router.get('/me', authenticate, authController.getCurrentUser);

export default router;