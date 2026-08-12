import env from "../config/env";
import AppError from "./appError";

export default function authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) throw new AppError('Authorization header not found', 401);

    const [authScheme, token] = authHeader.split(' ');
    if (authScheme.toLowerCase() !== 'bearer' || !token)
        throw new AppError('Invalid authorization format', 401);

    try {
        const decodedToken = jwt.verify(token, env.auth.jwtSecret);
        req.user = decodedToken;
        next();
    } catch (error) {
        throw new AppError('Invalid token', 401);
    }
}