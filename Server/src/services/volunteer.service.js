import mongoose from "mongoose";
import AppError from "../middleware/appError.js";
import logger from "../utils/logger.js";
import getRequestStatus from "../engines/fulfillmentEngine.js";
import { calculateDistanceKm } from "../engines/matchingEngine.js";
import { getCompatibleDonorGroups } from "../engines/compatibilityEngine.js";
import BloodRequest from "../models/BloodRequest.model.js";
import Hospital from "../models/Hospital.model.js";
import { validateVolunteerTransition } from "../models/transitions/volunteerStatus.transitions.js";
import User from "../models/User.model.js";
import VolunteerResponse from "../models/VolunteerResponse.model.js";
import CoordinationRoom from "../models/CoordinationRoom.model.js";
import { transitionStatus } from "./request.service.js";
import { createRoom } from "./room.service.js";
import { sendSystemMessage } from "./message.service.js";
import { emitToRoom, emitToRequest } from "../utils/socket.js";
import {
    notifyVolunteerResponse,
    notifyVolunteerAccepted,
    notifyVolunteerAcceptedMutual,
    notifyVolunteerBackup,
    notifyVolunteerWithdrawn
} from "./notification.service.js";

/**
 * Synchronizes a blood request's fulfillment status based on current ACCEPTED volunteer count.
 * Handles both promotions (ACTIVE -> PARTIALLY_FULFILLED -> FULFILLED)
 * and demotions (FULFILLED -> PARTIALLY_FULFILLED -> ACTIVE).
 */
async function syncRequestFulfillmentStatus(requestId) {
    const currentRequest = await BloodRequest.findById(requestId).select('status unitsNeeded');
    if (!currentRequest) return;

    // Never modify terminal requests
    if (['COMPLETED', 'CANCELLED', 'EXPIRED'].includes(currentRequest.status)) {
        return;
    }

    const derivedStatus = await getRequestStatus(requestId);
    if (currentRequest.status !== derivedStatus) {
        await transitionStatus(requestId, derivedStatus);
    }
}

export async function createVolunteerResponse(requestId, donorId, locationAtResponse) {
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
        throw new AppError('Invalid request ID format', 400);
    }
    if (!mongoose.Types.ObjectId.isValid(donorId)) {
        throw new AppError('Invalid donor ID format', 400);
    }

    // 1. Verify Blood Request existence and active status
    const request = await BloodRequest.findById(requestId).select(
        'createdBy hospitalId patientBloodGroup status unitsNeeded'
    );
    if (!request) {
        throw new AppError('Blood request not found', 404);
    }

    if (!['ACTIVE', 'PARTIALLY_FULFILLED'].includes(request.status)) {
        throw new AppError(`Cannot volunteer for blood request with status: ${request.status}`, 400);
    }

    // 2. Block self-volunteering: Creator cannot volunteer for their own request
    if (request.createdBy.toString() === donorId.toString()) {
        throw new AppError('You cannot volunteer for your own blood request', 403);
    }

    // 3. Service-level check for duplicate responses
    const existingResponse = await VolunteerResponse.findOne({ requestId, donorId });
    if (existingResponse && existingResponse.status !== 'WITHDRAWN') {
        throw new AppError('You have already volunteered for this request', 409);
    }

    // 4. Fetch Donor User & verify profile completeness
    const donorUser = await User.findById(donorId).select('name bloodGroup location phone dob');
    if (!donorUser) {
        throw new AppError('Donor user not found', 404);
    }
    if (!donorUser.bloodGroup) {
        throw new AppError('Donor blood group must be set before volunteering', 400);
    }
    if (!donorUser.phone) {
        throw new AppError('Mobile number is required before volunteering so the requester can contact you', 400);
    }
    if (!donorUser.dob) {
        throw new AppError('Date of birth is required before volunteering', 400);
    }
    const birthDate = new Date(donorUser.dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    if (isNaN(age) || age < 18) {
        throw new AppError('You must be at least 18 years old to volunteer as a blood donor', 400);
    }
    if (!donorUser.location || !donorUser.location.coordinates || !donorUser.location.city) {
        throw new AppError('Donor location must be configured before volunteering', 400);
    }

    // 5. Server-side blood compatibility enforcement
    const compatibleDonorGroups = getCompatibleDonorGroups(request.patientBloodGroup);
    if (!compatibleDonorGroups.includes(donorUser.bloodGroup)) {
        throw new AppError(
            `Donor blood group (${donorUser.bloodGroup}) is not compatible with patient blood group (${request.patientBloodGroup})`,
            400
        );
    }

    // 6. Null-safe coordinate extraction and distance calculation
    let donorCoords = null;
    if (
        locationAtResponse &&
        typeof locationAtResponse.lat === 'number' &&
        typeof locationAtResponse.lng === 'number' &&
        !isNaN(locationAtResponse.lat) &&
        !isNaN(locationAtResponse.lng)
    ) {
        donorCoords = { lat: locationAtResponse.lat, lng: locationAtResponse.lng };
    } else if (
        donorUser.location?.coordinates &&
        typeof donorUser.location.coordinates.lat === 'number' &&
        typeof donorUser.location.coordinates.lng === 'number' &&
        !isNaN(donorUser.location.coordinates.lat) &&
        !isNaN(donorUser.location.coordinates.lng)
    ) {
        donorCoords = {
            lat: donorUser.location.coordinates.lat,
            lng: donorUser.location.coordinates.lng,
        };
    }

    const hospital = await Hospital.findById(request.hospitalId).select('coordinates');
    const hospitalCoords =
        hospital?.coordinates &&
        typeof hospital.coordinates.lat === 'number' &&
        typeof hospital.coordinates.lng === 'number' &&
        !isNaN(hospital.coordinates.lat) &&
        !isNaN(hospital.coordinates.lng)
            ? hospital.coordinates
            : null;

    let estimatedDistanceKm = null;
    if (donorCoords && hospitalCoords) {
        try {
            const dist = calculateDistanceKm(
                donorCoords.lat,
                donorCoords.lng,
                hospitalCoords.lat,
                hospitalCoords.lng
            );
            estimatedDistanceKm =
                typeof dist === 'number' && !isNaN(dist) ? Math.round(dist * 10) / 10 : null;
        } catch (distErr) {
            logger.warn(`Failed to calculate distance for volunteer response: ${distErr.message}`);
            estimatedDistanceKm = null;
        }
    }

    // 7. Persist or reactivate VolunteerResponse with duplicate-key race protection
    let volunteerDoc;
    if (existingResponse && existingResponse.status === 'WITHDRAWN') {
        existingResponse.status = 'PENDING';
        existingResponse.locationAtResponse = donorCoords;
        existingResponse.estimatedDistanceKm = estimatedDistanceKm;
        volunteerDoc = await existingResponse.save();
    } else {
        try {
            volunteerDoc = await VolunteerResponse.create({
                requestId,
                donorId,
                locationAtResponse: donorCoords,
                estimatedDistanceKm,
            });
        } catch (err) {
            if (
                err.code === 11000 ||
                (err.name === 'MongoServerError' && err.message?.includes('duplicate key'))
            ) {
                const raced = await VolunteerResponse.findOne({ requestId, donorId });
                if (raced && raced.status === 'WITHDRAWN') {
                    raced.status = 'PENDING';
                    raced.locationAtResponse = donorCoords;
                    raced.estimatedDistanceKm = estimatedDistanceKm;
                    volunteerDoc = await raced.save();
                } else {
                    throw new AppError('You have already volunteered for this request', 409);
                }
            } else {
                throw err;
            }
        }
    }

    // 8. Safe Coordination Room initialization (first volunteer triggers room creation)
    const count = await VolunteerResponse.countDocuments({ requestId });
    if (count === 1) {
        try {
            await createRoom(requestId);
        } catch (roomErr) {
            logger.error(
                `[VOLUNTEER SERVICE] Failed to initialize coordination room for request ${requestId}: ${roomErr.message}`,
                { error: roomErr }
            );
        }
    }

    // Trigger in-app notification to the request creator
    try {
        await notifyVolunteerResponse(request, donorUser);
    } catch (notifErr) {
        logger.warn(`Failed to dispatch volunteer response notification: ${notifErr.message}`);
    }

    // Broadcast real-time volunteer update to request & room listeners
    emitToRequest(requestId, 'VOLUNTEER_RESPONDED', {
        requestId: requestId.toString(),
        volunteer: volunteerDoc,
    });
    emitToRoom(requestId, 'VOLUNTEER_RESPONDED', {
        requestId: requestId.toString(),
        volunteer: volunteerDoc,
    });

    return volunteerDoc;
}

export async function updateVolunteerStatus(responseId, requestorId, newStatus) {
    if (!mongoose.Types.ObjectId.isValid(responseId)) {
        throw new AppError('Invalid response ID format', 400);
    }
    if (!mongoose.Types.ObjectId.isValid(requestorId)) {
        throw new AppError('Invalid requester ID format', 400);
    }

    const volunteerResponse = await VolunteerResponse.findById(responseId);
    if (!volunteerResponse) {
        throw new AppError('Volunteer response not found', 404);
    }

    const request = await BloodRequest.findById(volunteerResponse.requestId)
        .populate('hospitalId', 'name address city state')
        .select('createdBy status unitsNeeded hospitalId patientBloodGroup');
    if (!request) {
        throw new AppError('Associated blood request not found', 404);
    }

    // Only the request creator can manage volunteer statuses
    if (request.createdBy.toString() !== requestorId.toString()) {
        throw new AppError('Only the request creator can manage volunteer statuses', 403);
    }

    if (['COMPLETED', 'CANCELLED', 'EXPIRED'].includes(request.status)) {
        throw new AppError(
            `Cannot update volunteer status for a ${request.status.toLowerCase()} request`,
            400
        );
    }

    const prevStatus = volunteerResponse.status;
    try {
        validateVolunteerTransition(prevStatus, newStatus);
    } catch (transitionErr) {
        throw new AppError(transitionErr.message, 400);
    }

    volunteerResponse.status = newStatus;
    await volunteerResponse.save();

    // Recalculate fulfillment if moving into or out of ACCEPTED status
    if (newStatus === 'ACCEPTED' || prevStatus === 'ACCEPTED') {
        await syncRequestFulfillmentStatus(volunteerResponse.requestId);
    }

    const [donorUser, requesterUser] = await Promise.all([
        User.findById(volunteerResponse.donorId).select('name email phone bloodGroup'),
        User.findById(request.createdBy).select('name email phone')
    ]);
    const hospitalName = request.hospitalId?.name || 'the hospital';

    // Post automated system message to coordination room and dispatch notifications
    try {
        let room = await CoordinationRoom.findOne({ requestId: volunteerResponse.requestId });
        if (!room && newStatus === 'ACCEPTED') {
            room = await createRoom(volunteerResponse.requestId);
        }

        if (newStatus === 'ACCEPTED') {
            if (room) {
                await sendSystemMessage(
                    room._id,
                    'VOLUNTEER_ACCEPTED',
                    `${donorUser?.name || 'A volunteer'} has been accepted to donate.`
                );
            }
            await notifyVolunteerAcceptedMutual({
                request,
                donorUser,
                requesterUser
            });
        } else if (newStatus === 'BACKUP') {
            if (room) {
                await sendSystemMessage(
                    room._id,
                    'VOLUNTEER_BACKUP',
                    `${donorUser?.name || 'A volunteer'} has been placed on standby as backup.`
                );
            }
            await notifyVolunteerBackup(volunteerResponse.requestId, volunteerResponse.donorId, hospitalName);
        }
    } catch (sideEffectErr) {
        logger.warn(`Failed during volunteer status side effects: ${sideEffectErr.message}`);
    }

    // Broadcast real-time status update to request and room listeners
    emitToRequest(volunteerResponse.requestId, 'VOLUNTEER_STATUS_CHANGED', {
        responseId: volunteerResponse._id.toString(),
        status: newStatus,
        requestId: volunteerResponse.requestId.toString(),
    });
    emitToRoom(volunteerResponse.requestId, 'VOLUNTEER_STATUS_CHANGED', {
        responseId: volunteerResponse._id.toString(),
        status: newStatus,
        requestId: volunteerResponse.requestId.toString(),
    });

    return volunteerResponse;
}

export async function withdrawVolunteer(responseId, donorId) {
    if (!mongoose.Types.ObjectId.isValid(responseId)) {
        throw new AppError('Invalid response ID format', 400);
    }
    if (!mongoose.Types.ObjectId.isValid(donorId)) {
        throw new AppError('Invalid donor ID format', 400);
    }

    const volunteerResponse = await VolunteerResponse.findById(responseId);
    if (!volunteerResponse) {
        throw new AppError('Volunteer response not found', 404);
    }

    // Only the donor themselves can withdraw their response
    if (volunteerResponse.donorId.toString() !== donorId.toString()) {
        throw new AppError('You can only withdraw your own volunteer response', 403);
    }

    const prevStatus = volunteerResponse.status;
    const newStatus = 'WITHDRAWN';
    try {
        validateVolunteerTransition(prevStatus, newStatus);
    } catch (transitionErr) {
        throw new AppError(transitionErr.message, 400);
    }

    volunteerResponse.status = newStatus;
    await volunteerResponse.save();

    // If an ACCEPTED volunteer withdraws, sync request fulfillment status (may demote request)
    if (prevStatus === 'ACCEPTED') {
        await syncRequestFulfillmentStatus(volunteerResponse.requestId);
    }

    const request = await BloodRequest.findById(volunteerResponse.requestId).select('createdBy');
    const donorUser = await User.findById(donorId).select('name');

    // Post automated system message to coordination room and notify requester if donor was accepted
    try {
        const room = await CoordinationRoom.findOne({ requestId: volunteerResponse.requestId });
        if (room && prevStatus === 'ACCEPTED') {
            await sendSystemMessage(
                room._id,
                'VOLUNTEER_WITHDRAWN',
                `${donorUser?.name || 'An accepted volunteer'} has withdrawn their offer.`
            );
        }
        if (request && prevStatus === 'ACCEPTED') {
            await notifyVolunteerWithdrawn(volunteerResponse.requestId, request.createdBy, donorUser?.name);
        }
    } catch (sideEffectErr) {
        logger.warn(`Failed during volunteer withdraw side effects: ${sideEffectErr.message}`);
    }

    // Broadcast real-time status update to request and room listeners
    emitToRequest(volunteerResponse.requestId, 'VOLUNTEER_STATUS_CHANGED', {
        responseId: volunteerResponse._id.toString(),
        status: newStatus,
        requestId: volunteerResponse.requestId.toString(),
    });
    emitToRoom(volunteerResponse.requestId, 'VOLUNTEER_STATUS_CHANGED', {
        responseId: volunteerResponse._id.toString(),
        status: newStatus,
        requestId: volunteerResponse.requestId.toString(),
    });

    return volunteerResponse;
}

export async function getVolunteersForRequest(requestId) {
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
        throw new AppError('Invalid request ID format', 400);
    }
    const volunteerResponses = await VolunteerResponse.find({ requestId })
        .populate('donorId', 'name bloodGroup avatar email phone')
        .lean();

    return volunteerResponses;
}