import express from 'express';
import authenticate from '../../middleware/authenticate.js';
import {
    handleGetNotifications,
    handleMarkAsRead,
    handleMarkAllAsRead,
} from '../controllers/notification.controller.js';

const router = express.Router();

router.use(authenticate);

router.get('/', handleGetNotifications);
router.patch('/read-all', handleMarkAllAsRead);
router.patch('/:id/read', handleMarkAsRead);

export default router;
