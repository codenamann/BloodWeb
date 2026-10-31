import asyncHandler from "../../middleware/asyncHandler.js";
import AppError from "../../middleware/appError.js";
import {
    createVolunteerResponse,
    updateVolunteerStatus,
    withdrawVolunteer,
    getVolunteersForRequest
} from "../../services/volunteer.service.js";

export const handleCreateVolunteerResponse = asyncHandler(async (req, res) => {
    const requestId = req.params.id || req.params.requestId;
    const donorId = req.user.id;
    const locationAtResponse = req.body.locationAtResponse || req.body.location || null;

    const volunteer = await createVolunteerResponse(requestId, donorId, locationAtResponse);

    res.status(201).json({
        status: "success",
        message: "Successfully volunteered for blood request",
        data: {
            volunteer
        }
    });
});

export const handleUpdateVolunteerStatus = asyncHandler(async (req, res) => {
    const responseId = req.params.id || req.params.responseId;
    const requestorId = req.user.id;
    const { status } = req.body;

    if (!status) {
        throw new AppError("Status is required", 400);
    }

    const volunteer = await updateVolunteerStatus(responseId, requestorId, status);

    res.status(200).json({
        status: "success",
        message: `Volunteer status updated to ${status}`,
        data: {
            volunteer
        }
    });
});

export const handleWithdrawVolunteer = asyncHandler(async (req, res) => {
    const responseId = req.params.id || req.params.responseId;
    const donorId = req.user.id;

    const volunteer = await withdrawVolunteer(responseId, donorId);

    res.status(200).json({
        status: "success",
        message: "Volunteer response withdrawn successfully",
        data: {
            volunteer
        }
    });
});

export const handleGetVolunteersForRequest = asyncHandler(async (req, res) => {
    const requestId = req.params.id || req.params.requestId;

    const volunteers = await getVolunteersForRequest(requestId);

    res.status(200).json({
        status: "success",
        data: {
            volunteers
        }
    });
});
