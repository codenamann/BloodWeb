import env from "../config/env.js";
import Notification from "../models/Notification.model.js"
import bloodRequestTemplate from "../templates/bloodRequest.template.js";
import { sendEmail } from "../utils/email.js";
import logger from "../utils/logger.js";

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
                    emailBody
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

export async function sendNotification(notification, emailOptions) {
    // Create a new notification for each donor
    const createdNotification = await Notification.create(notification);

    if (createdNotification.channel !== 'EMAIL') throw new Error('Only EMAIL channel is supported for now');
    await sendEmail(emailOptions);

    createdNotification.delivered = true;
    await createdNotification.save();
}

export async function markAsRead(notificationId, userId) {
    const notification = await Notification.findById(notificationId);

    if (!notification) throw new Error('Notification not found');
    if (notification.userId.toString() !== userId) {
        throw new Error('You are not authorized to mark this notification as read');
    }

    notification.read = true;
    await notification.save();
}

export async function getNotifications(userId) {
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    return notifications;
}

export function buildNotification(request) {
    const { patientBloodGroup, hospitalId, _id } = request;
    return {
        title: 'New Blood Request',
        type: 'ACTIONABLE',
        channel: 'EMAIL',
        body: `You have a new blood request for ${patientBloodGroup} at ${hospitalId.name}. Please check the app for more details.`,
        redirectUrl: `${FRONTEND_URL}/requests/${_id}`,
        actions: [
            {
                label: 'Volunteer',
                url: `${FRONTEND_URL}/requests/${_id}`
            }
        ]
    }
}

export function buildBloodRequestEmail(request) {
    const { patientBloodGroup, hospitalId, createdBy, unitsNeeded, urgency, _id } = request;
    return bloodRequestTemplate({
        title: 'New Blood Request',
        userName: createdBy.name,
        bloodGroup: patientBloodGroup,
        hospital: hospitalId.name,
        units: unitsNeeded,
        urgency,
        redirectUrl: `${FRONTEND_URL}/requests/${_id}`,
    });
}