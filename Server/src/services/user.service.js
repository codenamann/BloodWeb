import User from "../models/User.model.js";
import { generateOtp, hashOtp } from "../utils/otp.js";

const OTP_EXPIRES_AT = 5; // minutes

export async function createUser({ name, email, password }) {
    if (await User.exists({ email })) throw new Error('User already exists');

    const otp = generateOtp(6);
    const user = await User.create({
        name,
        email,
        passwordHash: password,
        otpHash: hashOtp(otp),
        otpExpiresAt: new Date(Date.now() + OTP_EXPIRES_AT * 60 * 1000)
    });

    // TODO: sendOtp(email, otp);

    return user;
}

export async function verifyOtp(userId, candidateOtp) {
    const user = await User.findById(userId).select('+otpHash +otpExpiresAt');
    if (!user) throw new Error('User not found');

    const hashedOtp = hashOtp(candidateOtp);

    if (Date.now() > user.otpExpiresAt) throw new Error('OTP has expired');
    if (hashedOtp !== user.otpHash) throw new Error('OTP is incorrect');

    user.emailVerified = true;
    user.otpHash = undefined;
    user.otpExpiresAt = undefined;

    return await user.save();
}

export async function verifyPassword(userId, password) {
    const user = await User.findById(userId).select('+passwordHash');
    if (!user) throw new Error('User not found');
    return await user.comparePassword(password);
}

export async function updatePassword(userId, password) {
    const user = await User.findById(userId).select('+passwordHash');
    if (!user) throw new Error('User not found');
    user.passwordHash = password;
    return await user.save();
}

export async function getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    return user;
}

export async function getUserProfile(userId) {
    const user = await User.findById(userId); // Virtuals are said to be attached with mongoose document by def.
    if (!user) throw new Error('User not found');

    return user;
}

export async function updateLocation(userId, locationData) {
    const result = await User.updateOne({ _id: userId }, { $set: { location: locationData } });
    if (result.matchedCount === 0) {
        throw new Error("User not found");
    }

    return result;
}

export async function updateBloodGroup(userId, bloodGroup) {
    const result = await User.updateOne({ _id: userId }, { $set: { bloodGroup } });
    if (result.matchedCount === 0) {
        throw new Error("User not found");
    }

    return result;
}

export async function updatePhone(userId, phone) {
    const result = await User.updateOne({ _id: userId }, { $set: { phone } })
    if (result.matchedCount === 0) {
        throw new Error("User not found");
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

    if (!user) throw new Error('User not found')
    if (!user.bloodGroup) throw new Error('bloodGroup is missing');
    if (!user.location) throw new Error('Location is missing');
    if (!user.location.coordinates) throw new Error('Coordinates are missing');

    user.availability = !user.availability;
    return await user.save();
}