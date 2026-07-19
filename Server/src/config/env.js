import 'dotenv/config';

// Helpers 
function required(key) {
    const value = process.env[key];

    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}

function optional(key, defaultValue) {
    return process.env[key] ?? defaultValue;
}

function requiredInt(key) {
    const value = required(key);
    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
        throw new Error(`Environment variable ${key} must be an integer, got: ${value}`);
    }
    return parsed;
}

function optionalInt(key, defaultValue) {
    const value = process.env[key];
    if (!value) return defaultValue;

    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
        throw new Error(`Environment variable ${key} must be an integer, got: ${value}`);
    }
    return parsed;
}

// Environment 

const NODE_ENV = optional('NODE_ENV', 'development');
const isProduction = NODE_ENV === 'production';
const isDevelopment = NODE_ENV === 'development';
const isTest = NODE_ENV === 'test';

// Validated config object
// All files import from here. No file in the project reads process.env directly.

const env = {
    NODE_ENV,
    isProduction,
    isDevelopment,
    isTest,

    server: {
        port: optionalInt('PORT', 5000),
    },

    db: {
        uri: required('MONGO_URI'),
    },

    auth: {
        jwtSecret: required('JWT_SECRET'),
        jwtExpiresIn: optionalInt('JWT_EXPIRES_IN', '7d'), // seconds
        bcryptSaltRounds: optionalInt('BCRYPT_SALT_ROUNDS', 12),
    },

    email: {
        host: required('EMAIL_HOST'),
        port: requiredInt('EMAIL_PORT'),
        user: required('EMAIL_USER'),
        password: required('EMAIL_PASSWORD'),
        from: optional('EMAIL_FROM', `BloodWeb <no-reply@bloodweb.in>`),
    },

    cors: {
        // comma-separated list of allowed origins in .env
        origins: optional('CORS_ORIGINS', 'https://localhost:3000').split(','),
    },

    rateLimit: {
        windowMs: optionalInt('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000), // 15 minutes
        max: optionalInt('RATE_LIMIT_MAX', 100),
    },
};

export default env;