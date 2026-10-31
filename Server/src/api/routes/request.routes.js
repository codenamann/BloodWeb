import { Router } from 'express';
import authenticate from '../../middleware/authenticate.js';
import {
    handleCreateRequest,
    handleGetMyRequests,
    handleGetAllRequests,
    handleGetRequestById,
    handleCancelRequest
} from '../controllers/request.controller.js';
import uploadHandler from '../../middleware/uploadHandler.js';

const router = Router();

// Get current user's requests
router.get('/my', authenticate, handleGetMyRequests);

// Get all requests (feed / network)
router.get('/', authenticate, handleGetAllRequests);

// Create a new request
router.post(
    '/',
    authenticate,
    uploadHandler,
    handleCreateRequest
);

// Get specific request by ID
router.get('/:id', authenticate, handleGetRequestById);

// Cancel a request
router.patch('/:id/cancel', authenticate, handleCancelRequest);

export default router;
