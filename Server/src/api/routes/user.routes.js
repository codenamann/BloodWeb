import express from 'express';
import authenticate from '../../middleware/authenticate.js';
import asyncHandler from '../../middleware/asyncHandler.js';
import { getUserProfile, updateLocation, updatePhone, updateBloodGroup, updateDob, toggleAvailability } from '../controllers/user.controller.js';
import requireFields from '../../middleware/requireFields.js';

const router = express.Router();

router.get('/profile', authenticate, asyncHandler(getUserProfile));
router.patch('/location', authenticate, asyncHandler(updateLocation));
router.patch('/phone', authenticate, requireFields('phone'), asyncHandler(updatePhone));
router.patch('/blood-group', authenticate, requireFields('bloodGroup'), asyncHandler(updateBloodGroup));
router.patch('/dob', authenticate, requireFields('dob'), asyncHandler(updateDob));
router.patch('/availability', authenticate, asyncHandler(toggleAvailability));

export default router;