export default function requireFields(...fields) {
    return (req, res, next) => {
        for (const field of fields) {
            if (!req.body[field]) {
                throw new AppError(`${field} is required`, 400);
            }
        }
        next();
    };
}