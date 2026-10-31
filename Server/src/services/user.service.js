import AppError from "../middleware/appError.js";
import User from "../models/User.model.js";
import otpTemplate from "../templates/otp.template.js";
import passwordResetTemplate from "../templates/passwordReset.template.js";
import { sendEmail } from "../utils/email.js";
import { generateOtp, hashOtp } from "../utils/otp.js";
import jwt from "jsonwebtoken";
import env from "../config/env.js";

const OTP_EXPIRES_AT = 5; // minutes

export async function createUser({ name, email, password }) {
    const normalizedEmail = (email || '').trim().toLowerCase();
    if (await User.exists({ email: normalizedEmail })) throw new AppError('User already exists. Please login.', 400);

    const otp = generateOtp(6);
    const otpExpiresAt = new Date(Date.now() + OTP_EXPIRES_AT * 60 * 1000)

    const user = await User.create({
        name,
        email: normalizedEmail,
        passwordHash: password,
        otpHash: hashOtp(otp),
        otpExpiresAt
    });

    await sendOtp(normalizedEmail, otp, OTP_EXPIRES_AT);

    return user;
}

export async function loginUser(email, password) {
    const normalizedEmail = (email || '').trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');
    if (!user) throw new AppError('Invalid email or password', 401);

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) throw new AppError('Invalid email or password', 401);

    if (!user.emailVerified) {
        await resendOtp(normalizedEmail);
        throw new AppError('Please verify your email. OTP has been sent to your email.', 403, 'EMAIL_NOT_VERIFIED');
    }
    if (user.accountStatus !== 'ACTIVE') throw new AppError('Your account is inactive. Please contact support.', 403);

    const token = jwt.sign({ id: user._id }, env.auth.jwtSecret, { expiresIn: env.auth.jwtExpiresIn });
    return {
        user: {
            id: user._id,
            _id: user._id,
            name: user.name,
            email: user.email,
            emailVerified: user.emailVerified
        },
        token
    };
}

export async function resendOtp(email) {
    const normalizedEmail = (email || '').trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select('+otpHash +otpExpiresAt');
    if (!user) throw new AppError('User not found', 404);
    if (user.emailVerified) throw new AppError('User is already verified', 400);

    if (Date.now() < user.otpExpiresAt.getTime()) throw new AppError('OTP is still valid. Please use the existing code.', 400, 'OTP_ALREADY_SENT', { expiresAt: user.otpExpiresAt.getTime() });

    const otp = generateOtp(6);
    const otpExpiresAt = new Date(Date.now() + OTP_EXPIRES_AT * 60 * 1000)

    user.otpHash = hashOtp(otp);
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    await sendOtp(normalizedEmail, otp, OTP_EXPIRES_AT);
}

export async function sendOtp(email, otp, expiresIn) {
    const template = otpTemplate({ userName: 'User', otp, expiresIn });
    if (env.isDevelopment) console.log('Your 6 digit verification code is : ', otp);
    else await sendEmail({ to: email, subject: 'BloodWeb Verification Code', emailBody: template });
}

export async function verifyOtp(email, candidateOtp) {
    const normalizedEmail = (email || '').trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select('+otpHash +otpExpiresAt');
    if (!user) throw new AppError('User not found', 404);

    const hashedOtp = hashOtp(candidateOtp);

    if (Date.now() > user.otpExpiresAt?.getTime()) throw new AppError('OTP has expired', 400);
    if (hashedOtp !== user.otpHash) throw new AppError('OTP is incorrect', 400);

    user.emailVerified = true;
    user.otpHash = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    const token = jwt.sign(
        { id: user._id },
        env.auth.jwtSecret,
        { expiresIn: env.auth.jwtExpiresIn }
    );
    return {
        user: {
            id: user._id,
            _id: user._id,
            name: user.name,
            email: user.email,
            emailVerified: user.emailVerified
        },
        token
    };
}

export async function verifyPassword(userId, password) {
    const user = await User.findById(userId).select('+passwordHash');
    if (!user) throw new AppError('User not found', 404);
    return await user.comparePassword(password);
}

export async function updatePassword(userId, password) {
    const user = await User.findById(userId).select('+passwordHash');
    if (!user) throw new AppError('User not found', 404);
    user.passwordHash = password;
    return await user.save();
}

const RESET_OTP_EXPIRES_MINUTES = 10;

export async function forgotPassword(email) {
    const normalizedEmail = (email || '').trim().toLowerCase();
    if (!normalizedEmail) {
        throw new AppError('Email is required', 400);
    }

    const user = await User.findOne({ email: normalizedEmail }).select('+resetPasswordOtpExpiresAt');

    // Security: Timing and enumeration protection.
    // Return identical success response whether user exists, is active, or verified.
    if (!user || user.accountStatus !== 'ACTIVE' || !user.emailVerified) {
        return {
            message: 'If an account exists with this email, a 6-digit password reset code has been sent.'
        };
    }

    // Cooldown check: 1 minute minimum between requests to prevent spamming
    if (user.resetPasswordOtpExpiresAt) {
        const timeSinceExpiry = user.resetPasswordOtpExpiresAt.getTime() - Date.now();
        const minWaitMs = (RESET_OTP_EXPIRES_MINUTES - 1) * 60 * 1000;
        if (timeSinceExpiry > minWaitMs) {
            return {
                message: 'If an account exists with this email, a 6-digit password reset code has been sent.'
            };
        }
    }

    const otp = generateOtp(6);
    const expiresAt = new Date(Date.now() + RESET_OTP_EXPIRES_MINUTES * 60 * 1000);

    user.resetPasswordOtpHash = hashOtp(otp);
    user.resetPasswordOtpExpiresAt = expiresAt;
    user.resetPasswordAttempts = 0;
    await user.save();

    // Dev logging
    if (env.isDevelopment) {
        console.log(`[PASSWORD RESET OTP] For ${normalizedEmail}: ${otp}`);
    }

    // Send email
    try {
        const template = passwordResetTemplate({
            userName: user.name || 'User',
            otp,
            expiresIn: RESET_OTP_EXPIRES_MINUTES
        });
        await sendEmail({
            to: normalizedEmail,
            subject: 'BloodWeb — Password Reset Code',
            emailBody: template
        });
    } catch (err) {
        console.error('Failed to dispatch password reset email:', err.message);
    }

    return {
        message: 'If an account exists with this email, a 6-digit password reset code has been sent.'
    };
}

export async function resetPassword(email, otp, newPassword) {
    const normalizedEmail = (email || '').trim().toLowerCase();
    const normalizedOtp = (otp || '').trim();

    if (!normalizedEmail || !normalizedOtp || !newPassword) {
        throw new AppError('Email, OTP code, and new password are required', 400);
    }

    if (normalizedOtp.length !== 6 || !/^\d{6}$/.test(normalizedOtp)) {
        throw new AppError('OTP must be a 6-digit number', 400);
    }

    if (newPassword.length < 8) {
        throw new AppError('New password must be at least 8 characters long', 400);
    }

    const user = await User.findOne({ email: normalizedEmail }).select(
        '+passwordHash +resetPasswordOtpHash +resetPasswordOtpExpiresAt +resetPasswordAttempts'
    );

    if (!user || !user.resetPasswordOtpHash || !user.resetPasswordOtpExpiresAt) {
        throw new AppError('Invalid or expired password reset request. Please request a new code.', 400);
    }

    // Check expiry
    if (Date.now() > user.resetPasswordOtpExpiresAt.getTime()) {
        user.resetPasswordOtpHash = null;
        user.resetPasswordOtpExpiresAt = null;
        user.resetPasswordAttempts = 0;
        await user.save();
        throw new AppError('Password reset code has expired. Please request a new code.', 400);
    }

    // Brute-force protection: max 5 failed attempts per OTP
    if ((user.resetPasswordAttempts || 0) >= 5) {
        user.resetPasswordOtpHash = null;
        user.resetPasswordOtpExpiresAt = null;
        user.resetPasswordAttempts = 0;
        await user.save();
        throw new AppError('Too many failed attempts. This reset code has been invalidated. Please request a new code.', 429);
    }

    // Validate OTP hash
    const candidateHash = hashOtp(normalizedOtp);
    if (candidateHash !== user.resetPasswordOtpHash) {
        user.resetPasswordAttempts = (user.resetPasswordAttempts || 0) + 1;
        await user.save();
        const remaining = 5 - user.resetPasswordAttempts;
        if (remaining <= 0) {
            user.resetPasswordOtpHash = null;
            user.resetPasswordOtpExpiresAt = null;
            await user.save();
            throw new AppError('Too many failed attempts. Code has been invalidated. Please request a new code.', 400);
        }
        throw new AppError(`Invalid reset code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`, 400);
    }

    // Set new password (pre-save hook hashes with bcrypt 12)
    user.passwordHash = newPassword;
    user.resetPasswordOtpHash = null;
    user.resetPasswordOtpExpiresAt = null;
    user.resetPasswordAttempts = 0;
    await user.save();

    return {
        message: 'Password has been reset successfully. Please log in with your new password.'
    };
}

export async function getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found', 404);
    return user;
}

export async function getUserProfile(userId) {
    const user = await User.findById(userId); // Virtuals are said to be attached with mongoose document by def.
    if (!user) throw new AppError('User not found', 404);

    return {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        emailVerified: user.emailVerified,
        profileComplete: user.profileComplete,
        reliabilityScore: user.reliabilityScore,
        bloodGroup: user.bloodGroup,
        dob: user.dob,
        pendingDob: user.pendingDob,
        dobUpdateStatus: user.dobUpdateStatus,
        location: user.location,
        availability: user.availability,
        totalVolunteers: user.totalVolunteers,
        successfulDonations: user.successfulDonations
    };
}

export async function updateLocation(userId, locationData) {
    const user = await User.findByIdAndUpdate(userId, { $set: { location: locationData } }, { new: true, runValidators: true });

    if (!user) {
        throw new AppError("User not found", 404);
    }

    return user.location;
}

export async function updateBloodGroup(userId, bloodGroup) {
    const user = await User.findByIdAndUpdate(userId, { $set: { bloodGroup } }, { new: true, runValidators: true });
    if (!user) {
        throw new AppError("User not found", 404);
    }
    return await getUserProfile(userId);
}

export async function updatePhone(userId, phone) {
    const user = await User.findByIdAndUpdate(userId, { $set: { phone } }, { new: true, runValidators: true });
    if (!user) {
        throw new AppError("User not found", 404);
    }
    return await getUserProfile(userId);
}

export async function updateDob(userId, dob) {
    const user = await User.findById(userId);
    if (!user) throw new AppError("User not found", 404);
    
    if (!user.dob) {
        user.dob = dob;
        user.dobUpdateStatus = 'none';
    } else {
        user.pendingDob = dob;
        user.dobUpdateStatus = 'pending';
    }
    
    await user.save();
    return await getUserProfile(userId);
}

export async function toggleAvailability(userId) {
    const user = await User.findById(
        userId,
        {
            availability: 1,
            bloodGroup: 1,
            location: 1,
            phone: 1
        }
    );

    if (!user) throw new AppError('User not found', 404);
    if (!user.bloodGroup) throw new AppError('bloodGroup is missing', 400);
    if (!user.location) throw new AppError('Location is missing', 400);
    if (!user.location.coordinates) throw new AppError('Coordinates are missing', 400);
    if (!user.phone) throw new AppError('Phone number is missing', 400);

    user.availability = !user.availability;
    return await user.save();
}