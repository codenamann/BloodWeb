import nodemailer from 'nodemailer';
import env from '../config/env.js';

const transporter = nodemailer.createTransport({
    host: env.email.host,
    port: env.email.port,
    auth: {
        user: env.email.user,
        pass: env.email.password
    }
})

export async function sendEmail({ to, subject, emailBody }) {
    return await transporter.sendMail({
        from: env.email.from,
        to,
        subject,
        html: emailBody
    })
}