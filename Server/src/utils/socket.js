import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import logger from './logger.js';
import { isRoomParticipant } from '../services/message.service.js';

let io = null;

export function initIO(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: env.cors.origins,
            credentials: true,
        },
    });

    // Socket authentication middleware
    io.use((socket, next) => {
        try {
            const rawToken = socket.handshake.auth?.token || socket.handshake.headers?.authorization;
            if (!rawToken) {
                return next(new Error('Authentication token required'));
            }

            const token = rawToken.startsWith('Bearer ') ? rawToken.split(' ')[1] : rawToken;
            const decoded = jwt.verify(token, env.auth.jwtSecret);
            socket.user = decoded;
            next();
        } catch (err) {
            logger.warn(`[SOCKET AUTH] Failed socket connection authentication: ${err.message}`);
            next(new Error('Invalid or expired socket authentication token'));
        }
    });

    io.on('connection', (socket) => {
        const userId = (socket.user?.id || socket.user?._id)?.toString();
        logger.info(`[SOCKET CONNECTED] Socket ${socket.id} connected for user ${userId}`);

        // Automatically join user's private notification channel
        if (userId) {
            socket.join(`user:${userId}`);
        }

        // Subscribe to a coordination room (authorized participants only)
        socket.on('subscribe_room', async (requestId, ack) => {
            try {
                if (!requestId) {
                    if (typeof ack === 'function') ack({ success: false, message: 'Missing requestId' });
                    return;
                }

                const authorized = await isRoomParticipant(requestId, userId);
                if (!authorized) {
                    logger.warn(`[SOCKET UNAUTHORIZED] User ${userId} denied subscription to room:${requestId}`);
                    if (typeof ack === 'function') ack({ success: false, message: 'Unauthorized room access' });
                    return;
                }

                socket.join(`room:${requestId}`);
                logger.info(`[SOCKET ROOM] User ${userId} joined room:${requestId}`);
                if (typeof ack === 'function') ack({ success: true, room: `room:${requestId}` });
            } catch (err) {
                logger.error(`[SOCKET ROOM ERROR] subscribe_room failed: ${err.message}`);
                if (typeof ack === 'function') ack({ success: false, message: err.message });
            }
        });

        // Unsubscribe from a coordination room
        socket.on('unsubscribe_room', (requestId) => {
            if (requestId) {
                socket.leave(`room:${requestId}`);
            }
        });

        // Subscribe to public request updates (fulfillment / status updates)
        socket.on('subscribe_request', (requestId) => {
            if (requestId) {
                socket.join(`request:${requestId}`);
            }
        });

        socket.on('unsubscribe_request', (requestId) => {
            if (requestId) {
                socket.leave(`request:${requestId}`);
            }
        });

        socket.on('disconnect', (reason) => {
            logger.info(`[SOCKET DISCONNECTED] Socket ${socket.id} disconnected: ${reason}`);
        });
    });

    return io;
}

export function getIO() {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
}

/**
 * Emit event to a specific authenticated user's private channel
 */
export function emitToUser(userId, event, payload) {
    if (!io) return;
    const target = userId?.toString();
    if (target) {
        io.to(`user:${target}`).emit(event, payload);
    }
}

/**
 * Emit event to authorized participants inside a specific coordination room
 */
export function emitToRoom(requestId, event, payload) {
    if (!io) return;
    const target = requestId?.toString();
    if (target) {
        io.to(`room:${target}`).emit(event, payload);
    }
}

/**
 * Emit event to all clients monitoring a specific blood request
 */
export function emitToRequest(requestId, event, payload) {
    if (!io) return;
    const target = requestId?.toString();
    if (target) {
        io.to(`request:${target}`).emit(event, payload);
    }
}
