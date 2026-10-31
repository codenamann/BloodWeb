import Hospital from "../models/Hospital.model.js";
import { searchOverpass } from "../utils/overpass.js";

export async function searchHospitals(query, city, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    let local = await Hospital.find({
        city,
        name: { $regex: query, $options: "i" }
    })
        .sort({ _id: 1 })
        .skip(skip)
        .limit(limit + 1)
        .lean();

    if (local.length > 0 || page > 1) {
        const hasMore = local.length > limit;
        if (hasMore) local.pop();
        return { hospitals: local, pagination: { page, limit, hasMore } };
    }

    const osmResults = await searchOverpass(city);
    if (!osmResults?.length) {
        return { hospitals: [], pagination: { page, limit, hasMore: false } };
    }

    await Promise.allSettled(osmResults.map(saveOsmHospital));

    local = await Hospital.find({
        city,
        name: { $regex: query, $options: "i" }
    })
        .sort({ _id: 1 })
        .skip(skip)
        .limit(limit + 1)
        .lean();

    const hasMore = local.length > limit;
    if (hasMore) local.pop();

    return { hospitals: local, pagination: { page, limit, hasMore } };
}

export async function getAllHospitals(city) {
    const local = await Hospital.find({ city }).lean();
    if (local.length > 0) return local;

    const osmResults = await searchOverpass(city);
    if (!osmResults?.length) return [];

    return Promise.all(osmResults.map(saveOsmHospital));
}

export async function getHospitalById(hospitalId) {
    const hospital = await Hospital.findById(hospitalId).lean();
    if (!hospital) throw new Error('Hospital not found');
    return hospital;
}

export async function createManualHospital({
    name,
    address,
    city,
    state,
    coordinates,
}) {
    const existing = await Hospital.findOne({ name, city })
    if (existing) return existing;

    const hospital = await Hospital.create({
        name,
        address,
        city,
        state,
        coordinates,
        source: 'MANUAL'
    })
    return hospital;
}

export async function saveOsmHospital({
    osmId,
    name,
    address,
    city,
    state,
    coordinates,
}) {
    const hospital = await Hospital.findOrCreateByOsmId({
        osmId,
        name,
        address,
        city,
        state,
        coordinates,
        source: 'OSM',
        verified: true
    })
    return hospital;
}