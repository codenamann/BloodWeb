import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useBloodRequests } from '../../../context/BloodRequestContext';
import { volunteerForRequest } from '../../../api/volunteer.api';
import { toast } from '../../../components/ui/toast';
import { enrichDonorRequests, filterAndSortDonorRequests } from '../utils/donorFilterUtils';

const isCompleteLocation = (loc) =>
  Boolean(
    loc?.city &&
    loc?.state &&
    loc?.country &&
    loc?.pincode &&
    typeof loc?.coordinates?.lat === 'number' &&
    typeof loc?.coordinates?.lng === 'number'
  );

export const useDonorsPageData = () => {
  const { currentUser, updateUser } = useAuth();
  const { requests, refreshRequests } = useBloodRequests();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Discover Requirements Verification
  const hasBloodGroup = Boolean(currentUser?.bloodGroup);
  const hasLocation = isCompleteLocation(currentUser?.location);
  const isAvailable = Boolean(currentUser?.availability);
  const isDiscoverReady = hasBloodGroup && hasLocation && isAvailable;

  // Setup Modal State
  const [showSetupModal, setShowSetupModal] = useState(false);

  // Auto-trigger setup modal when requirements are unmet
  useEffect(() => {
    if (currentUser && !isDiscoverReady) {
      setShowSetupModal(true);
    }
  }, [currentUser, isDiscoverReady]);

  useEffect(() => {
    if (isDiscoverReady && refreshRequests) {
      refreshRequests();
    }
  }, [isDiscoverReady, refreshRequests]);

  // Filters State
  const [selectedUrgency, setSelectedUrgency] = useState('ALL');
  const [radiusKm, setRadiusKm] = useState(25);
  const [unitsFilter, setUnitsFilter] = useState('ANY');
  const [sortBy, setSortBy] = useState('NEAREST');
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || ''
  );

  useEffect(() => {
    const q = searchParams.get('search');
    if (q !== null) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  // Enriched requests with dynamic distance relative to donor
  const enrichedRequests = useMemo(
    () => enrichDonorRequests(requests, currentUser),
    [requests, currentUser]
  );

  // Filtered & sorted requests
  const sortedRequests = useMemo(
    () =>
      filterAndSortDonorRequests({
        enrichedRequests,
        currentUser,
        isDiscoverReady,
        selectedUrgency,
        radiusKm,
        unitsFilter,
        searchQuery,
        sortBy,
      }),
    [
      enrichedRequests,
      currentUser,
      isDiscoverReady,
      selectedUrgency,
      radiusKm,
      unitsFilter,
      searchQuery,
      sortBy,
    ]
  );

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

  const [requestToVolunteer, setRequestToVolunteer] = useState(null);

  const handleVolunteer = (e, request) => {
    e?.stopPropagation();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setRequestToVolunteer(request);
  };

  const handleVolunteerSuccess = async (request) => {
    const loc = currentUser?.location?.coordinates
      ? { lat: currentUser.location.coordinates.lat, lng: currentUser.location.coordinates.lng }
      : null;
    await volunteerForRequest(request._id, loc);
    navigate(`/coordination/${request._id}`);
  };

  return {
    currentUser,
    updateUser,
    hasBloodGroup,
    hasLocation,
    isAvailable,
    isDiscoverReady,
    showSetupModal,
    setShowSetupModal,
    requestToVolunteer,
    setRequestToVolunteer,
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
    handleVolunteer,
    handleVolunteerSuccess,
  };
};

export default useDonorsPageData;
