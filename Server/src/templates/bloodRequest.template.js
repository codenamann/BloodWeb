export default function bloodRequestTemplate({
    title,
    userName,
    bloodGroup,
    hospital,
    units,
    urgency,
    redirectUrl,
}) {
    const year = new Date().getFullYear();

    const emailFormat = `<!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <title>BloodWeb Notification</title>
    </head>

    <body style="margin:0;padding:40px 0;background:#f5f7fa;font-family:Segoe UI,Arial,sans-serif;">

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
    <tr>
    <td align="center">

    <table role="presentation"
        width="600"
        cellspacing="0"
        cellpadding="0"
        style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">

        <!-- Header -->
        <tr>
            <td style="padding:28px 40px;border-bottom:1px solid #eeeeee;">

                <h1 style="
                    margin:0;
                    color:#C62828;
                    font-size:30px;
                    font-weight:700;
                    letter-spacing:.4px;">
                    BloodWeb
                </h1>

                <p style="
                    margin:6px 0 0;
                    color:#6b7280;
                    font-size:14px;">
                    Connecting donors. Saving lives.
                </p>

            </td>
        </tr>

        <!-- Title -->
        <tr>
            <td style="padding:35px 40px 10px;">

                <h2 style="
                    margin:0;
                    color:#1f2937;
                    font-size:24px;
                    font-weight:600;">

                    ${title}

                </h2>

            </td>
        </tr>

        <!-- Greeting -->
        <tr>
            <td style="padding:0 40px;">

                <p style="
                    color:#374151;
                    font-size:16px;
                    line-height:28px;">

                    Hello ${userName},

                </p>

                <p style="
                    color:#4b5563;
                    font-size:15px;
                    line-height:28px;
                    margin-top:20px;">

                    You have a new blood request for ${bloodGroup} at ${hospital}. Please check the app for more details.

                </p>

            </td>
        </tr>

        <!-- Information Card -->
        <tr>
            <td style="padding:20px 40px;">

                <table width="100%"
                    cellspacing="0"
                    cellpadding="0"
                    style="
                    border:1px solid #ececec;
                    border-radius:8px;
                    background:#fafafa;">

                    <tr>
                        <td style="padding:18px;">

                            <table width="100%">

                                <tr>
                                    <td style="padding:6px 0;color:#6b7280;">
                                        Blood Group
                                    </td>

                                    <td align="right"
                                        style="font-weight:600;color:#111827;">
                                        ${bloodGroup}
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding:6px 0;color:#6b7280;">
                                        Hospital
                                    </td>

                                    <td align="right"
                                        style="font-weight:600;color:#111827;">
                                        ${hospital}
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding:6px 0;color:#6b7280;">
                                        Units Required
                                    </td>

                                    <td align="right"
                                        style="font-weight:600;color:#111827;">
                                        ${units}
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding:6px 0;color:#6b7280;">
                                        Urgency
                                    </td>

                                    <td align="right">

                                        <span style="
                                        display:inline-block;
                                        padding:6px 12px;
                                        border-radius:50px;
                                        background:#fdecec;
                                        color:#c62828;
                                        font-weight:600;
                                        font-size:13px;">

                                            ${urgency}

                                        </span>

                                    </td>

                                </tr>

                            </table>

                        </td>
                    </tr>

                </table>

            </td>
        </tr>

        <!-- CTA -->
        <tr>
            <td align="center"
                style="padding:10px 40px 35px;">

                <a href="${redirectUrl}"
                style="
                display:inline-block;
                padding:14px 34px;
                background:#C62828;
                color:#ffffff;
                text-decoration:none;
                border-radius:8px;
                font-size:15px;
                font-weight:600;">

                    View Request

                </a>

            </td>
        </tr>

        <!-- Note -->
        <tr>
            <td style="
                padding:0 40px 35px;
                color:#6b7280;
                font-size:13px;
                line-height:24px;">

                If you're currently unavailable to donate, no action is required.
                You can simply ignore this notification.

            </td>
        </tr>

        <!-- Footer -->
        <tr>
            <td style="
                border-top:1px solid #eeeeee;
                padding:24px 40px;
                color:#9ca3af;
                font-size:12px;
                line-height:22px;">

                This is an automated notification from BloodWeb.
                Please do not reply to this email.

                <br><br>

                © ${year} BloodWeb. All rights reserved.

            </td>
        </tr>

    </table>

    </td>
    </tr>
    </table>

    </body>
    </html>`;

    return emailFormat;
}