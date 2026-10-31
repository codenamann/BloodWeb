import { Router } from 'express';
import authenticate from '../../middleware/authenticate.js';
import {
    handleCreateRequest,
    handleGetMyRequests,
    handleGetAllRequests,
    handleGetRequestById,
    handleCancelRequest,
    handleCompleteRequest
} from '../controllers/request.controller.js';
import {
    handleCreateVolunteerResponse,
    handleGetVolunteersForRequest
} from '../controllers/volunteer.controller.js';
import uploadHandler from '../../middleware/uploadHandler.js';
import rateLimit from 'express-rate-limit';

const router = Router();

// Get current user's requests
router.get('/my', authenticate, handleGetMyRequests);

// Get all requests (feed / network)
router.get('/', authenticate, handleGetAllRequests);

// Create a new request
router.post(
    '/',
    // rateLimit({
    //     windowMs: 24 * 60 * 60 * 1000,
    //     max: 1,
    //     message: 'You can only create one request per day',
    // }),
    authenticate,
    uploadHandler,
    handleCreateRequest
);

// Get specific request by ID
router.get('/:id', authenticate, handleGetRequestById);

// Volunteer for a request
router.post('/:id/volunteer', authenticate, handleCreateVolunteerResponse);

// Get volunteers for a request
router.get('/:id/volunteers', authenticate, handleGetVolunteersForRequest);

// Cancel a request
router.patch('/:id/cancel', authenticate, handleCancelRequest);

// Complete a request (requester confirms donation completed)
router.patch('/:id/complete', authenticate, handleCompleteRequest);

export default router;
