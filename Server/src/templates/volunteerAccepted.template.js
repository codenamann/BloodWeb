export function donorAcceptedEmailTemplate({
    donorName,
    requesterName,
    requesterPhone,
    requesterEmail,
    hospitalName,
    hospitalAddress,
    bloodGroup,
    coordinationUrl,
}) {
    const year = new Date().getFullYear();

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Volunteer Offer Accepted</title>
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
                <div style="display:inline-block;padding:4px 12px;background:#ecfdf5;color:#065f46;border-radius:20px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;">
                    Volunteer Accepted
                </div>
                <h2 style="margin:0;color:#111827;font-size:22px;font-weight:700;">Your Donation Offer Was Accepted!</h2>
            </td>
        </tr>

        <!-- Content -->
        <tr>
            <td style="padding:0 40px 24px;">
                <p style="color:#374151;font-size:15px;line-height:24px;margin:0 0 16px;">
                    Hello <strong>${donorName || 'Volunteer'}</strong>,
                </p>
                <p style="color:#4b5563;font-size:14px;line-height:22px;margin:0 0 20px;">
                    The coordinator has accepted your offer to donate <strong>${bloodGroup}</strong> blood at <strong>${hospitalName}</strong>. Below are the coordinator's contact details so you can align on your arrival:
                </p>

                <!-- Coordinator Contact Box -->
                <div style="background:#fef2f2;border:1px solid #fee2e2;border-radius:8px;padding:20px;margin-bottom:24px;">
                    <div style="font-size:11px;font-weight:700;color:#991b1b;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;">
                        Coordinator Contact Details
                    </div>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;color:#1f2937;">
                        <tr>
                            <td style="padding:4px 0;width:120px;color:#6b7280;">Name:</td>
                            <td style="padding:4px 0;font-weight:600;">${requesterName || 'Request Coordinator'}</td>
                        </tr>
                        <tr>
                            <td style="padding:4px 0;color:#6b7280;">Phone:</td>
                            <td style="padding:4px 0;font-weight:600;">
                                ${requesterPhone ? `<a href="tel:${requesterPhone}" style="color:#C62828;text-decoration:none;">${requesterPhone}</a>` : 'Not provided'}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:4px 0;color:#6b7280;">Email:</td>
                            <td style="padding:4px 0;font-weight:600;">
                                <a href="mailto:${requesterEmail}" style="color:#C62828;text-decoration:none;">${requesterEmail}</a>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:4px 0;color:#6b7280;">Hospital:</td>
                            <td style="padding:4px 0;font-weight:600;">${hospitalName}${hospitalAddress ? ` (${hospitalAddress})` : ''}</td>
                        </tr>
                    </table>
                </div>

                <!-- CTA Button -->
                <div style="text-align:center;margin:32px 0;">
                    <a href="${coordinationUrl}" style="background:#C62828;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;display:inline-block;box-shadow:0 2px 4px rgba(198,40,40,0.25);">
                        Open Coordination Room
                    </a>
                </div>

                <p style="color:#6b7280;font-size:13px;line-height:20px;margin:0;">
                    You can also use the in-app coordination room chat to communicate in real-time or announce your departure when you start traveling.
                </p>
            </td>
        </tr>

        <!-- Footer -->
        <tr>
            <td style="padding:20px 40px;background:#f9fafb;border-top:1px solid #eeeeee;text-align:center;">
                <p style="margin:0;color:#9ca3af;font-size:12px;">&copy; ${year} BloodWeb Platform. Thank you for your lifesaving support.</p>
            </td>
        </tr>
    </table>
</td>
</tr>
</table>
</body>
</html>`;
}

export function requesterAcceptedEmailTemplate({
    requesterName,
    donorName,
    donorPhone,
    donorEmail,
    donorBloodGroup,
    hospitalName,
    coordinationUrl,
}) {
    const year = new Date().getFullYear();

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Donor Accepted & Contact Details</title>
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
                <div style="display:inline-block;padding:4px 12px;background:#eff6ff;color:#1e40af;border-radius:20px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;">
                    Donor Confirmed
                </div>
                <h2 style="margin:0;color:#111827;font-size:22px;font-weight:700;">Volunteer Donor Confirmed!</h2>
            </td>
        </tr>

        <!-- Content -->
        <tr>
            <td style="padding:0 40px 24px;">
                <p style="color:#374151;font-size:15px;line-height:24px;margin:0 0 16px;">
                    Hello <strong>${requesterName || 'Coordinator'}</strong>,
                </p>
                <p style="color:#4b5563;font-size:14px;line-height:22px;margin:0 0 20px;">
                    You have accepted <strong>${donorName}</strong> (${donorBloodGroup || 'Donor'}) for your blood request at <strong>${hospitalName}</strong>. Here are the donor's contact details:
                </p>

                <!-- Donor Contact Box -->
                <div style="background:#f0fdf4;border:1px solid #dcfce7;border-radius:8px;padding:20px;margin-bottom:24px;">
                    <div style="font-size:11px;font-weight:700;color:#166534;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;">
                        Accepted Donor Contact Details
                    </div>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;color:#1f2937;">
                        <tr>
                            <td style="padding:4px 0;width:120px;color:#6b7280;">Donor Name:</td>
                            <td style="padding:4px 0;font-weight:600;">${donorName}</td>
                        </tr>
                        <tr>
                            <td style="padding:4px 0;color:#6b7280;">Blood Group:</td>
                            <td style="padding:4px 0;font-weight:600;color:#C62828;">${donorBloodGroup || 'Compatible'}</td>
                        </tr>
                        <tr>
                            <td style="padding:4px 0;color:#6b7280;">Phone:</td>
                            <td style="padding:4px 0;font-weight:600;">
                                ${donorPhone ? `<a href="tel:${donorPhone}" style="color:#059669;text-decoration:none;">${donorPhone}</a>` : 'Not provided'}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:4px 0;color:#6b7280;">Email:</td>
                            <td style="padding:4px 0;font-weight:600;">
                                <a href="mailto:${donorEmail}" style="color:#059669;text-decoration:none;">${donorEmail}</a>
                            </td>
                        </tr>
                    </table>
                </div>

                <!-- CTA Button -->
                <div style="text-align:center;margin:32px 0;">
                    <a href="${coordinationUrl}" style="background:#C62828;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;display:inline-block;box-shadow:0 2px 4px rgba(198,40,40,0.25);">
                        Open Coordination Room
                    </a>
                </div>

                <p style="color:#6b7280;font-size:13px;line-height:20px;margin:0;">
                    You can contact the donor directly or chat with them inside the coordination room to prepare for donation.
                </p>
            </td>
        </tr>

        <!-- Footer -->
        <tr>
            <td style="padding:20px 40px;background:#f9fafb;border-top:1px solid #eeeeee;text-align:center;">
                <p style="margin:0;color:#9ca3af;font-size:12px;">&copy; ${year} BloodWeb Platform. Saving lives together.</p>
            </td>
        </tr>
    </table>
</td>
</tr>
</table>
</body>
</html>`;
}
