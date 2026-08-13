export default function otpTemplate({
    userName,
    otp,
    expiresIn,
}) {
    const year = new Date().getFullYear();

    return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>BloodWeb Verification Code</title>
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
                        Verify your email
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
                        Use the verification code below to continue with BloodWeb.
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
                        font-size:30px;
                        font-weight:700;
                        letter-spacing:8px;">
                        ${otp}
                    </div>

                    <p style="
                        margin:14px 0 0;
                        color:#6b7280;
                        font-size:13px;">
                        This code expires in ${expiresIn}.
                    </p>

                </td>
            </tr>

            <tr>
                <td style="
                    padding:0 40px 35px;
                    color:#6b7280;
                    font-size:13px;
                    line-height:24px;">

                    If you did not request this code, you can safely ignore this email.

                </td>
            </tr>

            <tr>
                <td style="
                    border-top:1px solid #eeeeee;
                    padding:24px 40px;
                    color:#9ca3af;
                    font-size:12px;
                    line-height:22px;">

                    This is an automated email from BloodWeb.
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
}