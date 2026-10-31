import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Filter,
  MapPin,
  Building,
  Clock,
  Droplets,
  Heart,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Users,
  ChevronRight,
  XCircle,
  Trash2,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBloodRequests } from '../../context/BloodRequestContext';
import { toast } from '../../components/ui/toast';

import { isDonorCompatible } from '../../utils/compatibility';
import { ClayBloodDrop } from '../../components/ClayAssets/ClayBloodDrop';
import {
  ClayCalendar,
  ClayDropCharacter,
} from '../../components/ClayAssets/ClayIllustrations';
import RequestCard from './components/RequestCard';
import RequestCardSkeleton from './components/RequestCardSkeleton';

export const RequestsPage = () => {
  const { currentUser } = useAuth();
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

  const [statusTab, setStatusTab] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'PARTIALLY_FULFILLED' | 'FULFILLED' | 'COMPLETED' | 'CANCELLED'
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [scopeTab, setScopeTab] = useState('MINE'); // 'RECEIVED' (incoming matching blood) | 'MINE' (created by user)

  // In-app cancellation modal state
  const [requestToCancel, setRequestToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const bloodGroups = ['ALL', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const currentUserId = (currentUser?._id || currentUser?.id)?.toString();

  // Active dataset and pagination based on current scope tab
  const displayedRequests = scopeTab === 'MINE' ? myRequests : networkRequests;
  const currentPagination = scopeTab === 'MINE' ? myPagination : networkPagination;
  const hasMore = Boolean(currentPagination?.hasMore);

  // Initial fetch of both datasets to populate badge counts on mount
  const initialFetchDone = useRef(false);
  useEffect(() => {
    if (!initialFetchDone.current) {
      initialFetchDone.current = true;
      fetchMyRequests({}, false);
      fetchNetworkRequests({}, false);
    }
  }, [fetchMyRequests, fetchNetworkRequests]);

  // Debounced server-side query when filters, search, or scope changes
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

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. PAGE HEADER */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-[#1c1d22] tracking-tight">
              My Requests
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-[#d93829] text-xs font-black">
              {currentPagination.total ?? displayedRequests.length} Total
            </span>
            {loading && displayedRequests.length > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-500 text-xs font-bold animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin text-[#d93829]" />
                <span>Updating...</span>
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1">
            Manage and track your emergency blood donation requests in real time.
          </p>
        </div>

        <button
          onClick={() => navigate('/requests/create')}
          className="clay-btn-crimson px-5 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Blood Request</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 2. SCOPE & STATUS TABS TOOLBAR */}
      {/* ========================================================================= */}
      <div className="clay-card-flat p-4 bg-white/95 space-y-3.5 shadow-xs">
        {/* Top Row: Scope Selector + Search & Blood Group Filter */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Scope Switch (Received Requests vs My Created) */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-stone-100/90 max-w-fit flex-wrap">
            <button
              onClick={() => setScopeTab('MINE')}
              className={`relative px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer hover:opacity-90 ${
                scopeTab === 'MINE'
                  ? 'text-white'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {scopeTab === 'MINE' && (
                <motion.div
                  layoutId="requests-scope-tab"
                  className="absolute inset-0 clay-btn-crimson text-white shadow-xs transition-none!"
                  style={{ borderRadius: 12 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <span>My Created</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    scopeTab === 'MINE'
                      ? 'bg-white/20 text-white'
                      : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {myPagination.total || 0}
                </span>
              </span>
            </button>

            <button
              onClick={() => setScopeTab('RECEIVED')}
              className={`relative px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer hover:opacity-90 ${
                scopeTab === 'RECEIVED'
                  ? 'text-white'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {scopeTab === 'RECEIVED' && (
                <motion.div
                  layoutId="requests-scope-tab"
                  className="absolute inset-0 clay-btn-crimson text-white shadow-xs transition-none!"
                  style={{ borderRadius: 12 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <span>Received Requests</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    scopeTab === 'RECEIVED'
                      ? 'bg-white/20 text-white'
                      : 'bg-red-100 text-[#d93829]'
                  }`}
                >
                  {networkPagination.total || 0}
                </span>
              </span>
            </button>
          </div>

          {/* Search Input & Blood Group Selector */}
          <div className="flex items-center gap-2 flex-1 md:max-w-md">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hospital, city, condition..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-[#faf7f2] rounded-xl border border-stone-200/80 focus:outline-none focus:ring-2 focus:ring-[#d93829]/30 font-medium"
              />
            </div>

            <select
              value={selectedBloodGroup}
              onChange={(e) => setSelectedBloodGroup(e.target.value)}
              className="px-3 py-2 text-xs font-extrabold bg-[#faf7f2] rounded-xl border border-stone-200/80 text-stone-700 cursor-pointer focus:outline-none"
            >
              {bloodGroups.map((bg) => (
                <option key={bg} value={bg}>
                  {bg === 'ALL' ? 'All Blood Types' : `Type ${bg}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bottom Row: Status Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {[
            { id: 'ALL', label: 'All Statuses' },
            { id: 'ACTIVE', label: 'Active' },
            { id: 'PARTIALLY_FULFILLED', label: 'Partially Fulfilled' },
            { id: 'FULFILLED', label: 'Fulfilled' },
            { id: 'COMPLETED', label: 'Completed' },
            { id: 'CANCELLED', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                statusTab === tab.id
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100/80 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. REQUESTS LIST GRID */}
      {/* ========================================================================= */}
      {loading && displayedRequests.length === 0 ? (
        <div className="space-y-4">
          <RequestCardSkeleton />
          <RequestCardSkeleton />
          <RequestCardSkeleton />
        </div>
      ) : error && displayedRequests.length === 0 ? (
        <div className="clay-card p-12 text-center bg-white space-y-4 shadow-sm border border-stone-200">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-[#d93829]">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-black text-stone-900">
              Requests Could Not Be Loaded
            </h3>
            <p className="text-xs text-stone-500 font-medium">
              {error}
            </p>
          </div>
          <button
            onClick={handleRetry}
            className="clay-btn-crimson px-5 py-2.5 text-xs font-bold inline-flex items-center gap-2 shadow-md cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      ) : displayedRequests.length === 0 ? (
        <div className="clay-card p-12 text-center bg-white space-y-4 shadow-sm">
          <div className="w-16 h-16 mx-auto flex items-center justify-center">
            <ClayBloodDrop size={54} />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-black text-stone-900">
              No Blood Requests Found
            </h3>
            <p className="text-xs text-stone-500 font-medium">
              {scopeTab === 'MINE'
                ? "You haven't posted any blood requests matching the selected filters."
                : currentUser?.bloodGroup
                  ? `No emergency blood requests matching your blood type (${currentUser.bloodGroup}) and selected filters right now.`
                  : 'No active blood requests match your search criteria right now.'}
            </p>
          </div>
          <button
            onClick={() => navigate('/requests/create')}
            className="clay-btn-crimson px-5 py-2.5 text-xs font-bold inline-flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Request</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-center justify-between gap-3 text-xs text-rose-800">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-semibold">{error}</span>
              </div>
              <button
                onClick={handleRetry}
                className="px-3 py-1 rounded-xl bg-white border border-rose-300 font-bold text-rose-700 hover:bg-rose-100 transition-colors shrink-0 cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          {displayedRequests.map((req) => (
            <RequestCard
              key={req._id}
              request={req}
              currentUser={currentUser}
              currentUserId={currentUserId}
              onCancel={handleCancelRequest}
              onVolunteer={handleVolunteer}
            />
          ))}

          {/* Load More Button */}
          {hasMore && (
            <div className="pt-4 pb-2 flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="clay-btn-cream px-6 py-2.5 text-xs font-black text-stone-700 hover:text-stone-900 shadow-sm flex items-center gap-2 disabled:opacity-60 cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#d93829]" />
                    <span>Loading more requests...</span>
                  </>
                ) : (
                  <>
                    <span>Load More Requests</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-stone-200/80 font-bold text-stone-600">
                      Page {(currentPagination?.page || 1) + 1}
                    </span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. IN-APP CANCELLATION CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {requestToCancel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15 }}
              className="clay-card bg-white max-w-md w-full p-6 space-y-5 rounded-3xl shadow-2xl relative border border-stone-200"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-[#d93829] flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-black text-stone-900">
                    Cancel Blood Request?
                  </h3>
                  <p className="text-xs text-stone-500 font-medium leading-relaxed">
                    Are you sure you want to cancel this emergency request? Any registered volunteers will be notified that this request is no longer active. This action cannot be undone.
                  </p>
                </div>
              </div>

              {/* Request snippet */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between text-xs">
                <div>
                  <span className="font-extrabold text-stone-900">
                    {requestToCancel.unitsNeeded} {requestToCancel.unitsNeeded === 1 ? 'Unit' : 'Units'} needed
                  </span>
                  <div className="text-[11px] text-stone-500 truncate max-w-[200px]">
                    {requestToCancel.hospitalName || 'Hospital'}
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-red-50 text-[#d93829] font-black border border-red-200/70 text-xs">
                  {requestToCancel.patientBloodGroup}
                </span>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setRequestToCancel(null)}
                  disabled={cancelling}
                  className="clay-btn-cream px-4 py-2.5 text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Keep Request
                </button>
                <button
                  type="button"
                  onClick={confirmCancel}
                  disabled={cancelling}
                  className="clay-btn-crimson px-5 py-2.5 text-xs font-black text-white flex items-center gap-2 shadow-sm disabled:opacity-60 cursor-pointer"
                >
                  {cancelling ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Cancelling...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Yes, Cancel Request</span>
                    </>
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

export default RequestsPage;
