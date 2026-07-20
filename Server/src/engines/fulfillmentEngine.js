import BloodRequest from "../models/BloodRequest.model.js";
import VolunteerResponse from "../models/VolunteerResponse.model.js";

export default async function getRequestStatus(requestId) {
    const request = await BloodRequest.findById(requestId, { unitsNeeded: 1 }).lean();
    if (!request) throw new Error('Blood request not found');

    const acceptedCount = await VolunteerResponse.countDocuments({
        requestId,
        status: 'ACCEPTED'
    });

    if (acceptedCount === 0) return 'PENDING';
    if (acceptedCount >= request.unitsNeeded) return 'FULFILLED';
    return 'PARTIALLY_FULFILLED';
}