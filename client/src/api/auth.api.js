import client from "./client";

export async function registerUser({ name, email, password }) {
    const res = await client.post("/api/auth/register", { name, email, password });
    return res.data;
}

export async function loginUser({ email, password }) {
    const res = await client.post("/api/auth/login", { email, password });
    return res.data;
}

export async function verifyEmail(email, otp) {
    const res = await client.post("/api/auth/verify-otp", { email, otp });
    return res.data;
}

export async function resendOtp(email) {
    const res = await client.post("/api/auth/resend-otp", { email });
    return res.data;
}