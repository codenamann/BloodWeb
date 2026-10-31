import express from 'express';
import asyncHandler from '../../middleware/asyncHandler.js';
import authenticate from '../../middleware/authenticate.js';
import { searchHospitals } from '../controllers/hospital.controller.js';
import rateLimiter from '../../middleware/rateLimiter.js';

const router = express.Router();

router.get('/search', authenticate, rateLimiter({ windowMs: 15 * 60 * 1000, max: 20 }), asyncHandler(searchHospitals));

export default router;