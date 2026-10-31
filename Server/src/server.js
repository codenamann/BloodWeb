import http from 'http';
import app from './app.js';
import env from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import logger from "./utils/logger.js";
import { initIO } from './utils/socket.js';

const PORT = env.server.port;
const server = http.createServer(app);

initIO(server);

await connectDB();

server.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
})

const shutdown = async (signal) => {
    logger.info(`${signal} received, shutting down gracefully...`);
    server.close(async () => {
        try {
            await disconnectDB();
            logger.info('server closed');
            process.exit(0);
        } catch (error) {
            logger.error('MongoDB disconnection failed', error);
            process.exit(1);
        }
    })
}

server.on('error', (error) => {
    logger.error('Error', error.message);
    if (error.code === 'EADDRINUSE') {
        logger.error(`Port ${PORT} is already in use. Trying to find other port`);
        let newPort = PORT + 1;
        server.listen(newPort, () => {
            logger.info(`Server is running on port ${newPort}`);
        })
    } else {
        logger.error('Error', error.message);
    }
    process.emit('SIGTERM');
})

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);