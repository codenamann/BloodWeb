import crypto from 'crypto';

export function generateOtp(length) {
    let otp = '';

    for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10);
    }

    return otp;
}

export function hashOtp(otp) {
    return crypto.createHash('sha256').update(otp).digest('hex');
}
