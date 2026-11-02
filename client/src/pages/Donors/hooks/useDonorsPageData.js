import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useBloodRequests } from '../../../context/BloodRequestContext';
import { isDonorCompatible, calculateDistanceKm } from '../../../utils/compatibility';

export const useDonorsPageData = () => {
  const { currentUser, updateUser } = useAuth();
  const { requests, refreshRequests } = useBloodRequests();
  const [searchParams] = useSearchParams();

  // Strict Discover Requirements Verification
  const hasBloodGroup = Boolean(currentUser?.bloodGroup);
  const hasLocation = Boolean(
    currentUser?.location?.country &&
    currentUser?.location?.state &&
    currentUser?.location?.city &&
    currentUser?.location?.pincode &&
    currentUser?.location?.coordinates &&
    typeof currentUser.location.coordinates.lat === 'number' &&
    typeof currentUser.location.coordinates.lng === 'number'
  );
  const isAvailable = Boolean(currentUser?.availability);
  const isDiscoverReady = hasBloodGroup && hasLocation && isAvailable;

  // Setup Modal State
  const [showSetupModal, setShowSetupModal] = useState(false);

  // Auto-trigger setup modal when requirements are unmet
  useEffect(() => {
    if (currentUser) {
      const bgOk = Boolean(currentUser.bloodGroup);
      const locOk = Boolean(
        currentUser.location?.country &&
        currentUser.location?.state &&
        currentUser.location?.city &&
        currentUser.location?.pincode &&
        currentUser.location?.coordinates &&
        typeof currentUser.location.coordinates.lat === 'number' &&
        typeof currentUser.location.coordinates.lng === 'number'
      );
      const avOk = Boolean(currentUser.availability);

      if (!bgOk || !locOk || !avOk) {
        setShowSetupModal(true);
      }
    }
  }, [currentUser]);

  // Filters State
  const [selectedUrgency, setSelectedUrgency] = useState('ALL');
  const [radiusKm, setRadiusKm] = useState(25);
  const [unitsFilter, setUnitsFilter] = useState('ANY'); // 'ANY' | '1' | '2' | '3+'
  const [sortBy, setSortBy] = useState('NEAREST'); // 'NEAREST' | 'URGENT' | 'NEWEST'
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || ''
  );

  useEffect(() => {
    const q = searchParams.get('search');
    if (q !== null) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  // Base list of requests enriched with distance calculation
  const enrichedRequests = requests.map((req, idx) => {
    let distanceKm = Math.round((2.5 + idx * 2.2) * 10) / 10;
    if (
      currentUser?.location?.coordinates?.lat != null &&
      currentUser?.location?.coordinates?.lng != null &&
      req.hospitalCoordinates?.lat != null &&
      req.hospitalCoordinates?.lng != null
    ) {
      distanceKm = calculateDistanceKm(
        currentUser.location.coordinates.lat,
        currentUser.location.coordinates.lng,
        req.hospitalCoordinates.lat,
        req.hospitalCoordinates.lng
      );
    }
    return {
      ...req,
      distanceKm,
    };
  });

  const currentUserId = (currentUser?._id || currentUser?.id)?.toString();

  // Strict Filter Logic: User must strictly satisfy readiness & compatibility
  const filtered = enrichedRequests.filter((req) => {
    // Exclude own requests
    const creatorId = (
      req.createdBy?._id ||
      req.createdBy?.id ||
      req.createdBy
    )?.toString();
    if (currentUserId && creatorId === currentUserId) return false;

    // Terminal requests cannot accept new volunteers
    if (
      req.status &&
      req.status !== 'ACTIVE' &&
      req.status !== 'PARTIALLY_FULFILLED'
    ) {
      return false;
    }

    // Strict Discovery Enforcement
    if (!isDiscoverReady) return false;

    if (!isDonorCompatible(currentUser.bloodGroup, req.patientBloodGroup)) {
      return false;
    }

    // Urgency filter
    if (selectedUrgency !== 'ALL' && req.urgency !== selectedUrgency) {
      return false;
    }

    // Radius distance filter
    if (req.distanceKm > radiusKm) {
      return false;
    }

    // Units needed filter
    if (unitsFilter === '1' && req.unitsNeeded !== 1) return false;
    if (unitsFilter === '2' && req.unitsNeeded !== 2) return false;
    if (unitsFilter === '3+' && req.unitsNeeded < 3) return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchHosp = req.hospitalName?.toLowerCase().includes(q);
      const matchAddress = req.hospitalAddress?.toLowerCase().includes(q);
      const matchBg = req.patientBloodGroup?.toLowerCase().includes(q);
      if (!matchHosp && !matchAddress && !matchBg) return false;
    }

    return true;
  });

  // Sorting
  const sortedRequests = [...filtered].sort((a, b) => {
    if (sortBy === 'NEAREST') return a.distanceKm - b.distanceKm;
    if (sortBy === 'URGENT') {
      const priority = { CRITICAL: 3, HIGH: 2, NORMAL: 1 };
      return (priority[b.urgency] || 1) - (priority[a.urgency] || 1);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const handleResetFilters = () => {
    setSelectedUrgency('ALL');
    setRadiusKm(25);
    setUnitsFilter('ANY');
    setSearchQuery('');
    setSortBy('NEAREST');
  };

  const handleSetupSuccess = (updatedUser) => {
    updateUser(updatedUser);
    if (refreshRequests) {
      refreshRequests();
    }
  };

  return {
    currentUser,
    hasBloodGroup,
    hasLocation,
    isAvailable,
    isDiscoverReady,
    showSetupModal,
    setShowSetupModal,
    selectedUrgency,
    setSelectedUrgency,
    radiusKm,
    setRadiusKm,
    unitsFilter,
    setUnitsFilter,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    sortedRequests,
    handleResetFilters,
    handleSetupSuccess,
  };
};

export default useDonorsPageData;
