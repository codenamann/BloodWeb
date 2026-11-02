import { useState, useEffect, useCallback } from 'react';
import { getRequestById, cancelBloodRequest, completeBloodRequest } from '../../../api/request.api';
import {
  volunteerForRequest,
  updateVolunteerStatus,
  withdrawVolunteerResponse,
} from '../../../api/volunteer.api';
import { subscribeToRequestUpdates } from '../../../services/socket';

export const useRequestDetailPage = (id, setActiveTab) => {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusCode, setStatusCode] = useState(null);

  const [shareFeedback, setShareFeedback] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [confirmingComplete, setConfirmingComplete] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [responseToWithdraw, setResponseToWithdraw] = useState(null);

  const fetchRequest = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      setStatusCode(null);
      const data = await getRequestById(id);
      setRequest(data);
    } catch (err) {
      console.error('Failed to load request details:', err);
      const status = err.response?.status || 500;
      const message =
        err.response?.data?.message || err.message || 'Failed to load request details.';
      setStatusCode(status);
      setError(message);
      setRequest(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRequest();
  }, [fetchRequest]);

  useEffect(() => {
    if (!id) return;

    const cleanup = subscribeToRequestUpdates(id, {
      VOLUNTEER_RESPONDED: () => fetchRequest(),
      VOLUNTEER_STATUS_CHANGED: () => fetchRequest(),
      REQUEST_COMPLETED: () => fetchRequest(),
      REQUEST_CANCELLED: () => fetchRequest(),
    });

    return cleanup;
  }, [id, fetchRequest]);

  const handleCancelRequest = async () => {
    if (!request?._id) return;
    if (window.confirm('Are you sure you want to cancel this emergency request?')) {
      try {
        setCancelling(true);
        const updated = await cancelBloodRequest(request._id);
        setRequest((prev) => ({
          ...prev,
          status: 'CANCELLED',
          ...(updated || {}),
        }));
      } catch (err) {
        console.error('Cancellation failed:', err);
        alert(err.response?.data?.message || 'Failed to cancel request');
      } finally {
        setCancelling(false);
      }
    }
  };

  const handleCompleteRequest = async () => {
    if (!request?._id) return;
    try {
      setCompleting(true);
      const updated = await completeBloodRequest(request._id);
      setRequest((prev) => ({
        ...prev,
        status: 'COMPLETED',
        ...(updated || {}),
      }));
      setConfirmingComplete(false);
    } catch (err) {
      console.error('Completion failed:', err);
      alert(err.response?.data?.message || 'Failed to complete request');
    } finally {
      setCompleting(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShareFeedback(true);
    setTimeout(() => setShareFeedback(false), 3000);
  };

  const handleVolunteer = async () => {
    if (!request?._id) return;
    setActionLoading(true);

    let locationAtResponse = null;
    if (navigator.geolocation) {
      try {
        const pos = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 4000,
            maximumAge: 60000,
          });
        });
        if (pos?.coords) {
          locationAtResponse = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
        }
      } catch (geoErr) {
        // Geolocation denied or timed out
      }
    }

    try {
      await volunteerForRequest(request._id, locationAtResponse);
      await fetchRequest();
      setActiveTab?.('VOLUNTEERS');
    } catch (err) {
      console.error('Failed to volunteer:', err);
      const msg =
        err.response?.data?.message || err.message || 'Failed to volunteer for this request.';
      alert(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = async (responseId, newStatus) => {
    if (!responseId || !newStatus) return;
    setActionLoading(true);
    try {
      await updateVolunteerStatus(responseId, newStatus);
      await fetchRequest();
    } catch (err) {
      console.error('Failed to update volunteer status:', err);
      const msg =
        err.response?.data?.message || err.message || 'Failed to update volunteer status.';
      alert(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleWithdraw = (responseId) => {
    setResponseToWithdraw(responseId);
  };

  const confirmWithdraw = async () => {
    if (!responseToWithdraw) return;
    setActionLoading(true);
    try {
      await withdrawVolunteerResponse(responseToWithdraw);
      setResponseToWithdraw(null);
      await fetchRequest();
    } catch (err) {
      console.error('Failed to withdraw volunteer response:', err);
      const msg =
        err.response?.data?.message || err.message || 'Failed to withdraw volunteer response.';
      alert(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const getVolunteerBadge = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return 'bg-emerald-100 text-emerald-800';
      case 'BACKUP':
        return 'bg-blue-100 text-blue-900';
      case 'WITHDRAWN':
        return 'bg-stone-100 text-stone-500';
      case 'REJECTED':
        return 'bg-red-100 text-[#d93829]';
      default:
        return 'bg-amber-100 text-amber-900';
    }
  };

  return {
    request,
    loading,
    error,
    statusCode,
    fetchRequest,
    cancelling,
    completing,
    confirmingComplete,
    setConfirmingComplete,
    actionLoading,
    responseToWithdraw,
    setResponseToWithdraw,
    handleCancelRequest,
    handleCompleteRequest,
    handleShare,
    shareFeedback,
    handleVolunteer,
    handleStatusChange,
    handleWithdraw,
    confirmWithdraw,
    getVolunteerBadge,
  };
};

export default useRequestDetailPage;
