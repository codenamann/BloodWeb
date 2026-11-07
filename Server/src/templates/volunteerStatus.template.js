/**
 * Templates for Volunteer Backup and Status Removal / Reversion notifications.
 */

function baseEmailWrapper({ title, badgeText, badgeBg, badgeColor, heading, bodyContent, ctaUrl, ctaText }) {
    const year = new Date().getFullYear();
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
</head>
<body style="margin:0;padding:40px 0;background:#f5f7fa;font-family:Segoe UI,Arial,sans-serif;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0">
<tr>
<td align="center">
    <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0,0,0,0.05);">
        <!-- Header -->
        <tr>
            <td style="padding:28px 40px;border-bottom:1px solid #eeeeee;background:#ffffff;">
                <h1 style="margin:0;color:#C62828;font-size:28px;font-weight:700;letter-spacing:.4px;">BloodWeb</h1>
                <p style="margin:4px 0 0;color:#6b7280;font-size:13px;">Connecting donors. Saving lives.</p>
            </td>
        </tr>

        <!-- Title -->
        <tr>
            <td style="padding:32px 40px 16px;">
                <div style="display:inline-block;padding:4px 12px;background:${badgeBg};color:${badgeColor};border-radius:20px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;">
                    ${badgeText}
                </div>
                <h2 style="margin:0;color:#111827;font-size:22px;font-weight:700;">${heading}</h2>
            </td>
        </tr>

        <!-- Content -->
        <tr>
            <td style="padding:0 40px 24px;">
                ${bodyContent}

                ${ctaUrl ? `
                <div style="text-align:center;margin:32px 0 16px;">
                    <a href="${ctaUrl}" style="display:inline-block;padding:12px 28px;background:#C62828;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;border-radius:8px;box-shadow:0 2px 4px rgba(198,40,40,0.2);">
                        ${ctaText || 'Open Coordination Room'}
                    </a>
                </div>
                ` : ''}
            </td>
        </tr>

        <!-- Footer -->
        <tr>
            <td style="padding:24px 40px;background:#f9fafb;border-top:1px solid #eeeeee;text-align:center;">
                <p style="margin:0;color:#9ca3af;font-size:12px;">
                    &copy; ${year} BloodWeb. Thank you for making a life-saving difference.
                </p>
            </td>
        </tr>
    </table>
</td>
</tr>
</table>
</body>
</html>`;
}

export function donorBackupEmailTemplate({ donorName, hospitalName, bloodGroup, coordinationUrl }) {
    return baseEmailWrapper({
        title: 'Assigned as Backup Donor',
        badgeText: 'Backup Donor',
        badgeBg: '#fef3c7',
        badgeColor: '#92400e',
        heading: 'You are on Standby as Backup Donor',
        bodyContent: `
            <p style="color:#374151;font-size:15px;line-height:24px;margin:0 0 16px;">
                Hello <strong>${donorName || 'Volunteer'}</strong>,
            </p>
            <p style="color:#4b5563;font-size:14px;line-height:22px;margin:0 0 20px;">
                The requester has kept your response as a <strong>backup donor</strong> for the request of <strong>${bloodGroup}</strong> at <strong>${hospitalName}</strong>.
            </p>
            <p style="color:#4b5563;font-size:14px;line-height:22px;margin:0 0 20px;">
                You may be activated immediately if primary donors are unable to proceed. Please stay available and check the coordination room for updates.
            </p>
        `,
        ctaUrl: coordinationUrl,
        ctaText: 'View Coordination Room',
    });
}

export function requesterBackupEmailTemplate({ requesterName, donorName, hospitalName, bloodGroup, coordinationUrl }) {
    return baseEmailWrapper({
        title: 'Volunteer Moved to Backup',
        badgeText: 'Backup Updated',
        badgeBg: '#fef3c7',
        badgeColor: '#92400e',
        heading: 'Volunteer Assigned to Backup List',
        bodyContent: `
            <p style="color:#374151;font-size:15px;line-height:24px;margin:0 0 16px;">
                Hello <strong>${requesterName || 'Coordinator'}</strong>,
            </p>
            <p style="color:#4b5563;font-size:14px;line-height:22px;margin:0 0 20px;">
                <strong>${donorName || 'A volunteer'}</strong> has been assigned as a <strong>backup donor</strong> for your request of <strong>${bloodGroup}</strong> at <strong>${hospitalName}</strong>.
            </p>
            <p style="color:#4b5563;font-size:14px;line-height:22px;margin:0 0 20px;">
                The volunteer has been notified to remain on standby. You can promote them to accepted anytime from the request coordination room.
            </p>
        `,
        ctaUrl: coordinationUrl,
        ctaText: 'Manage Volunteers',
    });
}

export function donorBackupRemovedEmailTemplate({ donorName, hospitalName, bloodGroup, coordinationUrl }) {
    return baseEmailWrapper({
        title: 'Removed from Backup Status',
        badgeText: 'Status Update',
        badgeBg: '#f3f4f6',
        badgeColor: '#4b5563',
        heading: 'Backup Status Updated',
        bodyContent: `
            <p style="color:#374151;font-size:15px;line-height:24px;margin:0 0 16px;">
                Hello <strong>${donorName || 'Volunteer'}</strong>,
            </p>
            <p style="color:#4b5563;font-size:14px;line-height:22px;margin:0 0 20px;">
                You have been removed from the backup list for the request of <strong>${bloodGroup}</strong> at <strong>${hospitalName}</strong>, and your response status has reverted to pending.
            </p>
            <p style="color:#4b5563;font-size:14px;line-height:22px;margin:0 0 20px;">
                Thank you for your willingness to help. You can view the request details below.
            </p>
        `,
        ctaUrl: coordinationUrl,
        ctaText: 'View Request Details',
    });
}

export function requesterBackupRemovedEmailTemplate({ requesterName, donorName, hospitalName, bloodGroup, coordinationUrl }) {
    return baseEmailWrapper({
        title: 'Volunteer Removed as Backup',
        badgeText: 'Backup Reverted',
        badgeBg: '#f3f4f6',
        badgeColor: '#4b5563',
        heading: 'Volunteer Removed from Backup',
        bodyContent: `
            <p style="color:#374151;font-size:15px;line-height:24px;margin:0 0 16px;">
                Hello <strong>${requesterName || 'Coordinator'}</strong>,
            </p>
            <p style="color:#4b5563;font-size:14px;line-height:22px;margin:0 0 20px;">
                <strong>${donorName || 'A volunteer'}</strong> has been removed from backup status and reverted to pending for your request of <strong>${bloodGroup}</strong> at <strong>${hospitalName}</strong>.
            </p>
        `,
        ctaUrl: coordinationUrl,
        ctaText: 'View Request Coordination',
    });
}

export function donorAcceptedRemovedEmailTemplate({ donorName, hospitalName, bloodGroup, coordinationUrl }) {
    return baseEmailWrapper({
        title: 'Accepted Donation Status Revoked',
        badgeText: 'Status Update',
        badgeBg: '#fee2e2',
        badgeColor: '#991b1b',
        heading: 'Accepted Status Removed',
        bodyContent: `
            <p style="color:#374151;font-size:15px;line-height:24px;margin:0 0 16px;">
                Hello <strong>${donorName || 'Volunteer'}</strong>,
            </p>
            <p style="color:#4b5563;font-size:14px;line-height:22px;margin:0 0 20px;">
                Your accepted volunteer status for the request of <strong>${bloodGroup}</strong> at <strong>${hospitalName}</strong> has been removed by the coordinator and reverted to pending.
            </p>
            <p style="color:#4b5563;font-size:14px;line-height:22px;margin:0 0 20px;">
                If you believe this was an error, you can check the coordination room or reach out to the requester.
            </p>
        `,
        ctaUrl: coordinationUrl,
        ctaText: 'View Coordination Room',
    });
}

export function requesterAcceptedRemovedEmailTemplate({ requesterName, donorName, hospitalName, bloodGroup, coordinationUrl }) {
    return baseEmailWrapper({
        title: 'Volunteer Removed from Accepted',
        badgeText: 'Status Update',
        badgeBg: '#fee2e2',
        badgeColor: '#991b1b',
        heading: 'Volunteer Removed from Accepted',
        bodyContent: `
            <p style="color:#374151;font-size:15px;line-height:24px;margin:0 0 16px;">
                Hello <strong>${requesterName || 'Coordinator'}</strong>,
            </p>
            <p style="color:#4b5563;font-size:14px;line-height:22px;margin:0 0 20px;">
                You have removed <strong>${donorName || 'the volunteer'}</strong> from accepted status for your request of <strong>${bloodGroup}</strong> at <strong>${hospitalName}</strong>. The volunteer's status has reverted to pending.
            </p>
        `,
        ctaUrl: coordinationUrl,
        ctaText: 'Manage Volunteers',
    });
}
