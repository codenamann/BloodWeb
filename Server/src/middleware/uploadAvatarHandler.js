import AppError from "./appError.js";
import { uploadAvatar } from "./upload.middleware.js";

// Handle multer avatar upload errors
export default (req, res, next) => {
    uploadAvatar.single('avatar')(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return next(new AppError('Profile image cannot exceed 5MB', 400));
            }
            return next(new AppError(err.message || 'Avatar upload failed', 400));
        }
        next();
    });
};
