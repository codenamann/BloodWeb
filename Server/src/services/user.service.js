import AppError from "../middleware/appError.js";
import User from "../models/User.model.js";
import otpTemplate from "../templates/otp.template.js";
import { sendEmail } from "../utils/email.js";
import { generateOtp, hashOtp } from "../utils/otp.js";
import jwt from "jsonwebtoken";
import env from "../config/env.js";

const OTP_EXPIRES_AT = 5; // minutes

export async function createUser({ name, email, password }) {
    if (await User.exists({ email })) throw new AppError('User already exists. Please login.', 400);

    const otp = generateOtp(6);
    const otpExpiresAt = new Date(Date.now() + OTP_EXPIRES_AT * 60 * 1000)

    const user = await User.create({
        name,
        email,
        passwordHash: password,
        otpHash: hashOtp(otp),
        otpExpiresAt
    });

    await sendOtp(email, otp, OTP_EXPIRES_AT);

    return user;
}

export async function loginUser(email, password) {
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) throw new AppError('Invalid email or password', 401);

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) throw new AppError('Invalid email or password', 401);

    if (!user.emailVerified) {
        await resendOtp(email);
        throw new AppError('Please verify your email. OTP has been sent to your email.', 403, 'EMAIL_NOT_VERIFIED');
    }
    if (user.accountStatus !== 'ACTIVE') throw new AppError('Your account is inactive. Please contact support.', 403);

    const token = jwt.sign({ id: user._id }, env.auth.jwtSecret, { expiresIn: env.auth.jwtExpiresIn });
    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            emailVerified: user.emailVerified
        },
        token
    };
}

export async function resendOtp(email) {
    const user = await User.findOne({ email }).select('+otpHash +otpExpiresAt');
    if (!user) throw new AppError('User not found', 404);
    if (user.emailVerified) throw new AppError('User is already verified', 400);

    if (Date.now() < user.otpExpiresAt.getTime()) throw new AppError('OTP is still valid. Please use the existing code.', 400, 'OTP_ALREADY_SENT', { expiresAt: user.otpExpiresAt.getTime() });

    const otp = generateOtp(6);
    const otpExpiresAt = new Date(Date.now() + OTP_EXPIRES_AT * 60 * 1000)

    user.otpHash = hashOtp(otp);
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    await sendOtp(email, otp, OTP_EXPIRES_AT);
}

export async function sendOtp(email, otp, expiresIn) {
    const template = otpTemplate({ userName: 'User', otp, expiresIn });
    if (env.isDevelopment) console.log('OTP ::>>', otp);
    else await sendEmail({ to: email, subject: 'BloodWeb Verification Code', emailBody: template });
}

export async function verifyOtp(email, candidateOtp) {
    const user = await User.findOne({ email }).select('+otpHash +otpExpiresAt');
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

export async function getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found', 404);
    return user;
}

export async function getUserProfile(userId) {
    const user = await User.findById(userId); // Virtuals are said to be attached with mongoose document by def.
    if (!user) throw new AppError('User not found', 404);

    return user;
}

export async function updateLocation(userId, locationData) {
    const result = await User.updateOne({ _id: userId }, { $set: { location: locationData } });
    if (result.matchedCount === 0) {
        throw new AppError("User not found", 404);
    }

    return result;
}

export async function updateBloodGroup(userId, bloodGroup) {
    const result = await User.updateOne({ _id: userId }, { $set: { bloodGroup } });
    if (result.matchedCount === 0) {
        throw new AppError("User not found", 404);
    }

    return result;
}

export async function updatePhone(userId, phone) {
    const result = await User.updateOne({ _id: userId }, { $set: { phone } })
    if (result.matchedCount === 0) {
        throw new AppError("User not found", 404);
    }

    return result;
}

export async function toggleAvailability(userId) {
    const user = await User.findById(
        userId,
        {
            availability: 1,
            bloodGroup: 1,
            location: 1
        }
    );

    if (!user) throw new AppError('User not found', 404);
    if (!user.bloodGroup) throw new AppError('bloodGroup is missing', 400);
    if (!user.location) throw new AppError('Location is missing', 400);
    if (!user.location.coordinates) throw new AppError('Coordinates are missing', 400);

    user.availability = !user.availability;
    return await user.save();
}