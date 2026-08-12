export default function sanitize(...fields) {
    return (req, res, next) => {
        const originalJson = res.json.bind(res);

        res.json = (data) => {
            const strip = (obj) => {
                const clean = { ...obj };
                for (const field of fields) {
                    delete clean[field];
                }
                return clean;
            };

            const cleaned = Array.isArray(data)
                ? data.map(strip)
                : strip(data);

            originalJson(cleaned);
        };

        next();
    };
}