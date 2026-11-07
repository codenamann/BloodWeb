import { io } from 'socket.io-client';
import env from '../utils/env.js';

let socket = null;

/**
 * Get or initialize the Socket.IO client singleton.
 * Uses JWT from localStorage for authentication.
 */
export function getSocket() {
  const token = localStorage.getItem('bloodweb_token');
  if (!token) {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
    return null;
  }

  // If socket already exists, ensure it is authenticated with the latest token
  if (socket) {
    if (socket.auth?.token !== token) {
      socket.auth = { token };
      socket.disconnect();
      socket.connect();
    } else if (!socket.connected && !socket.active) {
      socket.connect();
    }
    return socket;
  }

  const serverUrl = env.server.url || 'http://localhost:5000';

  socket = io(serverUrl, {
    auth: { token },
    transports: ['websocket', 'polling'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    // Socket connected
  });

  socket.on('connect_error', (err) => {
    console.warn('[SOCKET ERROR] Connection error:', err.message);
  });

  return socket;
}

/**
 * Disconnect and destroy the socket instance (e.g. on logout)
 */
export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

/**
 * Join an authorized coordination room and register event handlers.
 * Automatically re-subscribes upon socket reconnect.
 * Returns an unsubscribe cleanup function.
 */
export function subscribeToCoordinationRoom(requestId, eventHandlers = {}) {
  const s = getSocket();
  if (!s || !requestId) return () => {};

  const joinRoom = () => {
    s.emit('subscribe_room', requestId, (res) => {
      if (res && !res.success) {
        console.warn(`[SOCKET ROOM] Failed to join room ${requestId}:`, res.message);
      }
    });
  };

  // Join room immediately if already connected or queued
  joinRoom();

  // Re-join room automatically on every reconnect
  s.on('connect', joinRoom);

  // Attach event handlers
  const cleanupFns = [];
  Object.entries(eventHandlers).forEach(([event, handler]) => {
    if (typeof handler === 'function') {
      s.on(event, handler);
      cleanupFns.push(() => s.off(event, handler));
    }
  });

  // Return unmount cleanup
  return () => {
    s.off('connect', joinRoom);
    cleanupFns.forEach((fn) => fn());
    if (s.connected) {
      s.emit('unsubscribe_room', requestId);
    }
  };
}

/**
 * Subscribe to public blood request events (fulfillment, status, volunteer counts).
 * Automatically re-subscribes upon socket reconnect.
 * Returns an unsubscribe cleanup function.
 */
export function subscribeToRequestUpdates(requestId, eventHandlers = {}) {
  const s = getSocket();
  if (!s || !requestId) return () => {};

  const joinRequest = () => {
    s.emit('subscribe_request', requestId);
  };

  joinRequest();
  s.on('connect', joinRequest);

  const cleanupFns = [];
  Object.entries(eventHandlers).forEach(([event, handler]) => {
    if (typeof handler === 'function') {
      s.on(event, handler);
      cleanupFns.push(() => s.off(event, handler));
    }
  });

  return () => {
    s.off('connect', joinRequest);
    cleanupFns.forEach((fn) => fn());
    if (s.connected) {
      s.emit('unsubscribe_request', requestId);
    }
  };
}

/**
 * Subscribe to private user channel events (in-app notifications).
 * Returns an unsubscribe cleanup function.
 */
export function subscribeToUserNotifications(onNotification) {
  const s = getSocket();
  if (!s || typeof onNotification !== 'function') return () => {};

  s.on('NEW_NOTIFICATION', onNotification);

  return () => {
    s.off('NEW_NOTIFICATION', onNotification);
  };
}
