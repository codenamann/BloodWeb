import env from "../config/env.js";
import Notification from "../models/Notification.model.js";
import bloodRequestTemplate from "../templates/bloodRequest.template.js";
import { sendEmail } from "../utils/email.js";
import logger from "../utils/logger.js";
import { emitToUser } from "../utils/socket.js";

const FRONTEND_URL = env.app.frontendUrl;

export async function notifyDonors(donors, request) {
    const notification = buildNotification(request);
    const emailBody = buildBloodRequestEmail(request);

    const results = await Promise.allSettled(
        donors.map((donor) =>
            sendNotification(
                {
                    ...notification,
                    userId: donor._id,
                },
                {
                    to: donor.email,
                    subject: notification.title,
                    emailBody,
                }
            )
        )
    );

    // Log any errors from email/notification delivery
    results.forEach((result, index) => {
        if (result.status === 'rejected') {
            logger.error(`[NOTIFICATION ERROR] Failed to notify donor ${donors[index].email}: ${result.reason}`, { error: result.reason });
        }
    });
}

export async function sendNotification(notification, emailOptions = null) {
    const createdNotification = await Notification.create(notification);

    if (createdNotification.channel === 'EMAIL' && emailOptions) {
        try {
            await sendEmail(emailOptions);
            createdNotification.delivered = true;
            await createdNotification.save();
        } catch (err) {
            logger.warn(`[NOTIFICATION EMAIL WARN] Failed to dispatch email: ${err.message}`);
        }
    } else {
        createdNotification.delivered = true;
        await createdNotification.save();
    }

    // Push real-time event to connected user socket
    emitToUser(createdNotification.userId, 'NEW_NOTIFICATION', createdNotification);

    return createdNotification;
}

export async function createInAppNotification(data) {
    try {
        const notifPayload = {
            ...data,
            channel: data.channel || 'PUSH',
            delivered: true,
        };
        const created = await Notification.create(notifPayload);
        emitToUser(created.userId, 'NEW_NOTIFICATION', created);
        return created;
    } catch (err) {
        logger.error(`[IN-APP NOTIF ERROR] Failed to create notification: ${err.message}`);
        return null;
    }
}

export async function markAsRead(notificationId, userId) {
    const notification = await Notification.findById(notificationId);

    if (!notification) throw new Error('Notification not found');
    if (notification.userId.toString() !== userId.toString()) {
        throw new Error('You are not authorized to mark this notification as read');
    }

    notification.read = true;
    await notification.save();
    return notification;
}

export async function markAllAsRead(userId) {
    await Notification.updateMany({ userId }, { $set: { read: true } });
    return { success: true };
}

export async function getNotifications(userId) {
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(50).lean();
    return notifications;
}

// -------------------------------------------------------------
// Specialized Lifecycle Notification Triggers
// -------------------------------------------------------------

export async function notifyVolunteerResponse(request, donor) {
    const creatorId = request.createdBy?._id || request.createdBy;
    if (!creatorId) return;

    await createInAppNotification({
        userId: creatorId,
        type: 'ACTIONABLE',
        title: 'New Volunteer Response',
        body: `${donor.name || 'A donor'} (${donor.bloodGroup || request.patientBloodGroup}) volunteered for your blood request.`,
        redirectUrl: `/requests/${request._id}`,
        actions: [
            {
                label: 'Review Volunteer',
                url: `/requests/${request._id}`
            }
        ]
    });
}

export async function notifyVolunteerAccepted(requestId, donorId, hospitalName = 'Hospital') {
    if (!donorId) return;

    await createInAppNotification({
        userId: donorId,
        type: 'ACTIONABLE',
        title: 'Volunteer Offer Accepted!',
        body: `Your offer to donate at ${hospitalName} was accepted. Enter the Coordination Room to coordinate.`,
        redirectUrl: `/coordination/${requestId}`,
        actions: [
            {
                label: 'Open Coordination Room',
                url: `/coordination/${requestId}`
            }
        ]
    });
}

export async function notifyVolunteerBackup(requestId, donorId, hospitalName = 'Hospital') {
    if (!donorId) return;

    await createInAppNotification({
        userId: donorId,
        type: 'INFORMATIONAL',
        title: 'Assigned as Backup Donor',
        body: `You are placed on standby as a backup donor for the request at ${hospitalName}. Thank you for your support!`,
        redirectUrl: `/requests/${requestId}`
    });
}

export async function notifyVolunteerWithdrawn(requestId, creatorId, donorName = 'A volunteer') {
    if (!creatorId) return;

    await createInAppNotification({
        userId: creatorId,
        type: 'INFORMATIONAL',
        title: 'Accepted Volunteer Withdrawn',
        body: `${donorName} has withdrawn their volunteer offer. Your request fulfillment has been adjusted.`,
        redirectUrl: `/requests/${requestId}`
    });
}

export async function notifyRequestCancelled(requestId, volunteerIds = [], hospitalName = 'Hospital') {
    if (!volunteerIds || volunteerIds.length === 0) return;

    await Promise.allSettled(
        volunteerIds.map((userId) =>
            createInAppNotification({
                userId,
                type: 'INFORMATIONAL',
                title: 'Blood Request Cancelled',
                body: `The blood request at ${hospitalName} was cancelled by the requester.`,
                redirectUrl: `/requests/${requestId}`
            })
        )
    );
}

export async function notifyRequestCompleted(requestId, acceptedDonorIds = [], hospitalName = 'Hospital') {
    if (!acceptedDonorIds || acceptedDonorIds.length === 0) return;

    await Promise.allSettled(
        acceptedDonorIds.map((userId) =>
            createInAppNotification({
                userId,
                type: 'INFORMATIONAL',
                title: 'Donation Completed — Thank You!',
                body: `The blood request at ${hospitalName} was successfully completed. Thank you for your life-saving gift!`,
                redirectUrl: `/requests/${requestId}`
            })
        )
    );
}

export function buildNotification(request) {
    const { patientBloodGroup, hospitalId, _id } = request;
    const hospName = hospitalId?.name || 'Hospital';
    return {
        title: 'New Blood Request',
        type: 'ACTIONABLE',
        channel: 'EMAIL',
        body: `You have a new blood request for ${patientBloodGroup} at ${hospName}. Please check the app for more details.`,
        redirectUrl: `${FRONTEND_URL}/requests/${_id}`,
        actions: [
            {
                label: 'Volunteer',
                url: `${FRONTEND_URL}/requests/${_id}`
            }
        ]
    };
}

export function buildBloodRequestEmail(request) {
    const { patientBloodGroup, hospitalId, createdBy, unitsNeeded, urgency, _id } = request;
    return bloodRequestTemplate({
        title: 'New Blood Request',
        userName: createdBy?.name || 'Requester',
        bloodGroup: patientBloodGroup,
        hospital: hospitalId?.name || 'Hospital',
        units: unitsNeeded,
        urgency,
        redirectUrl: `${FRONTEND_URL}/requests/${_id}`,
    });
}