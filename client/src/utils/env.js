
function required(key) {
    const value = import.meta.env[key];
    if (value === undefined) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}

function optional(key, defaultValue) {
    return import.meta.env[key] ?? defaultValue;
}

function requiredInt(key) {
    const value = import.meta.env[key];
    if (value === undefined) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    const num = parseInt(value, 10);
    if (isNaN(num)) {
        throw new Error(`Environment variable ${key} must be an integer`);
    }
    return num;
}

function optionalInt(key, defaultValue) {
    const value = import.meta.env[key];
    if (value === undefined) {
        return defaultValue;
    }
    const num = parseInt(value, 10);
    if (isNaN(num)) {
        throw new Error(`Environment variable ${key} must be an integer`);
    }
    return num;
}

const env = {
    server: {
        url: required('VITE_SERVER_URL'),
    },
}

export default env;