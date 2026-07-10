import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import env from './config/env';

const app = express();

// Security middleware

// Sets secure HTTP headers (X-Content-Type-Options, X-Frame-Options etc.)
app.use(helmet());

// CORS - only allow configured origins.
app.use(cors({
    origin: env.cors.origins,
    credentials: true,
}));

// Global rate limiter - protects all routes.
// Individual sensitive routes (auth, request creation) get tighter limits
app.use(rateLimit({
    windowMs: env.rateLimit.windowMs,
    max: env.rateLimit.max,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' }
}));

// Body parsing

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

// Routes
// --- to be added ---


// Health check

import { getConnectionStatus } from './config/db.js';

app.get('/health', (req, res) => {
    const db = getConnectionStatus();
    res.status(db.isConnected ? 200 : 503).json({
        status: db.isConnected ? 'ok' : 'degraded',
        db: db.isConnected ? 'connected' : 'disconnected',
    })
})

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` })
});

// Global error handler
// All errors thrown in controllers/services flow here via next(error).
app.use((err, req, res, next) => {
    const statusCode = err.statusCode ?? 500;
    const message = err.isOperational ? err.message : 'Something went wrong';

    // Log stack trace in development, but not in production
    if (!env.isProduction) {
        console.error(err);
    }

    res.status(statusCode).json({
        error: message,
        ...(env.isDevelopment && { stack: err.stack }), // include stack trace in development
    });
});

export default app;