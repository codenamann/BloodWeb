import client from './client';

/**
 * Submit a volunteer response for a blood request
 * @param {string} requestId 
 * @param {object} locationAtResponse - optional { lat, lng }
 */
export async function volunteerForRequest(requestId, locationAtResponse = null) {
    const { data } = await client.post(`/api/volunteer/${requestId}`, {
        locationAtResponse
    });
    return data.data?.volunteer;
}

/**
 * Update volunteer status (accepted / backup) by request creator
 * Supports both (responseId, status) and (requestId, responseId, status)
 * @param {string} responseId 
 * @param {'ACCEPTED' | 'BACKUP'} status 
 */
export async function updateVolunteerStatus(arg1, arg2, arg3) {
    const responseId = arg3 !== undefined ? arg2 : arg1;
    const status = arg3 !== undefined ? arg3 : arg2;
    const { data } = await client.patch(`/api/volunteer/${responseId}/status`, {
        status
    });
    return data.data?.volunteer;
}

/**
 * Withdraw a volunteer response by the donor
 * Supports both (responseId) and (requestId, responseId)
 * @param {string} responseId 
 */
export async function withdrawVolunteerResponse(arg1, arg2) {
    const responseId = (arg2 && typeof arg2 === 'string' && /^[0-9a-fA-F]{24}$/.test(arg2))
        ? arg2
        : arg1;
    const { data } = await client.patch(`/api/volunteer/${responseId}/withdraw`);
    return data.data?.volunteer;
}

/**
 * Get all volunteers for a blood request
 * @param {string} requestId 
 */
export async function getVolunteersForRequest(requestId) {
    const { data } = await client.get(`/api/volunteer/request/${requestId}`);
    return data.data?.volunteers || [];
}
