import { v2 as cloudinary } from 'cloudinary';
import env from '../config/env.js';
import AppError from '../middleware/appError.js';
import logger from '../utils/logger.js';
import fs from 'fs';

// Configure Cloudinary
if (env.storage.provider === 'cloudinary') {
    if (!env.storage.cloudinary.cloudName || !env.storage.cloudinary.apiKey || !env.storage.cloudinary.apiSecret) {
        throw new AppError('Cloudinary is set as the active storage provider, but credentials are missing in environment variables.', 500);
    }
    cloudinary.config({
        cloud_name: env.storage.cloudinary.cloudName,
        api_key: env.storage.cloudinary.apiKey,
        api_secret: env.storage.cloudinary.apiSecret,
    });
    logger.info('Cloudinary configured successfully.');
}

const UPLOAD_FOLDER = 'bloodweb/hospital-documents';

/**
 * Upload a file buffer to Cloudinary.
 * @param {Object} file - The file object from multer (must have buffer, mimetype, size)
 * @returns {Promise<Object>} Normalized metadata
 */
export async function uploadToCloudinary(file) {
    if (!file || !file.buffer) {
        throw new AppError('Invalid file provided for Cloudinary upload (missing buffer).', 400);
    }

    try {
        const isPdf = file.mimetype === 'application/pdf';

        const options = {
            folder: UPLOAD_FOLDER,
            resource_type: 'auto',
            use_filename: false,
            unique_filename: true,
        };

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
            // Write the buffer to the stream and end it
            stream.end(file.buffer);
        });

        logger.info(`[CLOUDINARY] Uploaded successfully: ${result.public_id}`);

        return {
            url: result.secure_url,
            storageKey: result.public_id,
            originalName: file.originalname,
            mimeType: file.mimetype,
            documentType: isPdf ? 'PDF' : 'IMAGE',
            size: file.size
        };
    } catch (err) {
        console.log(err);
        logger.error(`[CLOUDINARY ERROR] Upload failed: ${err.message}`, { error: err });
        throw new AppError('Cloudinary upload failed', 502); // Bad Gateway
    }
}

/**
 * Delete a document from Cloudinary using its public_id.
 * @param {string} publicId - The public ID of the resource
 */
export async function deleteFromCloudinary(publicId) {
    if (!publicId) return;

    try {
        const result = await cloudinary.uploader.destroy(publicId, { invalidate: true });
        logger.info(`[CLOUDINARY] Deleted successfully: ${publicId}`);
        return result;
    } catch (err) {
        logger.error(`[CLOUDINARY ERROR] Delete failed for ${publicId}: ${err.message}`, { error: err });
        throw new AppError('Cloudinary deletion failed', 502);
    }
}
