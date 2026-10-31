import client from './client';

export const formatRequest = (request) => {
    if (!request) return null;
    const hospital = request.hospitalId;
    return {
        ...request,
        hospitalName: hospital?.name || request.hospitalName || '',
        hospitalAddress: hospital?.address || request.hospitalAddress || '',
        hospitalCity: hospital?.city || request.hospitalCity || '',
        hospitalState: hospital?.state || request.hospitalState || '',
        hospitalCoordinates: hospital?.coordinates?.lat != null && hospital?.coordinates?.lng != null
            ? {
                lat: hospital.coordinates.lat,
                lng: hospital.coordinates.lng,
            }
            : request.hospitalCoordinates || null,
        neededBy: request.neededBy || null,
        fulfillment: request.fulfillment || {
            unitsNeeded: request.unitsNeeded || 1,
            fulfilledUnits: 0,
            remainingUnits: request.unitsNeeded || 1,
            progressPercentage: 0,
            totalResponses: Array.isArray(request.responses) ? request.responses.length : 0,
        },
        responses: Array.isArray(request.responses) ? request.responses : [],
    };
};

export async function createBloodRequest(requestData) {
    const formData = new FormData();
    formData.append('patientBloodGroup', requestData.patientBloodGroup);
    formData.append('unitsNeeded', requestData.unitsNeeded);
    formData.append('hospitalId', requestData.hospitalId);
    formData.append('urgency', requestData.urgency);
    formData.append('neededBy', requestData.neededBy);
    if (requestData.patientCondition) {
        formData.append('patientCondition', requestData.patientCondition);
    }
    formData.append('hospitalDocument', requestData.hospitalDocument);

    const { data } = await client.post('/api/request', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    return formatRequest(data.data.request);
}

export async function getMyRequests(params = {}) {
    const { data } = await client.get('/api/request/my', { params });
    const rawRequests = Array.isArray(data.data?.requests)
        ? data.data.requests
        : Array.isArray(data.data)
        ? data.data
        : [];
    const requests = rawRequests.map(formatRequest).filter(Boolean);
    return {
        requests,
        pagination: data.data?.pagination || {
            page: 1,
            limit: requests.length,
            total: requests.length,
            hasMore: false,
        },
    };
}

export async function getAllRequests(params = {}) {
    const { data } = await client.get('/api/request', { params });
    const rawRequests = Array.isArray(data.data?.requests)
        ? data.data.requests
        : Array.isArray(data.data)
        ? data.data
        : [];
    const requests = rawRequests.map(formatRequest).filter(Boolean);
    return {
        requests,
        pagination: data.data?.pagination || {
            page: 1,
            limit: requests.length,
            total: requests.length,
            hasMore: false,
        },
    };
}

export async function getRequestById(requestId) {
    const { data } = await client.get(`/api/request/${requestId}`);
    return formatRequest(data.data?.request);
}

export async function cancelBloodRequest(requestId) {
    const { data } = await client.patch(`/api/request/${requestId}/cancel`);
    return formatRequest(data.data?.request);
}

export async function completeBloodRequest(requestId) {
    const { data } = await client.patch(`/api/request/${requestId}/complete`);
    return formatRequest(data.data?.request);
}

export {
    volunteerForRequest,
    updateVolunteerStatus,
    withdrawVolunteerResponse,
    getVolunteersForRequest
} from './volunteer.api';

