import AppError from '../../middleware/appError.js';
import * as hospitalService from '../../services/hospital.service.js';

export async function searchHospitals(req, res) {
    const { query, city } = req.query;
    let page = parseInt(req.query.page, 10);
    let limit = parseInt(req.query.limit, 10);

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1 || limit > 50) limit = 10;

    if (!query || !city) throw new AppError('Hospital name and city are required', 400);

    const result = await hospitalService.searchHospitals(query, city, page, limit);

    res.status(200).json({
        status: 'success',
        message: 'Hospitals fetched successfully',
        data: result
    });
}