import express from 'express';
import requireFields from '../../middleware/requireFields.js';
import asyncHandler from '../../middleware/asyncHandler.js';
import { login, register, resendOtp, verifyOtp } from '../controllers/auth.controller.js';
import rateLimiter from '../../middleware/rateLimiter.js';

const router = express.Router();

router.post(
  '/register',
  requireFields('name', 'email', 'password'),
  rateLimiter({ windowMs: 60 * 60 * 1000, limit: 5 }),
  asyncHandler(register)
);

router.post(
  '/login',
  requireFields('email', 'password'),
  rateLimiter({ windowMs: 15 * 60 * 1000, limit: 100 }),
  asyncHandler(login)
);

router.post(
  '/verify-otp',
  requireFields('email', 'otp'),
  rateLimiter({ windowMs: 5 * 60 * 1000, limit: 5 }),
  asyncHandler(verifyOtp)
);

router.post(
  '/resend-otp',
  requireFields('email'),
  rateLimiter({ windowMs: 15 * 60 * 1000, limit: 3 }),
  asyncHandler(resendOtp)
);

export default router;