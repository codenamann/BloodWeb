import Hospital from "../models/Hospital.model.js";
import { searchOverpass } from "../utils/overpass.js";

export async function searchHospitals(query, city) {
    const local = await Hospital.find({
        city,
        name: { $regex: query, $options: "i" }
    }).limit(10).lean();

    if (local.length > 0) return local;

    const osmResults = await searchOverpass(city);
    if (!osmResults?.length) return [];

    await Promise.all(osmResults.map(saveOsmHospital));

    const regex = new RegExp(query, 'i');
    return osmResults
        .filter((h) => regex.test(h.name))
        .slice(0, 10);
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