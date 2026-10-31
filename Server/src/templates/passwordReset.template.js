export default function passwordResetTemplate({
    userName = 'User',
    otp,
    expiresIn = 10,
}) {
    const year = new Date().getFullYear();

    return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Reset Your BloodWeb Password</title>
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

            <tr>
                <td style="padding:28px 40px;border-bottom:1px solid #eeeeee;">
                    <h1 style="
                        margin:0;
                        color:#C62828;
                        font-size:30px;
                        font-weight:700;">
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

            <tr>
                <td style="padding:35px 40px 10px;">
                    <h2 style="
                        margin:0;
                        color:#1f2937;
                        font-size:24px;
                        font-weight:600;">
                        Password Reset Request
                    </h2>
                </td>
            </tr>

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
                        line-height:28px;">
                        We received a request to reset your BloodWeb account password. Use the single-use 6-digit code below to set a new password:
                    </p>
                </td>
            </tr>

            <tr>
                <td align="center" style="padding:20px 40px 30px;">
                    <div style="
                        display:inline-block;
                        padding:16px 30px;
                        border:1px solid #e5e7eb;
                        border-radius:8px;
                        background:#fafafa;
                        color:#C62828;
                        font-size:32px;
                        font-weight:700;
                        letter-spacing:8px;">
                        ${otp}
                    </div>

                    <p style="
                        margin-top:14px;
                        color:#9ca3af;
                        font-size:13px;">
                        Valid for ${expiresIn} minutes • Single-use code
                    </p>
                </td>
            </tr>

            <tr>
                <td style="padding:0 40px 30px;">
                    <p style="
                        margin:0;
                        color:#6b7280;
                        font-size:14px;
                        line-height:22px;">
                        If you did not request a password reset, you can safely ignore this email. Your account password remains unchanged.
                    </p>
                </td>
            </tr>

            <tr>
                <td style="
                    background:#f9fafb;
                    border-top:1px solid #eeeeee;
                    padding:20px 40px;
                    text-align:center;
                    font-size:12px;
                    color:#9ca3af;">
                    &copy; ${year} BloodWeb. All rights reserved.
                </td>
            </tr>

        </table>

        </td>
        </tr>
        </table>

        </body>
        </html>`;
}
