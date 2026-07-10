import http from "http";
import app from "./app.js";
import env from "./config/env.js";
import logger from "./utils/logger.js";
import { connectDB, disconnectDB } from "./config/db.js";

const server = http.createServer(app);

// Startup 

async function start() {
    // Connect to DB before accepting any trafic
    await connectDB();

    server.listen(env.server.port, () => {
        logger.info(`Server running in ${env.NODE_ENV} mode on port ${env.server.port}`);
    });
}

// Graceful shutdown
// On SIGTERM or SIGINT: stop accepting new connections, finish in-flight requests

async function shutdown(signal) {
    logger.info(`Received ${signal}. Shutting down gracefully...`);

    server.close(async () => {
        logger.info('HTTP server closed');
        await disconnectDB();
        logger.info('Shutdown complete');
        process.exit(0);
    });

    // Forcing shutdown if not closed in 10 seconds.
    setTimeout(() => {
        logger.error('Could not close connections in time, forcing shutdown');
        process.exit(1);
    }, 10000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Catching unhandled promise rejections - log and shut down rather than
// running in unknown state.
process.on('unhandledRejection', (reason) => {
    logger.error(`Unhandled Rejection: ${reason}`);
    shutdown('unhandledRejection');
});

start();