import client from './client';

/**
 * Fetch or initialize coordination room metadata for a request
 * @param {string} requestId 
 */
export async function getCoordinationRoom(requestId) {
    const { data } = await client.get(`/api/coordination/${requestId}`);
    return data.data?.room;
}

/**
 * Fetch message history and cooldown status for a room
 * @param {string} requestId 
 */
export async function getCoordinationMessages(requestId) {
    const { data } = await client.get(`/api/coordination/${requestId}/messages`);
    return data.data;
}

/**
 * Send a user message in a coordination room
 * @param {string} requestId 
 * @param {string} text 
 */
export async function sendCoordinationMessage(requestId, text, replyTo = null) {
    const { data } = await client.post(`/api/coordination/${requestId}/messages`, {
        text,
        replyTo
    });
    return data.data?.message;
}

/**
 * Send a donor quick action (e.g. MARKED_ON_WAY, DISTANCE_UPDATED)
 * @param {string} requestId 
 * @param {'MARKED_ON_WAY' | 'DISTANCE_UPDATED'} action 
 */
export async function sendCoordinationQuickAction(requestId, action) {
    const { data } = await client.post(`/api/coordination/${requestId}/quick-action`, {
        action
    });
    return data.data?.message;
}

/**
 * Get room participants (requester and active volunteers)
 * @param {string} requestId 
 */
export async function getCoordinationParticipants(requestId) {
    const { data } = await client.get(`/api/coordination/${requestId}/participants`);
    return data.data;
}

/**
 * Admin: Pin or unpin a message
 * @param {string} requestId 
 * @param {string|null} messageId 
 */
export async function pinCoordinationMessage(requestId, messageId) {
    const { data } = await client.patch(`/api/coordination/${requestId}/pin`, {
        messageId
    });
    return data.data?.room;
}

/**
 * Admin: Configure cooldown settings
 * @param {string} requestId 
 * @param {{ seconds?: number, enabled?: boolean }} config 
 */
export async function updateCoordinationCooldown(requestId, { seconds, enabled }) {
    const { data } = await client.patch(`/api/coordination/${requestId}/cooldown`, {
        seconds,
        enabled
    });
    return data.data?.room;
}

/**
 * Admin: Close the coordination room
 * @param {string} requestId 
 */
export async function closeCoordinationRoom(requestId) {
    const { data } = await client.patch(`/api/coordination/${requestId}/close`);
    return data.data?.room;
}
