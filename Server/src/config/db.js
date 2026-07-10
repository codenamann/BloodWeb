import mongoose from "mongoose";
import env from "./env.js";
import logger from "../utils/logger.js";

export async function connectDB() {
    if (isConnected) {
        logger.warn("connectDB is called but connection already exists - skipping");
        return;
    }

    try {
        const connection = await mongoose.connect(env.db.uri, {
            serverSelectionTimeoutMS: 5000, // fail fast if DB is unreachable at startup
            socketTimeoutMS: 45000, // close sockets after 45s of inactivity
        })

        logger.info(`MongoDB connected: ${connection.connection.host}`);
    } catch (error) {
        logger.error(`MongoDB connection failed: ${error.message}`);
    }
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
    if (!(mongoose.connection.readyState === 1)) return;
    await mongoose.connection.close();
    logger.info("MongoDB connection closed");
}