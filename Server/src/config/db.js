import mongoose from "mongoose";
import env from "./env.js";
import logger from "../utils/logger.js";

let connectionPromise = null;

export async function connectDB() {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (connectionPromise) {
        return connectionPromise;
    }

    connectionPromise = mongoose.connect(env.db.uri, {
        serverSelectionTimeoutMS: 5000, // fail fast if DB is unreachable
        socketTimeoutMS: 45000, // close sockets after 45s of inactivity
    }).then((conn) => {
        logger.info(`MongoDB connected: ${conn.connection.host}`);
        connectionPromise = null;
        return conn;
    }).catch((error) => {
        connectionPromise = null;
        logger.error(`MongoDB connection failed: ${error.message}`);
        throw error;
    });

    return connectionPromise;
}

export function getConnectionStatus() {
    return {
        isConnected: mongoose.connection.readyState === 1,
        // Mongoose readyState: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
        readyState: mongoose.connection.readyState,
    };
}

// Graceful shutdown - called by server.js on SIGTERM/SIGINT
export async function disconnectDB() {
    connectionPromise = null;
    if (mongoose.connection.readyState !== 1) return;

    await mongoose.connection.close();
    logger.info("MongoDB connection closed");
}