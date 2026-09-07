export default function errorHandler(err, req, res, next) {
    let statusCode = err.statusCode || 500;
    let status = err.status || 'error';
    let message = err.message || 'Something went wrong';

    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        statusCode = 401;
        status = 'fail';
        message = 'Invalid or expired token';
    }

    if (err.code === 11000) {
        statusCode = 409;
        status = 'fail';
        message = 'Duplicate field value entered';
    }

    res.status(statusCode).json({
        status,
        message,
        ...(err.code ? { code: err.code } : {}),
        ...(err.data ? { data: err.data } : {}),
    });
}