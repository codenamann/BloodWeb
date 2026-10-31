import AppError from "./appError.js";
import { uploadHospitalDocument } from "./upload.middleware.js";

// Handle multer errors
export default (req, res, next) => {
    uploadHospitalDocument.single('hospitalDocument')(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return next(new AppError('File size cannot exceed 5MB', 400));
            }
            return next(new AppError(err.message || 'File upload failed', 400));
        }
        next();
    });
};
