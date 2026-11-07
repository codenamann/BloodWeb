import env from '../config/env.js';
import logger from '../utils/logger.js';

export default function errorHandler(err, req, res, next) {
    let statusCode = err.statusCode || 500;
    let status = err.status || 'error';
    let message = err.message || 'Something went wrong';

    // Log internal server errors
    if (statusCode === 500) {
        logger.error(`[500 Internal Error] ${req.method} ${req.originalUrl}:`, err);
        // Do not leak internal database / system query messages in production
        if (env.isProduction) {
            message = 'An unexpected error occurred. Please try again later.';
        }
    }

    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        statusCode = 401;
        status = 'fail';
        message = 'Invalid or expired token';
    }

    if (err.code === 11000) {
        statusCode = 409;
        status = 'fail';
        message = 'Duplicate field value entered';
    }

    res.status(statusCode).json({
        status,
        message,
        ...(err.code ? { code: err.code } : {}),
        ...(err.data ? { data: err.data } : {}),
    });
}