import { requestPipeline } from "../engines/requestPipeline.js";
import BloodRequest from "../models/BloodRequest.model.js";
import { validateRequestTransition } from "../models/transitions/requestStatus.transitions.js";
import logger from "../utils/logger.js";

export async function createRequest(data, createdBy) {
    const request = await BloodRequest.create({
        patientBloodGroup: data.patientBloodGroup,
        unitsNeeded: data.unitsNeeded,
        hospitalId: data.hospitalId,
        urgency: data.urgency,
        neededBy: data.neededBy,
        hospitalDocument: data.hospitalDocument,
        createdBy,
    });

    requestPipeline(request).catch((err) => {
        logger.error(`Pipeline failed for request: ${request._id}: ${err.message}`);
    });

    return request;
}

export async function getRequestById(requestId) {
    const request = await BloodRequest.findOne({ _id: requestId })
        .populate('hospitalId')
        .populate('createdBy', 'name email');

    if (!request) throw new Error('Request not found');

    return request;
}

export async function getRequestByUser(userId) {
    const requests = await BloodRequest.find({ createdBy: userId });
    return requests;
}

export async function getActiveRequestsByHospital(hospitalId) {
    const requests = await BloodRequest.find({
        hospitalId,
        status: { $nin: ['COMPLETED', 'CANCELLED', 'EXPIRED'] }
    });
    return requests;
}

export async function transitionStatus(requestId, newStatus) {
    const request = await BloodRequest.findOne({ _id: requestId });
    if (!request) throw new Error('Request not found');

    validateRequestTransition(request.status, newStatus);
    request.status = newStatus;
    await request.save();

    return request;
}

export async function cancelRequest(requestId, userId) {
    const request = await BloodRequest.findOne({ _id: requestId, createdBy: userId });
    if (!request) throw new Error('Request not found or permission denied');
    return transitionStatus(requestId, 'CANCELLED');
}