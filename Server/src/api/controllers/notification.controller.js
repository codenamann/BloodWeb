import asyncHandler from '../../utils/asyncHandler.js';
import {
    getNotifications,
    markAsRead,
    markAllAsRead,
} from '../../services/notification.service.js';

export const handleGetNotifications = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const notifications = await getNotifications(userId);
    res.status(200).json({
        status: 'success',
        data: {
            notifications,
        },
    });
});

export const handleMarkAsRead = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const { id } = req.params;
    const updated = await markAsRead(id, userId);
    res.status(200).json({
        status: 'success',
        data: {
            notification: updated,
        },
    });
});

export const handleMarkAllAsRead = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    await markAllAsRead(userId);
    res.status(200).json({
        status: 'success',
        message: 'All notifications marked as read',
    });
});
