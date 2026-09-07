import env from "../config/env.js";
import { rateLimit } from 'express-rate-limit';

export default function rateLimiter({ windowMs = env.rateLimit.windowMs, limit = env.rateLimit.max } = {}) {
    return rateLimit({
        windowMs,
        limit,
        message: 'Too many requests, please try again later',
        handler: (req, res, next, options) => {
            res.status(options.statusCode).json({
                status: options.status,
                message: options.message,
            });
        },
    });
}