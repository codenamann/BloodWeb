import getRequestStatus from "../engines/fulfillmentEngine.js";
import { calculateDistanceKm } from "../engines/matchingEngine.js";
import BloodRequest from "../models/BloodRequest.model.js";
import Hospital from "../models/Hospital.model.js";
import { validateVolunteerTransition } from "../models/transitions/volunteerStatus.transitions.js";
import User from "../models/User.model.js";
import VolunteerResponse from "../models/VolunteerResponse.model.js";
import { transitionStatus } from "./request.service.js";

export async function createVolunteerResponse(requestId, donorId, locationAtResponse) {
    const request = await BloodRequest.findOne(
        {
            _id: requestId,
            status: { $in: ['ACTIVE', 'PARTIALLY_FULFILLED'] }
        },
        {
            hospitalId: 1
        }
    );
    if (!request) throw new Error("Request doesn't exist or cannot volunteer");

    const volunteered = await VolunteerResponse.exists({ requestId, donorId })
    if (volunteered) throw new Error('Already a volunteer');

    const user = await User.findOne({ _id: donorId });
    if (!user.bloodGroup || !user.location) throw new Error('bloodGroup or location not available');

    const hospital = await Hospital.findOne({ _id: request.hospitalId }, { coordinates: 1 });
    if (!hospital) throw new Error('Hospital not found');

    const estimatedDistanceKm = calculateDistanceKm(
        locationAtResponse.lat,
        locationAtResponse.lng,
        hospital.coordinates.lat,
        hospital.coordinates.lng
    );

    const donor = await VolunteerResponse.create({
        requestId,
        donorId,
        locationAtResponse,
        estimatedDistanceKm,
    })

    const count = await VolunteerResponse.countDocuments({ requestId });
    if (count === 1) {
        // TODO: createCoordinationRoom()
    }

    return donor;
}

export async function updateVolunteerStatus(responseId, requestorId, newStatus) {
    const volunteerResponse = await VolunteerResponse.findOne({ _id: responseId }, { requestId: 1, status: 1 });
    if (!volunteerResponse) throw new Error('Response not found');

    const request = await BloodRequest.findOne(
        {
            _id: volunteerResponse.requestId,
            createdBy: requestorId
        },
        { status: 1 }
    );
    if (!request) throw new Error('Request not found or permission denied');

    validateVolunteerTransition(volunteerResponse.status, newStatus);
    volunteerResponse.status = newStatus;
    await volunteerResponse.save();

    if (newStatus == 'ACCEPTED') {
        const derivedStatus = await getRequestStatus(volunteerResponse.requestId);
        if (request.status !== derivedStatus) {
            await transitionStatus(volunteerResponse.requestId, derivedStatus);
        }
    }

    return volunteerResponse;
}

export async function withdrawVolunteer(responseId, donorId) {
    const volunteerResponse = await VolunteerResponse.findOne({ _id: responseId, donorId })
    if (!volunteerResponse) throw new Error('Response not found or permission denied');

    const newStatus = 'WITHDRAWN'

    validateVolunteerTransition(volunteerResponse.status, newStatus);
    volunteerResponse.status = newStatus;
    return volunteerResponse.save();
}

export async function getVolunteersForRequest(requestId) {
    const volunteerResponses = await VolunteerResponse.find({ requestId })
        .populate('donorId', 'name bloodGroup');

    return volunteerResponses;
}