import * as userService from "../../services/user.service.js";
import logger from "../../utils/logger.js";

export async function register(req, res) {
    const { name, email, password } = req.body;
    logger.info(`name: ${name}, email: ${email}, password: ${password}`);
    const user = await userService.createUser({ name, email, password });

    res.status(201).json({
        status: 'success',
        message: 'User registered successfully. Please verify your email.',
        data: {
            email: user.email,
            emailVerified: user.emailVerified
        }
    });
}

export async function login(req, res) {
    const { email, password } = req.body;
    const { user, token } = await userService.loginUser(email, password);

    res.status(200).json({
        status: 'success',
        message: 'User logged in successfully',
        data: {
            user,
            token
        }
    });
}

export async function verifyOtp(req, res) {
    const { email, otp } = req.body;
    const { user, token } = await userService.verifyOtp(email, otp);

    res.status(200).json({
        status: 'success',
        message: 'User verified successfully',
        data: {
            user,
            token
        }
    });
}

export async function resendOtp(req, res) {
    const { email } = req.body;
    await userService.resendOtp(email);

    res.status(200).json({
        status: 'success',
        message: 'OTP resent successfully',
    });
}