import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import env from './config/env.js';
import { getStatus } from './api/controllers/status.controller.js';
import errorHandler from './middleware/errorHandler.js';
import authRoutes from './api/routes/auth.routes.js';
import userRoutes from './api/routes/user.routes.js';
import hospitalRoutes from './api/routes/hospital.routes.js';
import requestRoutes from './api/routes/request.routes.js';

const app = express();

// Security Middleware with custom CSP to permit status page styling & fonts
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
                fontSrc: ["'self'", 'https://fonts.gstatic.com'],
                imgSrc: ["'self'", 'data:', 'https:'],
                scriptSrc: ["'self'"],
            },
        },
    })
);

app.use(
    cors({
        origin: env.cors.origins,
        credentials: true,
    })
);

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Public Server Identity & Live Status Page
app.get('/', getStatus);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/hospital', hospitalRoutes);
app.use('/api/request', requestRoutes);

// Static file serving for uploads
app.use('/uploads', express.static('public/uploads'));

// 404 Handling Middleware
app.use((req, res) => {
    const { method, originalUrl } = req;
    res.status(404).json({ status: 'fail', message: `Route ${method} ${originalUrl} Not Found` });
});

app.use(errorHandler);

export default app;