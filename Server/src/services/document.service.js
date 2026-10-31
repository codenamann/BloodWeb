import AppError from '../middleware/appError.js';
import fs from 'fs';
import path from 'path';
import env from '../config/env.js';
import logger from '../utils/logger.js';
import { uploadToCloudinary, deleteFromCloudinary } from './cloudinary.service.js';

/**
 * Normalizes the local filesystem upload to match the common schema.
 */
function processLocalDocument(file) {
    const documentType = file.mimetype === 'application/pdf' ? 'PDF' : 'IMAGE';
    return {
        url: `/uploads/${file.filename}`,
        storageKey: file.filename, // Local storage uses filename as identifier
        originalName: file.originalname,
        mimeType: file.mimetype,
        documentType,
        size: file.size,
    };
}

/**
 * Deletes a file from the local filesystem.
 */
function deleteLocalDocument(storageKey) {
    try {
        const filePath = path.join(process.cwd(), 'public', 'uploads', storageKey);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            logger.info(`[LOCAL STORAGE] Deleted successfully: ${storageKey}`);
        }
    } catch (err) {
        logger.error(`[LOCAL STORAGE ERROR] Failed to delete document ${storageKey}: ${err.message}`, { error: err });
    }
}

/**
 * Main entry point for document uploads. Routes to the active provider.
 */
export async function processUploadedDocument(file) {
    if (!file) {
        throw new AppError('No document uploaded', 400);
    }

    // Cloudinary is now the primary and only active service.
    // The file is uploaded directly from the memory buffer.
    const result = await uploadToCloudinary(file);
    
    return result;

    /* 
    --- Disconnected local fallback for future use ---
    if (env.storage.provider === 'local') {
        return processLocalDocument(file);
    }
    */
}

/**
 * Main entry point for document deletion. Routes to the active provider.
 */
export async function deleteDocument(storageKey) {
    if (!storageKey) return;
    
    // Cloudinary is now the primary and only active service.
    await deleteFromCloudinary(storageKey);

    /*
    --- Disconnected local fallback for future use ---
    if (env.storage.provider === 'local') {
        deleteLocalDocument(storageKey);
    }
    */
}
