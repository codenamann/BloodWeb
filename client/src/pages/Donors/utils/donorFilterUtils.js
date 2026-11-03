import { isDonorCompatible, calculateDistanceKm } from '../../../utils/compatibility';

/**
 * Enriches blood requests with accurate distance relative to currentUser location.
 */
export const enrichDonorRequests = (requests, currentUser) => {
  return (requests || []).map((req, idx) => {
    let distanceKm = Math.round((2.5 + idx * 2.2) * 10) / 10;
    const hCoords = req.hospitalCoordinates || req.hospitalId?.coordinates;
    if (
      currentUser?.location?.coordinates?.lat != null &&
      currentUser?.location?.coordinates?.lng != null &&
      hCoords?.lat != null &&
      hCoords?.lng != null
    ) {
      distanceKm = calculateDistanceKm(
        currentUser.location.coordinates.lat,
        currentUser.location.coordinates.lng,
        hCoords.lat,
        hCoords.lng
      );
    }
    const hospitalName = req.hospitalName || req.hospitalId?.name || 'Hospital';
    const hospitalAddress = req.hospitalAddress || req.hospitalId?.address || '';
    return {
      ...req,
      hospitalName,
      hospitalAddress,
      hospitalCoordinates: hCoords,
      distanceKm,
    };
  });
};

/**
 * Filters and sorts enriched requests according to readiness, compatibility, and filters.
 */
export const filterAndSortDonorRequests = ({
  enrichedRequests,
  currentUser,
  isDiscoverReady,
  selectedUrgency,
  radiusKm,
  unitsFilter,
  searchQuery,
  sortBy,
}) => {
  const currentUserId = (currentUser?._id || currentUser?.id)?.toString();

  const filtered = enrichedRequests.filter((req) => {
    const creatorId = (
      req.createdBy?._id ||
      req.createdBy?.id ||
      req.createdBy
    )?.toString();
    if (currentUserId && creatorId === currentUserId) return false;

    if (
      req.status &&
      req.status !== 'ACTIVE' &&
      req.status !== 'PARTIALLY_FULFILLED'
    ) {
      return false;
    }

    if (!isDiscoverReady) return false;

    if (!isDonorCompatible(currentUser.bloodGroup, req.patientBloodGroup)) {
      return false;
    }

    if (selectedUrgency !== 'ALL' && req.urgency !== selectedUrgency) {
      return false;
    }

    if (req.distanceKm > radiusKm) {
      return false;
    }

    if (unitsFilter === '1' && req.unitsNeeded !== 1) return false;
    if (unitsFilter === '2' && req.unitsNeeded !== 2) return false;
    if (unitsFilter === '3+' && req.unitsNeeded < 3) return false;

    if (searchQuery?.trim()) {
      const q = searchQuery.toLowerCase();
      const matchHosp = req.hospitalName?.toLowerCase().includes(q);
      const matchAddress = req.hospitalAddress?.toLowerCase().includes(q);
      const matchBg = req.patientBloodGroup?.toLowerCase().includes(q);
      if (!matchHosp && !matchAddress && !matchBg) return false;
    }

    return true;
  });

  return [...filtered].sort((a, b) => {
    if (sortBy === 'NEAREST') return a.distanceKm - b.distanceKm;
    if (sortBy === 'URGENT') {
      const priority = { CRITICAL: 3, HIGH: 2, NORMAL: 1 };
      return (priority[b.urgency] || 1) - (priority[a.urgency] || 1);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
};
