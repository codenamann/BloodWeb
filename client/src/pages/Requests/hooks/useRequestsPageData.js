import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBloodRequests } from '../../../context/BloodRequestContext';
import { toast } from '../../../components/ui/toast';

export const useRequestsPageData = (currentUser) => {
  const {
    myRequests,
    networkRequests,
    myPagination,
    networkPagination,
    fetchMyRequests,
    fetchNetworkRequests,
    loadMoreMyRequests,
    loadMoreNetworkRequests,
    loading,
    loadingMore,
    error,
    updateRequestStatus,
    volunteerForRequest,
  } = useBloodRequests();
  const navigate = useNavigate();

  const [statusTab, setStatusTab] = useState('ALL');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [scopeTab, setScopeTab] = useState('MINE');

  const [requestToCancel, setRequestToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const currentUserId = (currentUser?._id || currentUser?.id)?.toString();
  const displayedRequests = scopeTab === 'MINE' ? myRequests : networkRequests;
  const currentPagination = scopeTab === 'MINE' ? myPagination : networkPagination;
  const hasMore = Boolean(currentPagination?.hasMore);

  const initialFetchDone = useRef(false);
  useEffect(() => {
    if (!initialFetchDone.current) {
      initialFetchDone.current = true;
      fetchMyRequests({}, false);
      fetchNetworkRequests({}, false);
    }
  }, [fetchMyRequests, fetchNetworkRequests]);

  useEffect(() => {
    const filters = {
      status: statusTab,
      bloodGroup: selectedBloodGroup,
      search: searchQuery.trim(),
    };

    const delay = searchQuery.trim() ? 300 : 0;
    const timer = setTimeout(() => {
      if (scopeTab === 'MINE') {
        fetchMyRequests(filters, false);
      } else {
        fetchNetworkRequests(filters, false);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [scopeTab, statusTab, selectedBloodGroup, searchQuery, fetchMyRequests, fetchNetworkRequests]);

  const handleCancelRequest = (e, request) => {
    e?.stopPropagation?.();
    const reqObj =
      typeof request === 'object' && request !== null
        ? request
        : displayedRequests.find((r) => r._id === request);
    setRequestToCancel(reqObj);
  };

  const confirmCancel = async () => {
    if (!requestToCancel) return;
    setCancelling(true);
    try {
      await updateRequestStatus(requestToCancel._id, 'CANCELLED');
      toast.success(
        'Request Cancelled',
        `Blood request for ${requestToCancel.unitsNeeded} units of ${requestToCancel.patientBloodGroup} has been cancelled.`
      );
      setRequestToCancel(null);
    } catch (err) {
      console.error('Cancellation failed:', err);
      toast.error(
        'Cancellation Failed',
        err.response?.data?.message ||
          err.message ||
          'Unable to cancel this request. Only the creator can cancel active requests.'
      );
    } finally {
      setCancelling(false);
    }
  };

  const handleVolunteer = async (e, request) => {
    e.stopPropagation();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    try {
      await volunteerForRequest(request._id, currentUser);
      navigate(`/coordination/${request._id}`);
    } catch (err) {
      console.error('Failed to volunteer:', err);
    }
  };

  const handleLoadMore = () => {
    const filters = {
      status: statusTab,
      bloodGroup: selectedBloodGroup,
      search: searchQuery.trim(),
    };
    if (scopeTab === 'MINE') {
      loadMoreMyRequests(filters);
    } else {
      loadMoreNetworkRequests(filters);
    }
  };

  const handleRetry = () => {
    const filters = {
      status: statusTab,
      bloodGroup: selectedBloodGroup,
      search: searchQuery.trim(),
    };
    if (scopeTab === 'MINE') {
      fetchMyRequests(filters, false);
    } else {
      fetchNetworkRequests(filters, false);
    }
  };

  return {
    statusTab,
    setStatusTab,
    selectedBloodGroup,
    setSelectedBloodGroup,
    searchQuery,
    setSearchQuery,
    scopeTab,
    setScopeTab,
    requestToCancel,
    setRequestToCancel,
    cancelling,
    currentUserId,
    displayedRequests,
    currentPagination,
    hasMore,
    loading,
    loadingMore,
    error,
    myPagination,
    networkPagination,
    handleCancelRequest,
    confirmCancel,
    handleVolunteer,
    handleLoadMore,
    handleRetry,
  };
};

export default useRequestsPageData;
