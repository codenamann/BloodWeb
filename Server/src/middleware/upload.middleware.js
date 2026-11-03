import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import AppError from './appError.js';
import logger from '../utils/logger.js';

// Use memory storage since we upload directly to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new AppError('Invalid file type. Only PDF, JPG, PNG, and WebP are allowed.', 400), false);
    }
};

export const uploadHospitalDocument = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

const avatarFileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new AppError('Invalid image type. Only JPG, PNG, WEBP, and GIF are allowed for profile pictures.', 400), false);
    }
};

export const uploadAvatar = multer({
    storage,
    fileFilter: avatarFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});
