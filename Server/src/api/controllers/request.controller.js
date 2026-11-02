import {
    createRequest,
    getRequestByUser,
    getAllRequests,
    getRequestById,
    cancelRequest,
    completeRequest
} from '../../services/request.service.js';
import { processUploadedDocument } from '../../services/document.service.js';
import asyncHandler from '../../middleware/asyncHandler.js';
import AppError from '../../middleware/appError.js';
import logger from '../../utils/logger.js';
import mongoose from 'mongoose';

export const handleCreateRequest = asyncHandler(async (req, res) => {
    let documentMetadata = null;

    // Process document if uploaded
    if (req.file) {
        documentMetadata = await processUploadedDocument(req.file);
    } else {
        throw new AppError('Hospital document is required', 400);
    }

    // Extract form data
    const requestData = {
        patientBloodGroup: req.body.patientBloodGroup,
        unitsNeeded: parseInt(req.body.unitsNeeded, 10),
        hospitalId: req.body.hospitalId,
        urgency: req.body.urgency,
        neededBy: req.body.neededBy,
        patientCondition: req.body.patientCondition,
        hospitalDocument: documentMetadata
    };

    logger.debug(`[DEBUG] handleCreateRequest - requestData: ${JSON.stringify(requestData)}`);

    // User is guaranteed to exist by authenticate middleware
    const createdBy = req.user.id;
    logger.debug(`[DEBUG] handleCreateRequest - createdBy: ${createdBy}`);

    const request = await createRequest(requestData, createdBy);
    logger.debug(`[DEBUG] handleCreateRequest - Success: ${request._id}`);

    res.status(201).json({
        status: 'success',
        message: 'Blood request created successfully',
        data: {
            request
        }
    });
});

export const handleGetMyRequests = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { page, limit, status, bloodGroup, search } = req.query;
    const result = await getRequestByUser(userId, { page, limit, status, bloodGroup, search });

    res.status(200).json({
        status: 'success',
        data: result
    });
});

export const handleGetAllRequests = asyncHandler(async (req, res) => {
    const userId = req.user?.id || req.user?._id;
    const { status, bloodGroup, page, limit, search } = req.query;
    const result = await getAllRequests({
        status,
        bloodGroup,
        page,
        limit,
        search,
        userId
    });

    res.status(200).json({
        status: 'success',
        data: result
    });
});

export const handleGetRequestById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError('Invalid request ID format', 400);
    }

    const request = await getRequestById(id, userId);

    res.status(200).json({
        status: 'success',
        data: {
            request
        }
    });
});

export const handleCancelRequest = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError('Invalid request ID format', 400);
    }

    const request = await cancelRequest(id, userId);

    res.status(200).json({
        status: 'success',
        message: 'Blood request cancelled successfully',
        data: {
            request
        }
    });
});

export const handleCompleteRequest = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError('Invalid request ID format', 400);
    }

    const request = await completeRequest(id, userId);

    res.status(200).json({
        status: 'success',
        message: 'Blood request completed successfully',
        data: {
            request
        }
    });
});

