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
 * @param {string} responseId 
 * @param {'ACCEPTED' | 'BACKUP'} status 
 */
export async function updateVolunteerStatus(responseId, status) {
    const { data } = await client.patch(`/api/volunteer/${responseId}/status`, {
        status
    });
    return data.data?.volunteer;
}

/**
 * Withdraw a volunteer response by the donor
 * @param {string} responseId 
 */
export async function withdrawVolunteerResponse(responseId) {
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
