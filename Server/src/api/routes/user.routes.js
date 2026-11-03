import express from 'express';
import authenticate from '../../middleware/authenticate.js';
import asyncHandler from '../../middleware/asyncHandler.js';
import uploadAvatarHandler from '../../middleware/uploadAvatarHandler.js';
import {
    getUserProfile,
    updateLocation,
    updatePhone,
    updateContactInfo,
    updateBloodGroup,
    updateDob,
    toggleAvailability,
    updateDonorReadiness,
    uploadAvatar,
    removeAvatar
} from '../controllers/user.controller.js';
import requireFields from '../../middleware/requireFields.js';

const router = express.Router();

router.get('/profile', authenticate, asyncHandler(getUserProfile));
router.patch('/location', authenticate, asyncHandler(updateLocation));
router.patch('/phone', authenticate, requireFields('phone'), asyncHandler(updatePhone));
router.patch('/contact-info', authenticate, asyncHandler(updateContactInfo));
router.patch('/blood-group', authenticate, requireFields('bloodGroup'), asyncHandler(updateBloodGroup));
router.patch('/dob', authenticate, requireFields('dob'), asyncHandler(updateDob));
router.patch('/availability', authenticate, asyncHandler(toggleAvailability));
router.patch('/donor-readiness', authenticate, asyncHandler(updateDonorReadiness));
router.post('/avatar', authenticate, uploadAvatarHandler, asyncHandler(uploadAvatar));
router.delete('/avatar', authenticate, asyncHandler(removeAvatar));

export default router;