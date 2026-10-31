import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import AppError from './appError.js';
import logger from '../utils/logger.js';

// Use memory storage since we upload directly to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new AppError('Invalid file type. Only PDF, JPG, and PNG are allowed.', 400), false);
    }
};

export const uploadHospitalDocument = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});
