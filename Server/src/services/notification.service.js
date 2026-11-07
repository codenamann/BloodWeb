import env from "../config/env.js";
import Notification from "../models/Notification.model.js";
import bloodRequestTemplate from "../templates/bloodRequest.template.js";
import {
    donorAcceptedEmailTemplate,
    requesterAcceptedEmailTemplate
} from "../templates/volunteerAccepted.template.js";
import {
    donorBackupEmailTemplate,
    requesterBackupEmailTemplate,
    donorBackupRemovedEmailTemplate,
    requesterBackupRemovedEmailTemplate,
    donorAcceptedRemovedEmailTemplate,
    requesterAcceptedRemovedEmailTemplate,
} from "../templates/volunteerStatus.template.js";
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

export async function notifyVolunteerAcceptedMutual({ request, donorUser, requesterUser }) {
    if (!donorUser || !requesterUser) return;

    const requestId = request._id || request.id;
    const hospitalName = request.hospitalId?.name || 'the hospital';
    const hospitalAddress = [request.hospitalId?.address, request.hospitalId?.city].filter(Boolean).join(', ');
    const patientBloodGroup = request.patientBloodGroup || donorUser.bloodGroup || 'compatible';
    const coordinationUrl = `${FRONTEND_URL}/coordination/${requestId}`;

    const donorPhoneText = requesterUser.phone ? `Phone: ${requesterUser.phone}` : 'Phone not set';
    const volunteerPhoneText = donorUser.phone ? `Phone: ${donorUser.phone}` : 'Phone not set';

    // 1. In-App Notification to Volunteer / Donor
    await createInAppNotification({
        userId: donorUser._id,
        type: 'ACTIONABLE',
        title: 'Volunteer Offer Accepted!',
        body: `Your offer to donate at ${hospitalName} was accepted! Coordinator: ${requesterUser.name} (${donorPhoneText}, ${requesterUser.email}). Open Coordination Room to coordinate.`,
        redirectUrl: `/coordination/${requestId}`,
        actions: [
            {
                label: 'Open Coordination Room',
                url: `/coordination/${requestId}`
            }
        ]
    });

    // 2. Email Notification to Volunteer / Donor
    if (donorUser.email) {
        try {
            const donorEmailHtml = donorAcceptedEmailTemplate({
                donorName: donorUser.name,
                requesterName: requesterUser.name,
                requesterPhone: requesterUser.phone,
                requesterEmail: requesterUser.email,
                hospitalName,
                hospitalAddress,
                bloodGroup: patientBloodGroup,
                coordinationUrl,
            });
            await sendEmail({
                to: donorUser.email,
                subject: `BloodWeb — Volunteer Accepted! Contact Details for ${hospitalName}`,
                emailBody: donorEmailHtml,
            });
        } catch (emailErr) {
            logger.warn(`[NOTIFY ACCEPTED WARN] Failed to send email to donor ${donorUser.email}: ${emailErr.message}`);
        }
    }

    // 3. In-App Notification to Requester / Coordinator
    await createInAppNotification({
        userId: requesterUser._id,
        type: 'ACTIONABLE',
        title: 'Donor Accepted — Contact Details',
        body: `You accepted ${donorUser.name} (${donorUser.bloodGroup || patientBloodGroup}). ${volunteerPhoneText}, ${donorUser.email}. Connect now to coordinate.`,
        redirectUrl: `/coordination/${requestId}`,
        actions: [
            {
                label: 'Open Coordination Room',
                url: `/coordination/${requestId}`
            }
        ]
    });

    // 4. Email Notification to Requester / Coordinator
    if (requesterUser.email) {
        try {
            const requesterEmailHtml = requesterAcceptedEmailTemplate({
                requesterName: requesterUser.name,
                donorName: donorUser.name,
                donorPhone: donorUser.phone,
                donorEmail: donorUser.email,
                donorBloodGroup: donorUser.bloodGroup || patientBloodGroup,
                hospitalName,
                coordinationUrl,
            });
            await sendEmail({
                to: requesterUser.email,
                subject: `BloodWeb — Donor Accepted! Contact Details for ${donorUser.name}`,
                emailBody: requesterEmailHtml,
            });
        } catch (emailErr) {
            logger.warn(`[NOTIFY ACCEPTED WARN] Failed to send email to requester ${requesterUser.email}: ${emailErr.message}`);
        }
    }
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

export async function notifyVolunteerBackupMutual({ request, donorUser, requesterUser }) {
    if (!request || !donorUser || !requesterUser) return;
    const requestId = request._id || request;
    const hospitalName = request.hospitalId?.name || 'Hospital';
    const patientBloodGroup = request.patientBloodGroup || donorUser.bloodGroup || 'compatible';
    const coordinationUrl = `${FRONTEND_URL}/coordination/${requestId}`;

    // 1. In-app to Donor
    await createInAppNotification({
        userId: donorUser._id,
        type: 'INFORMATIONAL',
        title: 'Assigned as Backup Donor',
        body: `You are placed on standby as a backup donor for ${hospitalName} (${patientBloodGroup}). Stay ready!`,
        redirectUrl: `/coordination/${requestId}`,
        actions: [{ label: 'View Coordination', url: `/coordination/${requestId}` }],
    });

    // 2. Email to Donor
    if (donorUser.email) {
        try {
            const html = donorBackupEmailTemplate({
                donorName: donorUser.name,
                hospitalName,
                bloodGroup: patientBloodGroup,
                coordinationUrl,
            });
            await sendEmail({
                to: donorUser.email,
                subject: `BloodWeb — Placed on Standby as Backup Donor (${hospitalName})`,
                emailBody: html,
            });
        } catch (err) {
            logger.warn(`[NOTIFY BACKUP WARN] Failed to send email to donor ${donorUser.email}: ${err.message}`);
        }
    }

    // 3. In-app to Requester
    await createInAppNotification({
        userId: requesterUser._id,
        type: 'INFORMATIONAL',
        title: 'Volunteer Moved to Backup',
        body: `${donorUser.name} has been placed on standby as a backup donor for ${hospitalName}.`,
        redirectUrl: `/coordination/${requestId}`,
        actions: [{ label: 'Manage Volunteers', url: `/coordination/${requestId}` }],
    });

    // 4. Email to Requester
    if (requesterUser.email) {
        try {
            const html = requesterBackupEmailTemplate({
                requesterName: requesterUser.name,
                donorName: donorUser.name,
                hospitalName,
                bloodGroup: patientBloodGroup,
                coordinationUrl,
            });
            await sendEmail({
                to: requesterUser.email,
                subject: `BloodWeb — Volunteer ${donorUser.name} Assigned to Backup`,
                emailBody: html,
            });
        } catch (err) {
            logger.warn(`[NOTIFY BACKUP WARN] Failed to send email to requester ${requesterUser.email}: ${err.message}`);
        }
    }
}

export async function notifyVolunteerBackupRemovedMutual({ request, donorUser, requesterUser }) {
    if (!request || !donorUser || !requesterUser) return;
    const requestId = request._id || request;
    const hospitalName = request.hospitalId?.name || 'Hospital';
    const patientBloodGroup = request.patientBloodGroup || donorUser.bloodGroup || 'compatible';
    const coordinationUrl = `${FRONTEND_URL}/coordination/${requestId}`;

    // 1. In-app to Donor
    await createInAppNotification({
        userId: donorUser._id,
        type: 'INFORMATIONAL',
        title: 'Backup Status Updated',
        body: `You have been removed from backup status for ${hospitalName}. Your response is now pending.`,
        redirectUrl: `/coordination/${requestId}`,
    });

    // 2. Email to Donor
    if (donorUser.email) {
        try {
            const html = donorBackupRemovedEmailTemplate({
                donorName: donorUser.name,
                hospitalName,
                bloodGroup: patientBloodGroup,
                coordinationUrl,
            });
            await sendEmail({
                to: donorUser.email,
                subject: `BloodWeb — Status Updated: Backup Status Removed`,
                emailBody: html,
            });
        } catch (err) {
            logger.warn(`[NOTIFY REMOVE BACKUP WARN] Failed to send email to donor ${donorUser.email}: ${err.message}`);
        }
    }

    // 3. In-app to Requester
    await createInAppNotification({
        userId: requesterUser._id,
        type: 'INFORMATIONAL',
        title: 'Volunteer Removed from Backup',
        body: `${donorUser.name} has been removed from backup status and reverted to pending.`,
        redirectUrl: `/coordination/${requestId}`,
    });

    // 4. Email to Requester
    if (requesterUser.email) {
        try {
            const html = requesterBackupRemovedEmailTemplate({
                requesterName: requesterUser.name,
                donorName: donorUser.name,
                hospitalName,
                bloodGroup: patientBloodGroup,
                coordinationUrl,
            });
            await sendEmail({
                to: requesterUser.email,
                subject: `BloodWeb — Volunteer ${donorUser.name} Removed from Backup`,
                emailBody: html,
            });
        } catch (err) {
            logger.warn(`[NOTIFY REMOVE BACKUP WARN] Failed to send email to requester ${requesterUser.email}: ${err.message}`);
        }
    }
}

export async function notifyVolunteerAcceptedRemovedMutual({ request, donorUser, requesterUser }) {
    if (!request || !donorUser || !requesterUser) return;
    const requestId = request._id || request;
    const hospitalName = request.hospitalId?.name || 'Hospital';
    const patientBloodGroup = request.patientBloodGroup || donorUser.bloodGroup || 'compatible';
    const coordinationUrl = `${FRONTEND_URL}/coordination/${requestId}`;

    // 1. In-app to Donor
    await createInAppNotification({
        userId: donorUser._id,
        type: 'INFORMATIONAL',
        title: 'Accepted Volunteer Status Removed',
        body: `Your accepted status for the blood request at ${hospitalName} has been revoked by the requester and reverted to pending.`,
        redirectUrl: `/coordination/${requestId}`,
    });

    // 2. Email to Donor
    if (donorUser.email) {
        try {
            const html = donorAcceptedRemovedEmailTemplate({
                donorName: donorUser.name,
                hospitalName,
                bloodGroup: patientBloodGroup,
                coordinationUrl,
            });
            await sendEmail({
                to: donorUser.email,
                subject: `BloodWeb — Accepted Donation Status Revoked (${hospitalName})`,
                emailBody: html,
            });
        } catch (err) {
            logger.warn(`[NOTIFY REMOVE ACCEPTED WARN] Failed to send email to donor ${donorUser.email}: ${err.message}`);
        }
    }

    // 3. In-app to Requester
    await createInAppNotification({
        userId: requesterUser._id,
        type: 'INFORMATIONAL',
        title: 'Volunteer Removed from Accepted',
        body: `You removed ${donorUser.name} from accepted status. Their status has reverted to pending.`,
        redirectUrl: `/coordination/${requestId}`,
    });

    // 4. Email to Requester
    if (requesterUser.email) {
        try {
            const html = requesterAcceptedRemovedEmailTemplate({
                requesterName: requesterUser.name,
                donorName: donorUser.name,
                hospitalName,
                bloodGroup: patientBloodGroup,
                coordinationUrl,
            });
            await sendEmail({
                to: requesterUser.email,
                subject: `BloodWeb — You Removed ${donorUser.name} from Accepted`,
                emailBody: html,
            });
        } catch (err) {
            logger.warn(`[NOTIFY REMOVE ACCEPTED WARN] Failed to send email to requester ${requesterUser.email}: ${err.message}`);
        }
    }
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