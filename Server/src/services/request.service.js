import { requestPipeline } from "../engines/requestPipeline.js";
import BloodRequest from "../models/BloodRequest.model.js";
import Hospital from "../models/Hospital.model.js";
import VolunteerResponse from "../models/VolunteerResponse.model.js";
import { validateRequestTransition } from "../models/transitions/requestStatus.transitions.js";
import logger from "../utils/logger.js";
import AppError from "../middleware/appError.js";
import { deleteDocument } from "./document.service.js";
import { getCompatibleRecipientGroups } from "../engines/compatibilityEngine.js";
import User, { BLOOD_GROUPS } from "../models/User.model.js";
import CoordinationRoom from "../models/CoordinationRoom.model.js";
import { sendSystemMessage } from "./message.service.js";
import { emitToRoom, emitToRequest } from "../utils/socket.js";
import { notifyRequestCancelled, notifyRequestCompleted } from "./notification.service.js";
import mongoose from "mongoose";

export async function createRequest(data, createdBy) {
    if (!data.hospitalId) {
        if (data.hospitalDocument?.storageKey) await deleteDocument(data.hospitalDocument.storageKey);
        throw new AppError('Hospital ID is required', 400);
    }

    const hospital = await Hospital.findById(data.hospitalId);
    if (!hospital) {
        if (data.hospitalDocument?.storageKey) await deleteDocument(data.hospitalDocument.storageKey);
        throw new AppError('Selected hospital does not exist', 404);
    }

    try {
        const request = await BloodRequest.create({
            patientBloodGroup: data.patientBloodGroup,
            unitsNeeded: data.unitsNeeded,
            hospitalId: data.hospitalId,
            urgency: data.urgency,
            neededBy: data.neededBy,
            patientCondition: data.patientCondition,
            hospitalDocument: data.hospitalDocument,
            createdBy,
        });

        await request.populate([
            { path: 'createdBy', select: 'name email phone' },
            { path: 'hospitalId' }
        ]);

        requestPipeline(request).catch((err) => {
            logger.error(`Pipeline failed for request: ${request._id}: ${err}`);
        });

        return request;
    } catch (err) {
        if (data.hospitalDocument?.storageKey) {
            await deleteDocument(data.hospitalDocument.storageKey);
        }
        throw err;
    }
}

export async function getRequestById(requestId, viewerId = null) {
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
        throw new AppError('Invalid request ID format', 400);
    }

    const request = await BloodRequest.findById(requestId)
        .populate('hospitalId')
        .populate('createdBy', 'name email phone')
        .lean();

    if (!request) {
        throw new AppError('Request not found', 404);
    }

    const responses = await VolunteerResponse.find({ requestId })
        .populate('donorId', 'name email phone bloodGroup')
        .sort({ createdAt: -1 })
        .lean();

    const viewerIdStr = viewerId?.toString() || null;
    const creatorIdStr = request.createdBy?._id?.toString() || request.createdBy?.toString() || null;
    const isCreator = Boolean(viewerIdStr && creatorIdStr && viewerIdStr === creatorIdStr);

    // Identify if the viewer is an accepted volunteer for this request
    const isAcceptedVolunteer = responses.some(
        (resp) =>
            (resp.donorId?._id?.toString() || resp.donorId?.toString()) === viewerIdStr &&
            resp.status === 'ACCEPTED'
    );

    // Requester contact information (email/phone) is only shared with creator or accepted volunteers
    const canAccessRequesterContact = isCreator || isAcceptedVolunteer;
    const sanitizedCreatedBy = {
        _id: creatorIdStr,
        name: request.createdBy?.name || 'Requester',
        ...(canAccessRequesterContact && {
            email: request.createdBy?.email,
            phone: request.createdBy?.phone,
        }),
    };

    // Sanitize hospital document metadata - strip internal storageKey/public_id
    let sanitizedDocument = null;
    if (request.hospitalDocument) {
        sanitizedDocument = {
            url: request.hospitalDocument.url,
            originalName: request.hospitalDocument.originalName,
            mimeType: request.hospitalDocument.mimeType,
            documentType: request.hospitalDocument.documentType,
            size: request.hospitalDocument.size,
        };
    }

    // Normalize and sanitize volunteer responses
    const sanitizedResponses = responses.map((resp) => {
        const donorDoc = resp.donorId && typeof resp.donorId === 'object' ? resp.donorId : {};
        const donorIdStr = donorDoc._id?.toString() || resp.donorId?.toString() || '';
        const isSelf = Boolean(viewerIdStr && donorIdStr && viewerIdStr === donorIdStr);

        // Volunteer contact info is exposed only to self, or to creator if the volunteer was ACCEPTED
        const canAccessVolunteerContact = isSelf || (isCreator && resp.status === 'ACCEPTED');

        return {
            _id: resp._id.toString(),
            requestId: resp.requestId.toString(),
            donorId: donorIdStr,
            donor: {
                _id: donorIdStr,
                name: donorDoc.name || 'Verified Donor',
                bloodGroup: donorDoc.bloodGroup || null,
                ...(canAccessVolunteerContact && {
                    email: donorDoc.email,
                    phone: donorDoc.phone,
                }),
            },
            status: resp.status,
            estimatedDistanceKm:
                typeof resp.estimatedDistanceKm === 'number'
                    ? Math.round(resp.estimatedDistanceKm * 10) / 10
                    : null,
            createdAt: resp.createdAt,
        };
    });

    const acceptedCount = responses.filter((r) => r.status === 'ACCEPTED').length;
    const unitsNeeded = request.unitsNeeded || 1;

    const fulfillment = {
        unitsNeeded,
        fulfilledUnits: acceptedCount,
        remainingUnits: Math.max(0, unitsNeeded - acceptedCount),
        progressPercentage: Math.min(100, Math.round((acceptedCount / unitsNeeded) * 100)),
        totalResponses: responses.length,
    };

    return {
        ...request,
        createdBy: sanitizedCreatedBy,
        hospitalDocument: sanitizedDocument,
        responses: sanitizedResponses,
        fulfillment,
    };
}

export async function getRequestByUser(userId, filters = {}) {
    const pageNum = Math.max(1, parseInt(filters.page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(filters.limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const query = { createdBy: userId };

    if (filters.status && filters.status !== 'ALL') {
        query.status = filters.status;
    }
    if (filters.bloodGroup && filters.bloodGroup !== 'ALL') {
        query.patientBloodGroup = filters.bloodGroup;
    }

    if (filters.search && filters.search.trim()) {
        const trimmed = filters.search.trim();
        const matchingHospitals = await Hospital.find({
            $or: [
                { name: { $regex: trimmed, $options: 'i' } },
                { address: { $regex: trimmed, $options: 'i' } },
                { city: { $regex: trimmed, $options: 'i' } }
            ]
        }).select('_id').lean();

        const hospitalIds = matchingHospitals.map(h => h._id);
        const searchConditions = [
            { hospitalId: { $in: hospitalIds } },
            { patientCondition: { $regex: trimmed, $options: 'i' } }
        ];

        if (BLOOD_GROUPS.includes(trimmed.toUpperCase())) {
            searchConditions.push({ patientBloodGroup: trimmed.toUpperCase() });
        }

        query.$and = query.$and || [];
        query.$and.push({ $or: searchConditions });
    }

    const total = await BloodRequest.countDocuments(query);

    const requests = await BloodRequest.find(query)
        .populate('hospitalId')
        .populate('createdBy', 'name email phone')
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean();

    const requestIds = requests.map(r => r._id);
    const responses = await VolunteerResponse.find({ requestId: { $in: requestIds } })
        .populate('donorId', 'name email phone bloodGroup')
        .lean();

    const responsesByRequest = {};
    for (const resp of responses) {
        const rId = resp.requestId.toString();
        if (!responsesByRequest[rId]) responsesByRequest[rId] = [];
        responsesByRequest[rId].push(resp);
    }

    const populatedRequests = requests.map(req => ({
        ...req,
        responses: responsesByRequest[req._id.toString()] || []
    }));

    return {
        requests: populatedRequests,
        pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            hasMore: skip + requests.length < total
        }
    };
}

export async function getAllRequests(filters = {}) {
    const pageNum = Math.max(1, parseInt(filters.page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(filters.limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const query = {};

    if (filters.excludeUser) {
        query.createdBy = { $ne: filters.excludeUser };
    }

    if (filters.status && filters.status !== 'ALL') {
        query.status = filters.status;
    } else {
        query.status = { $ne: 'CANCELLED' };
    }

    if (filters.bloodGroup && filters.bloodGroup !== 'ALL') {
        query.patientBloodGroup = filters.bloodGroup;
    } else if (filters.donorBloodGroup) {
        const compatibleRecipients = getCompatibleRecipientGroups(filters.donorBloodGroup);
        query.patientBloodGroup = { $in: compatibleRecipients };
    }

    if (filters.search && filters.search.trim()) {
        const trimmed = filters.search.trim();
        const matchingHospitals = await Hospital.find({
            $or: [
                { name: { $regex: trimmed, $options: 'i' } },
                { address: { $regex: trimmed, $options: 'i' } },
                { city: { $regex: trimmed, $options: 'i' } }
            ]
        }).select('_id').lean();

        const hospitalIds = matchingHospitals.map(h => h._id);
        const searchConditions = [
            { hospitalId: { $in: hospitalIds } },
            { patientCondition: { $regex: trimmed, $options: 'i' } }
        ];

        if (BLOOD_GROUPS.includes(trimmed.toUpperCase())) {
            searchConditions.push({ patientBloodGroup: trimmed.toUpperCase() });
        }

        query.$and = query.$and || [];
        query.$and.push({ $or: searchConditions });
    }

    const total = await BloodRequest.countDocuments(query);

    const requests = await BloodRequest.find(query)
        .populate('hospitalId')
        .populate('createdBy', 'name email phone')
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean();

    const requestIds = requests.map(r => r._id);
    const responses = await VolunteerResponse.find({ requestId: { $in: requestIds } })
        .populate('donorId', 'name email phone bloodGroup')
        .lean();

    const responsesByRequest = {};
    for (const resp of responses) {
        const rId = resp.requestId.toString();
        if (!responsesByRequest[rId]) responsesByRequest[rId] = [];
        responsesByRequest[rId].push(resp);
    }

    const populatedRequests = requests.map(req => ({
        ...req,
        responses: responsesByRequest[req._id.toString()] || []
    }));

    return {
        requests: populatedRequests,
        pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            hasMore: skip + requests.length < total
        }
    };
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
    if (!request) throw new AppError('Request not found', 404);

    try {
        validateRequestTransition(request.status, newStatus);
    } catch (err) {
        throw new AppError(err.message, 400);
    }

    request.status = newStatus;
    await request.save();

    return request;
}

export async function cancelRequest(requestId, userId) {
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
        throw new AppError('Invalid request ID format', 400);
    }
    const request = await BloodRequest.findOne({ _id: requestId, createdBy: userId })
        .populate('hospitalId', 'name');
    if (!request) throw new AppError('Request not found or permission denied', 404);

    const updated = await transitionStatus(requestId, 'CANCELLED');

    // Close coordination room if one exists
    try {
        const room = await CoordinationRoom.findOne({ requestId });
        if (room && room.status !== 'CLOSED') {
            room.status = 'CLOSED';
            room.closedAt = new Date();
            await room.save();

            try {
                await sendSystemMessage(
                    room._id,
                    'ROOM_CLOSED',
                    'The blood request has been cancelled by the requester and this coordination room is now closed.'
                );
            } catch (msgErr) {
                logger.warn(`Failed to post cancel system message: ${msgErr.message}`);
            }

            emitToRoom(requestId, 'ROOM_CLOSED', {
                roomId: room._id.toString(),
                requestId: requestId.toString(),
            });
        }
    } catch (roomErr) {
        logger.warn(`Failed to close room on request cancel: ${roomErr.message}`);
    }

    // Notify all responding volunteers that the request was cancelled
    try {
        const volunteers = await VolunteerResponse.find({
            requestId,
            status: { $in: ['ACCEPTED', 'PENDING', 'BACKUP'] }
        }).select('donorId');
        const donorIds = volunteers.map(v => v.donorId);
        await notifyRequestCancelled(requestId, donorIds, request.hospitalId?.name);
    } catch (notifErr) {
        logger.warn(`Failed to notify volunteers of request cancellation: ${notifErr.message}`);
    }

    // Broadcast real-time cancel events to request and room listeners
    emitToRequest(requestId, 'REQUEST_CANCELLED', {
        requestId: requestId.toString(),
        status: 'CANCELLED',
    });
    emitToRoom(requestId, 'REQUEST_CANCELLED', {
        requestId: requestId.toString(),
        status: 'CANCELLED',
    });

    return updated;
}

export async function completeRequest(requestId, userId) {
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
        throw new AppError('Invalid request ID format', 400);
    }

    const request = await BloodRequest.findById(requestId).populate('hospitalId', 'name');
    if (!request) {
        throw new AppError('Blood request not found', 404);
    }

    if (!request.createdBy.equals(userId)) {
        throw new AppError('Only the request creator can mark this request as completed', 403);
    }

    try {
        validateRequestTransition(request.status, 'COMPLETED');
    } catch (err) {
        throw new AppError(err.message, 400);
    }

    const acceptedVolunteers = await VolunteerResponse.find({
        requestId,
        status: 'ACCEPTED'
    });

    if (!acceptedVolunteers || acceptedVolunteers.length === 0) {
        throw new AppError('Cannot complete request without at least one accepted volunteer', 400);
    }

    request.status = 'COMPLETED';
    await request.save();

    // Increment successfulDonations for all confirmed accepted donors
    const acceptedDonorIds = acceptedVolunteers.map(v => v.donorId);
    await User.updateMany(
        { _id: { $in: acceptedDonorIds } },
        { $inc: { successfulDonations: 1 } }
    );

    // Safely close Coordination Room if one exists
    try {
        const room = await CoordinationRoom.findOne({ requestId });
        if (room && room.status !== 'CLOSED') {
            room.status = 'CLOSED';
            room.closedAt = new Date();
            await room.save();

            try {
                await sendSystemMessage(room._id, 'REQUEST_COMPLETED');
            } catch (msgErr) {
                logger.warn(`Failed to record REQUEST_COMPLETED system message: ${msgErr.message}`);
            }

            emitToRoom(requestId, 'ROOM_CLOSED', {
                roomId: room._id.toString(),
                requestId: requestId.toString(),
            });
        }
    } catch (roomErr) {
        logger.warn(`Failed to close coordination room for completed request ${requestId}: ${roomErr.message}`);
    }

    // Notify all accepted donors of completion and donation credit
    try {
        const hospName = request.hospitalId?.name || 'the hospital';
        await notifyRequestCompleted(requestId, acceptedDonorIds, hospName);
    } catch (notifErr) {
        logger.warn(`Failed to notify accepted donors of completion: ${notifErr.message}`);
    }

    // Broadcast real-time completion events
    emitToRequest(requestId, 'REQUEST_COMPLETED', {
        requestId: requestId.toString(),
        status: 'COMPLETED',
    });
    emitToRoom(requestId, 'REQUEST_COMPLETED', {
        requestId: requestId.toString(),
        status: 'COMPLETED',
    });

    return getRequestById(requestId, userId);
}