import nodemailer from 'nodemailer';
import env from '../config/env.js';
import logger from './logger.js';

const transporter = nodemailer.createTransport({
    host: env.email.host,
    port: env.email.port,
    auth: {
        user: env.email.user,
        pass: env.email.password
    }
})

export async function sendEmail({ to, subject, emailBody }) {
    try {
        logger.info(`[EMAIL] Attempting to send email to ${to} with subject "${subject}"...`);
        const info = await transporter.sendMail({
            from: env.email.from,
            to,
            subject,
            html: emailBody
        });
        logger.info(`[EMAIL SUCCESS] Email sent to ${to}. Message ID: ${info.messageId}`);
        return info;
    } catch (err) {
        logger.error(`[EMAIL ERROR] Failed to send email to ${to}. Check SMTP credentials/API key: ${err.message}`, { error: err });
        throw err;
    }
}