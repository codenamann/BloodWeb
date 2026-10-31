import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Building,
  MapPin,
  Clock,
  Heart,
  Droplets,
  ShieldCheck,
  CheckCircle2,
  Users,
  AlertCircle,
  AlertTriangle,
  Loader2,
  FileText,
  Phone,
  MessageSquare,
  Share2,
  Trash2,
  Check,
  UserCheck,
  ChevronRight,
  ExternalLink,
  Info,
  RefreshCw,
} from 'lucide-react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isDonorCompatible } from '../../utils/compatibility';
import { getRequestById, cancelBloodRequest, completeBloodRequest } from '../../api/request.api';
import {
  volunteerForRequest,
  updateVolunteerStatus,
  withdrawVolunteerResponse,
} from '../../api/volunteer.api';
import { subscribeToRequestUpdates } from '../../services/socket';

import ClayAvatar from '../../components/ClayAssets/ClayAvatar';
import ClayBloodDrop from '../../components/ClayAssets/ClayBloodDrop';
import { ClayHandsHeart } from '../../components/ClayAssets/ClayIllustrations';
import { HospitalDocumentPreview } from '../../components/HospitalDocumentPreview';
import { RequestDetailSkeleton } from './components/RequestDetailSkeleton';

const formatNeededBy = (val) => {
  if (!val) return 'As soon as possible';
  const d = new Date(val);
  if (isNaN(d.getTime())) return val;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const RequestDetailPage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusCode, setStatusCode] = useState(null);

  const [activeTab, setActiveTab] = useState('OVERVIEW'); // 'OVERVIEW' | 'VOLUNTEERS' | 'COORDINATION'
  const [shareFeedback, setShareFeedback] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [confirmingComplete, setConfirmingComplete] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionFeedback, setActionFeedback] = useState(null);

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

  // Subscribe to real-time updates for this blood request
  useEffect(() => {
    if (!id) return;

    const cleanup = subscribeToRequestUpdates(id, {
      VOLUNTEER_RESPONDED: () => {
        fetchRequest();
      },
      VOLUNTEER_STATUS_CHANGED: () => {
        fetchRequest();
      },
      REQUEST_COMPLETED: () => {
        fetchRequest();
      },
      REQUEST_CANCELLED: () => {
        fetchRequest();
      },
    });

    return cleanup;
  }, [id, fetchRequest]);

  // Handle in-place cancellation by requester
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

  // Handle in-place completion by requester
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

  // Submit volunteer response
  const handleVolunteer = async () => {
    if (!request?._id) return;
    setActionLoading(true);
    setActionFeedback(null);

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
        // Geolocation denied or timed out; backend handles missing coordinates safely
      }
    }

    try {
      await volunteerForRequest(request._id, locationAtResponse);
      await fetchRequest();
      setActiveTab('VOLUNTEERS');
    } catch (err) {
      console.error('Failed to volunteer:', err);
      const msg =
        err.response?.data?.message || err.message || 'Failed to volunteer for this request.';
      alert(msg);
    } finally {
      setActionLoading(false);
    }
  };

  // Creator updates volunteer status (ACCEPTED or BACKUP)
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

  // Donor withdraws their response
  const [responseToWithdraw, setResponseToWithdraw] = useState(null);

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

  // =========================================================================
  // 1. ASYNC STATE: LOADING SKELETON
  // =========================================================================
  if (loading) {
    return <RequestDetailSkeleton />;
  }

  // =========================================================================
  // 2. ASYNC STATE: 404 NOT FOUND (Distinct from Server/Network Error)
  // =========================================================================
  if (statusCode === 404 || (!request && !error)) {
    return (
      <div className="clay-card p-10 sm:p-12 text-center bg-white space-y-4 max-w-lg mx-auto my-12 shadow-sm">
        <div className="w-16 h-16 rounded-3xl bg-red-50 text-[#d93829] flex items-center justify-center mx-auto border border-red-100">
          <Droplets className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-stone-900">
            Blood Request Not Found
          </h2>
          <p className="text-xs text-stone-500 leading-relaxed">
            The requested blood emergency does not exist or may have been removed.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/requests"
            className="clay-btn-crimson px-5 py-2.5 text-xs font-bold inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Requests</span>
          </Link>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. ASYNC STATE: RECOVERABLE ERROR / NETWORK FAILURE
  // =========================================================================
  if (error || !request) {
    return (
      <div className="clay-card p-8 sm:p-10 text-center bg-white space-y-4 max-w-lg mx-auto my-12 border border-red-100 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#d93829] flex items-center justify-center mx-auto border border-red-100">
          <AlertCircle className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-black text-stone-900">
            Unable to Load Request
          </h2>
          <p className="text-xs text-stone-500 leading-relaxed">
            {error || 'An unexpected error occurred while fetching request details.'}
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={fetchRequest}
            className="clay-btn-crimson px-4 py-2 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
          <Link
            to="/requests"
            className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Requests</span>
          </Link>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 4. ASYNC STATE: SUCCESSFUL DATA STATE
  // =========================================================================
  const isRequester = !!(currentUser?._id && request.createdBy?._id === currentUser._id);
  const isCompatible = !!(
    currentUser?.bloodGroup &&
    isDonorCompatible(currentUser.bloodGroup, request.patientBloodGroup)
  );

  const responses = Array.isArray(request.responses) ? request.responses : [];
  const myResponse = responses.find(
    (resp) =>
      currentUser?._id &&
      (resp.donorId === currentUser._id || resp.donor?._id === currentUser._id)
  );
  const alreadyVolunteered = !!myResponse;
  const hasAcceptedVolunteers = responses.some((r) => r.status === 'ACCEPTED');

  // Fulfillment metrics from backend contract
  const unitsNeeded = request.fulfillment?.unitsNeeded ?? request.unitsNeeded ?? 1;
  const fulfilledUnits = request.fulfillment?.fulfilledUnits ?? 0;
  const remainingUnits =
    request.fulfillment?.remainingUnits ?? Math.max(0, unitsNeeded - fulfilledUnits);
  const progressPercentage =
    request.fulfillment?.progressPercentage ??
    Math.min(100, Math.round((fulfilledUnits / (unitsNeeded || 1)) * 100));

  const isTerminal = ['COMPLETED', 'CANCELLED', 'EXPIRED'].includes(request.status);

  // Hospital formatting with graceful coordinate fallbacks
  const hospitalName = request.hospitalName || request.hospitalId?.name || 'Hospital';
  const hospitalLocation = [
    request.hospitalAddress || request.hospitalId?.address,
    request.hospitalCity || request.hospitalId?.city,
    request.hospitalState || request.hospitalId?.state,
  ]
    .filter(Boolean)
    .join(', ');
  const hospitalCoords = request.hospitalCoordinates || request.hospitalId?.coordinates || null;

  const formattedCreatedAt = request.createdAt
    ? new Date(request.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & BREADCRUMB */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/requests"
            className="inline-flex items-center gap-1.5 text-xs font-black text-stone-500 hover:text-stone-900 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Requests</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-[#1c1d22] tracking-tight">
              Request Details
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                request.status === 'ACTIVE'
                  ? 'bg-emerald-100 text-emerald-800'
                  : request.status === 'CANCELLED'
                  ? 'bg-red-100 text-[#d93829]'
                  : request.status === 'PARTIALLY_FULFILLED'
                  ? 'bg-amber-100 text-amber-800'
                  : request.status === 'FULFILLED'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-stone-100 text-stone-700'
              }`}
            >
              {request.status?.replace('_', ' ')}
            </span>
          </div>

          <p className="text-xs text-stone-500 font-medium mt-1">
            Request ID: <span className="font-bold text-stone-800">#{request._id}</span>
            {formattedCreatedAt && <> • Created on {formattedCreatedAt}</>}
          </p>
        </div>

        {/* Requester Actions / Coordination Room */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isRequester && !isTerminal && (
            <div className="flex items-center gap-2">
              {hasAcceptedVolunteers && (
                confirmingComplete ? (
                  <div className="flex items-center gap-1.5 animate-fadeIn">
                    <button
                      onClick={handleCompleteRequest}
                      disabled={completing}
                      className="px-3.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{completing ? 'Completing...' : 'Yes, Confirm'}</span>
                    </button>
                    <button
                      onClick={() => setConfirmingComplete(false)}
                      disabled={completing}
                      className="px-2.5 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmingComplete(true)}
                    disabled={completing || cancelling || actionLoading}
                    className="px-4 py-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Mark Completed</span>
                  </button>
                )
              )}
              <button
                onClick={handleCancelRequest}
                disabled={cancelling || completing || actionLoading}
                className="px-4 py-2 rounded-2xl bg-red-50 hover:bg-red-100 text-[#d93829] text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{cancelling ? 'Cancelling...' : 'Cancel Request'}</span>
              </button>
            </div>
          )}

          <button
            onClick={() => navigate(`/coordination/${request._id}`)}
            className="clay-btn-crimson px-4 py-2.5 text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Coordination Room</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN REQUEST HERO CARD */}
      {/* ========================================================================= */}
      <div className="clay-card p-6 sm:p-8 bg-white/95 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-stone-100">
          {/* Blood Type & Units */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-red-50 text-[#d93829] font-black text-2xl sm:text-3xl flex flex-col items-center justify-center shrink-0 shadow-xs border border-red-100">
              <span>{request.patientBloodGroup}</span>
              <span className="text-[8px] font-bold text-stone-400 uppercase">TYPE</span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    request.urgency === 'CRITICAL'
                      ? 'bg-red-100 text-[#d93829]'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {request.urgency} URGENCY
                </span>
                <span className="text-xs text-stone-400 font-bold">
                  Needed by{' '}
                  <span className="text-stone-800 font-extrabold">
                    {formatNeededBy(request.neededBy)}
                  </span>
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900">
                {unitsNeeded} {unitsNeeded === 1 ? 'Unit' : 'Units'} Needed
              </h2>
              <p className="text-xs text-stone-500 font-medium flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-[#d93829]" />
                <span>
                  For a patient at <strong className="text-stone-800">{hospitalName}</strong>
                </span>
              </p>
            </div>
          </div>

          {/* 3D Clay Hands Illustration in Hero */}
          <div className="hidden md:flex shrink-0">
            <ClayHandsHeart size={140} />
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-stone-100 pb-2 overflow-x-auto">
          {[
            { id: 'OVERVIEW', label: 'Overview' },
            { id: 'VOLUNTEERS', label: `Volunteers (${responses.length})` },
            { id: 'COORDINATION', label: 'Coordination Room' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'COORDINATION') {
                    navigate(`/coordination/${request._id}`);
                  } else {
                    setActiveTab(tab.id);
                  }
                }}
                className={`relative px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap hover:opacity-90 ${
                  isActive ? 'text-white' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="request-detail-tab"
                    className="absolute inset-0 clay-btn-crimson text-white shadow-xs transition-none!"
                    style={{ borderRadius: 12 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ======================================================================= */}
        {/* TAB CONTENT: OVERVIEW */}
        {/* ======================================================================= */}
        {activeTab === 'OVERVIEW' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2-Cols: Info Cards */}
            <div className="lg:col-span-2 space-y-4">
              {/* Hospital Information Card */}
              <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-black text-stone-900 uppercase tracking-wider">
                    <Building className="w-4 h-4 text-[#d93829]" />
                    <span>Hospital Information</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Verified Center
                  </span>
                </div>
                <div className="text-sm font-black text-stone-900">{hospitalName}</div>
                {hospitalLocation && (
                  <p className="text-xs text-stone-500 font-medium">{hospitalLocation}</p>
                )}

                {/* Safe Map Link - only rendered if coordinates exist */}
                {hospitalCoords?.lat != null && hospitalCoords?.lng != null && (
                  <div className="pt-1">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${hospitalCoords.lat},${hospitalCoords.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#d93829] hover:underline"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>View on Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Request Details & Requester Note */}
              <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-3">
                <div className="text-xs font-black text-stone-900 uppercase tracking-wider">
                  Clinical Context & Instructions
                </div>
                <p className="text-xs text-stone-700 font-medium leading-relaxed bg-white p-3 rounded-xl border border-stone-100 italic">
                  "{request.patientCondition || 'Emergency blood requirement for medical treatment.'}"
                </p>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-stone-500 font-medium">Request Creator:</span>
                  <span className="font-bold text-stone-800">
                    {request.createdBy?.name || 'Requester'}
                  </span>
                </div>

                {/* Privacy-Safe Requester Contact Rows: Only present for authorized viewers */}
                {(request.createdBy?.phone || request.createdBy?.email) && (
                  <div className="pt-2 border-t border-stone-200/60 flex flex-wrap items-center gap-4 text-xs font-medium text-stone-600">
                    {request.createdBy.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#d93829]" />
                        <span>{request.createdBy.phone}</span>
                      </span>
                    )}
                    {request.createdBy.email && (
                      <span className="text-stone-500">
                        {request.createdBy.email}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Hospital Document Preview - Only rendered if document is attached */}
              {request.hospitalDocument && (
                <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-3">
                  <div className="text-xs font-black text-stone-900 uppercase tracking-wider">
                    Supporting Document
                  </div>
                  <HospitalDocumentPreview document={request.hospitalDocument} />
                </div>
              )}

              {/* Donor Volunteer Action if not requester */}
              {!isRequester && (
                <div className="p-5 rounded-2xl bg-red-50 border border-red-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-stone-900 uppercase tracking-wider">
                      Donor Response Status
                    </h4>
                    {isCompatible && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Compatible Donor ({currentUser?.bloodGroup})
                      </span>
                    )}
                  </div>

                  {alreadyVolunteered ? (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="text-xs font-black text-emerald-800">
                          You have volunteered for this request
                        </div>
                        <p className="text-[11px] text-stone-600 font-medium">
                          Status:{' '}
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getVolunteerBadge(
                              myResponse?.status
                            )}`}
                          >
                            {myResponse?.status}
                          </span>{' '}
                          • Coordination is open.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {myResponse?.status !== 'WITHDRAWN' && (
                          <button
                            onClick={() => handleWithdraw(myResponse._id)}
                            disabled={actionLoading}
                            className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-red-50 hover:text-[#d93829] text-stone-600 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                          >
                            Withdraw Offer
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/coordination/${request._id}`)}
                          className="clay-btn-crimson px-4 py-2 text-xs font-bold shadow-md cursor-pointer"
                        >
                          Open Coordination Room
                        </button>
                      </div>
                    </div>
                  ) : !isCompatible && currentUser?.bloodGroup ? (
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-100 text-xs font-semibold text-stone-600 border border-stone-200">
                      <AlertCircle className="w-4 h-4 text-stone-400 shrink-0" />
                      <span>
                        Your blood group ({currentUser.bloodGroup}) does not match patient's needed
                        blood group ({request.patientBloodGroup}).
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <p className="text-xs text-stone-600 font-medium">
                        Can you donate blood for this emergency? Your response connects directly with
                        the requester.
                      </p>
                      <button
                        onClick={handleVolunteer}
                        disabled={actionLoading}
                        className="clay-btn-crimson px-5 py-2.5 text-xs font-black shadow-lg cursor-pointer shrink-0 disabled:opacity-50 flex items-center gap-2"
                      >
                        {actionLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                        <span>{actionLoading ? 'Submitting...' : 'Volunteer to Donate'}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right 1-Col: Progress Gauge & Quick Actions */}
            <div className="space-y-4">
              {/* Progress Gauge */}
              <div className="p-5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-center space-y-3">
                <div className="text-xs font-black text-stone-900 uppercase tracking-wider text-left">
                  Request Progress
                </div>

                <div className="relative w-28 h-28 mx-auto flex flex-col items-center justify-center rounded-full bg-white shadow-inner border-4 border-red-100">
                  <span className="text-xl font-black text-stone-900">
                    {fulfilledUnits} / {unitsNeeded}
                  </span>
                  <span className="text-[9px] font-bold text-stone-400 uppercase">
                    Units Fulfilled
                  </span>
                </div>

                <div className="space-y-1.5 text-xs font-semibold text-stone-600 text-left pt-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#d93829]" /> Donated Units:
                    </span>
                    <span className="font-bold text-stone-900">{fulfilledUnits}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-stone-300" /> Units Remaining:
                    </span>
                    <span className="font-bold text-stone-900">{remainingUnits}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-200/60">
                    <span>Progress:</span>
                    <span className="font-bold text-[#d93829]">{progressPercentage}%</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions List */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200/80 space-y-2">
                <div className="text-xs font-black text-stone-900 uppercase tracking-wider mb-2">
                  Quick Actions
                </div>
                <button
                  onClick={handleShare}
                  className="w-full p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 text-xs font-bold text-stone-700 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-stone-500" /> Share Request
                  </span>
                  {shareFeedback && (
                    <span className="text-[10px] text-emerald-600 font-bold">Link Copied!</span>
                  )}
                </button>
                <button
                  onClick={() => navigate(`/coordination/${request._id}`)}
                  className="w-full p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 text-xs font-bold text-stone-700 flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-[#d93829]" />
                  <span>Coordination Room</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB CONTENT: VOLUNTEERS */}
        {/* ======================================================================= */}
        {activeTab === 'VOLUNTEERS' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-stone-900">
                Volunteers Responded ({responses.length})
              </h3>
            </div>

            {responses.length === 0 ? (
              <div className="py-8 text-center text-xs text-stone-400 font-medium">
                No volunteers have responded yet. Compatible donors are notified.
              </div>
            ) : (
              <div className="space-y-3">
                {responses.map((resp) => {
                  const isSelf = !!(
                    currentUser?._id &&
                    (resp.donorId === currentUser._id || resp.donor?._id === currentUser._id)
                  );

                  return (
                    <div
                      key={resp._id}
                      className="p-4 rounded-2xl bg-stone-50/90 border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <ClayAvatar
                          type={resp.donor?.avatarType || 'alex'}
                          size={44}
                          showBadge={false}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-stone-900">
                              {resp.donor?.name || 'Verified Donor'} {isSelf && '(You)'}
                            </span>
                            <span className="px-2 py-0.2 rounded-full bg-red-100 text-[#d93829] text-[10px] font-black">
                              {resp.donor?.bloodGroup || request.patientBloodGroup}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getVolunteerBadge(
                                resp.status
                              )}`}
                            >
                              {resp.status}
                            </span>
                          </div>

                          <div className="text-[11px] text-stone-500 font-medium mt-0.5">
                            {resp.estimatedDistanceKm != null && (
                              <>
                                Distance:{' '}
                                <strong className="text-stone-700">
                                  {resp.estimatedDistanceKm} km away
                                </strong>{' '}
                                •{' '}
                              </>
                            )}
                            Responded{' '}
                            {resp.createdAt
                              ? new Date(resp.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : ''}
                          </div>

                          {/* Privacy-safe contact display: Only if returned by role-aware backend */}
                          {(resp.donor?.phone || resp.donor?.email) && (
                            <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-600 font-medium mt-1">
                              {resp.donor.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3 text-[#d93829]" />
                                  <span>{resp.donor.phone}</span>
                                </span>
                              )}
                              {resp.donor.email && (
                                <span className="text-stone-500">{resp.donor.email}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Controls */}
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        {/* Status Change Controls for Requester */}
                        {isRequester && resp.status !== 'WITHDRAWN' && (
                          <>
                            {resp.status !== 'ACCEPTED' && (
                              <button
                                onClick={() => handleStatusChange(resp._id, 'ACCEPTED')}
                                disabled={actionLoading}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs disabled:opacity-50"
                              >
                                Accept Donor
                              </button>
                            )}
                            {resp.status !== 'BACKUP' && (
                              <button
                                onClick={() => handleStatusChange(resp._id, 'BACKUP')}
                                disabled={actionLoading}
                                className="px-3 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold cursor-pointer transition-colors disabled:opacity-50"
                              >
                                Set as Backup
                              </button>
                            )}
                          </>
                        )}

                        {/* Withdrawal Control for Donor (Self) */}
                        {isSelf && resp.status !== 'WITHDRAWN' && (
                          <button
                            onClick={() => handleWithdraw(resp._id)}
                            disabled={actionLoading}
                            className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-red-50 text-stone-600 hover:text-[#d93829] text-xs font-bold cursor-pointer transition-colors border border-stone-200 disabled:opacity-50"
                          >
                            Withdraw Offer
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. IN-APP WITHDRAWAL CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {responseToWithdraw && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15 }}
              className="clay-card bg-white max-w-md w-full p-6 space-y-5 rounded-3xl shadow-2xl relative border border-stone-200"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-black text-stone-900">
                    Withdraw Volunteer Offer?
                  </h3>
                  <p className="text-xs text-stone-500 font-medium leading-relaxed">
                    Are you sure you want to withdraw your offer to donate for this emergency? The requester will be notified that you are no longer available.
                  </p>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setResponseToWithdraw(null)}
                  disabled={actionLoading}
                  className="clay-btn-cream px-4 py-2.5 text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Keep Offer
                </button>
                <button
                  type="button"
                  onClick={confirmWithdraw}
                  disabled={actionLoading}
                  className="clay-btn-crimson px-5 py-2.5 text-xs font-black text-white flex items-center gap-2 shadow-sm disabled:opacity-60 cursor-pointer"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Withdrawing...</span>
                    </>
                  ) : (
                    <span>Yes, Withdraw Offer</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RequestDetailPage;
