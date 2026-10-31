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

  if (socket && socket.connected) {
    return socket;
  }

  // If socket exists but token changed, re-create
  if (socket) {
    socket.auth = { token };
    socket.connect();
    return socket;
  }

  const serverUrl = env.server.url || 'http://localhost:5000';

  socket = io(serverUrl, {
    auth: { token },
    transports: ['websocket', 'polling'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    // Connected to server
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
 * Returns an unsubscribe cleanup function.
 */
export function subscribeToCoordinationRoom(requestId, eventHandlers = {}) {
  const s = getSocket();
  if (!s || !requestId) return () => {};

  // Request server to join room with authorization check
  s.emit('subscribe_room', requestId, (res) => {
    if (res && !res.success) {
      console.warn(`[SOCKET ROOM] Failed to join room ${requestId}:`, res.message);
    }
  });

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
    cleanupFns.forEach((fn) => fn());
    if (s.connected) {
      s.emit('unsubscribe_room', requestId);
    }
  };
}

/**
 * Subscribe to public blood request events (fulfillment, status, volunteer counts).
 * Returns an unsubscribe cleanup function.
 */
export function subscribeToRequestUpdates(requestId, eventHandlers = {}) {
  const s = getSocket();
  if (!s || !requestId) return () => {};

  s.emit('subscribe_request', requestId);

  const cleanupFns = [];
  Object.entries(eventHandlers).forEach(([event, handler]) => {
    if (typeof handler === 'function') {
      s.on(event, handler);
      cleanupFns.push(() => s.off(event, handler));
    }
  });

  return () => {
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
