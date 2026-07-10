import { createLogger, format, transport, transports } from 'winston';
import env from '../config/env.js';

const { combine, timestamp, printf, colorize, errors } = format;

// Human readable format for development.
const devFormat = combine(
    colorize(),
    timestamp({ format: 'HH:mm:ss' }),
    errors({ stack: true }),
    printf(({ level, message, timestamp, stack }) => {
        return stack
            ? `${timestamp} ${level}: ${message}\n${stack}`
            : `${timestamp} ${level}: ${message}`;
    })
);

// Structured JSON format for production - parseable by log aggregators.
const prodFormat = combine(
    timestamp(),
    errors({ stack: true }),
    format.json()
);

const logger = createLogger(
    {
        level: env.isProduction ? 'info' : 'debug',
        format: env.isProduction ? prodFormat : devFormat,
        transports: [
            new transports.Console(),
        ],
        // Do not exit on handled exception
        exitOnError: false,
    }
);

export default logger;