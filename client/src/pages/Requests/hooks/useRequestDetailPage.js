import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { isDonorCompatible } from '../../../utils/compatibility';
import { getRequestById, cancelBloodRequest, completeBloodRequest } from '../../../api/request.api';
import {
  volunteerForRequest,
  updateVolunteerStatus,
  withdrawVolunteerResponse,
} from '../../../api/volunteer.api';
import { subscribeToRequestUpdates } from '../../../services/socket';
import { toast } from '../../../components/ui/toast';

export const useRequestDetailPage = (id, setActiveTab) => {
  const { currentUser } = useAuth();
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

  const handleCancelRequest = async (reason) => {
    if (!request) return;
    try {
      setCancelling(true);
      await cancelBloodRequest(request._id, reason || 'Cancelled by requester');
      await fetchRequest();
    } catch (err) {
      console.error('Failed to cancel request:', err);
      alert(err.response?.data?.message || 'Failed to cancel request');
    } finally {
      setCancelling(false);
    }
  };

  const handleCompleteRequest = async () => {
    if (!request) return;
    try {
      setCompleting(true);
      await completeBloodRequest(request._id);
      await fetchRequest();
      setConfirmingComplete(false);
    } catch (err) {
      console.error('Failed to complete request:', err);
      alert(err.response?.data?.message || 'Failed to complete request');
    } finally {
      setCompleting(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    const text = `URGENT: ${request?.patientBloodGroup || ''} blood needed at ${
      request?.hospitalName || request?.hospitalId?.name || 'hospital'
    }!`;

    if (navigator.share) {
      navigator
        .share({ title: 'BloodWeb Emergency', text, url })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text} ${url}`);
      setShareFeedback(true);
      setTimeout(() => setShareFeedback(false), 2000);
    }
  };

  const [showVolunteerModal, setShowVolunteerModal] = useState(false);

  const handleVolunteer = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setShowVolunteerModal(true);
  };

  const handleVolunteerSuccess = async () => {
    await volunteerForRequest(request._id);
    await fetchRequest();
    if (setActiveTab) setActiveTab('VOLUNTEERS');
  };

  const handleStatusChange = async (responseId, newStatus) => {
    if (!request) return;
    try {
      setActionLoading(true);
      await updateVolunteerStatus(responseId, newStatus);
      await fetchRequest();
      toast.success('Status Updated', `Volunteer status changed to ${newStatus}`);
    } catch (err) {
      console.error('Failed to update status:', err);
      toast.error('Update Failed', err.response?.data?.message || 'Failed to update volunteer status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleWithdraw = (respId) => {
    setResponseToWithdraw(respId);
  };

  const confirmWithdraw = async () => {
    if (!request || !responseToWithdraw) return;
    try {
      setActionLoading(true);
      await withdrawVolunteerResponse(responseToWithdraw);
      await fetchRequest();
      setResponseToWithdraw(null);
      toast.success('Offer Withdrawn', 'Your volunteer offer has been withdrawn.');
    } catch (err) {
      console.error('Failed to withdraw:', err);
      toast.error('Withdraw Failed', err.response?.data?.message || 'Failed to withdraw volunteer response');
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
      case 'DECLINED':
      case 'WITHDRAWN':
        return 'bg-red-100 text-[#d93829]';
      default:
        return 'bg-amber-100 text-amber-900';
    }
  };

  // Derived View Models
  const isRequester = Boolean(currentUser?._id && request?.createdBy?._id === currentUser._id);
  const isCompatible = Boolean(
    currentUser?.bloodGroup &&
    request?.patientBloodGroup &&
    isDonorCompatible(currentUser.bloodGroup, request.patientBloodGroup)
  );

  const currentUserId = (currentUser?._id || currentUser?.id)?.toString();
  const responses = Array.isArray(request?.responses) ? request.responses : [];
  const myResponse = responses.find((resp) => {
    const dId = (
      resp.donorId?._id ||
      resp.donorId?.id ||
      (typeof resp.donorId === 'string' ? resp.donorId : null) ||
      resp.donor?._id ||
      resp.donor?.id ||
      resp.donorId
    )?.toString();
    return currentUserId && dId === currentUserId && resp.status !== 'WITHDRAWN';
  });
  const alreadyVolunteered = Boolean(myResponse);
  const hasAcceptedVolunteers = responses.some((r) => r.status === 'ACCEPTED');

  const unitsNeeded = request?.fulfillment?.unitsNeeded ?? request?.unitsNeeded ?? 1;
  const fulfilledUnits = request?.fulfillment?.fulfilledUnits ?? 0;
  const remainingUnits =
    request?.fulfillment?.remainingUnits ?? Math.max(0, unitsNeeded - fulfilledUnits);
  const progressPercentage =
    request?.fulfillment?.progressPercentage ??
    Math.min(100, Math.round((fulfilledUnits / (unitsNeeded || 1)) * 100));

  const isTerminal = ['COMPLETED', 'CANCELLED', 'EXPIRED'].includes(request?.status);
  const hospitalName = request?.hospitalName || request?.hospitalId?.name || 'Hospital';
  const hospitalLocation = [
    request?.hospitalAddress || request?.hospitalId?.address,
    request?.hospitalCity || request?.hospitalId?.city,
    request?.hospitalState || request?.hospitalId?.state,
  ]
    .filter(Boolean)
    .join(', ');
  const hospitalCoords = request?.hospitalCoordinates || request?.hospitalId?.coordinates || null;

  const formattedCreatedAt = request?.createdAt
    ? new Date(request.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return {
    currentUser,
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
    showVolunteerModal,
    setShowVolunteerModal,
    handleVolunteer,
    handleVolunteerSuccess,
    handleStatusChange,
    handleWithdraw,
    confirmWithdraw,
    getVolunteerBadge,
    // Derived
    isRequester,
    isCompatible,
    responses,
    myResponse,
    alreadyVolunteered,
    hasAcceptedVolunteers,
    unitsNeeded,
    fulfilledUnits,
    remainingUnits,
    progressPercentage,
    isTerminal,
    hospitalName,
    hospitalLocation,
    hospitalCoords,
    formattedCreatedAt,
  };
};

export default useRequestDetailPage;
