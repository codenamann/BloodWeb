import Hospital from "../models/Hospital.model.js";
import User from "../models/User.model.js";
import { getCompatibleDonorGroups } from "./compatibilityEngine.js";

const PROXIMITY_WEIGHT = 0.7;
const RELIABILITY_WEIGHT = 0.3;

export function calculateDistanceKm(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

}

function calculateRankScore(distanceKm, totalVolunteers, successfulDonations) {
    const proximityScore = 1 / (1 + distanceKm);
    const reliabilityScore = totalVolunteers
        ? successfulDonations / totalVolunteers
        : 0;
    const rankScore = (proximityScore * PROXIMITY_WEIGHT) + (reliabilityScore * RELIABILITY_WEIGHT);
    return rankScore;
}

function rankDonor(donor, hospital) {
    const { lat, lng } = donor.location.coordinates;

    const distanceKm = calculateDistanceKm(
        hospital.coordinates.lat,
        hospital.coordinates.lng,
        lat,
        lng
    );

    const rankScore = calculateRankScore(
        distanceKm,
        donor.totalVolunteers,
        donor.successfulDonations
    )

    return {
        ...donor.toObject(), // converting mongoose document to plain object
        distanceKm,
        rankScore
    }
}

export async function getMatchingDonors(patientBloodGroup, hospitalId, requestorId) {
    const eligibleBloodGroups = getCompatibleDonorGroups(patientBloodGroup);

    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) throw new Error('Hospital not found');
    if (!hospital.coordinates) throw new Error('Hospital has no coordinates');

    const eligibleDonors = await User.find(
        {
            bloodGroup: { $in: eligibleBloodGroups },
            availability: true,
            accountStatus: 'ACTIVE',
            _id: { $ne: requestorId }
        },
        {
            name: 1,
            email: 1,
            phone: 1,
            bloodGroup: 1,
            'location.coordinates': 1,
            successfulDonations: 1,
            totalVolunteers: 1
        }
    );

    return eligibleDonors.filter(
        (donor) => donor.location?.coordinates?.lat && donor.location?.coordinates?.lng
    ).map(
        (donor) => rankDonor(donor, hospital)
    ).sort((a, b) => (b.rankScore - a.rankScore));
}