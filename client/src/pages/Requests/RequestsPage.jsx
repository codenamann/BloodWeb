import React from 'react';
import { AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

import RequestCard from './components/RequestCard';
import RequestCardSkeleton from './components/RequestCardSkeleton';
import {
  RequestsHeader,
  RequestsFilterBar,
  RequestsEmptyState,
  CancelRequestModal,
} from './components/list';
import { useRequestsPageData } from './hooks/useRequestsPageData';

const BLOOD_GROUPS = ['ALL', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export const RequestsPage = () => {
  const { currentUser } = useAuth();
  const {
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
  } = useRequestsPageData(currentUser);

  return (
    <div className="space-y-6">
      <RequestsHeader
        totalCount={currentPagination.total ?? displayedRequests.length}
        loading={loading}
        hasItems={displayedRequests.length > 0}
      />

      <RequestsFilterBar
        scopeTab={scopeTab}
        setScopeTab={setScopeTab}
        myTotal={myPagination.total || 0}
        networkTotal={networkPagination.total || 0}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedBloodGroup={selectedBloodGroup}
        setSelectedBloodGroup={setSelectedBloodGroup}
        bloodGroups={BLOOD_GROUPS}
        statusTab={statusTab}
        setStatusTab={setStatusTab}
      />

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
            <p className="text-xs text-stone-500 font-medium">{error}</p>
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
        <RequestsEmptyState scopeTab={scopeTab} currentUser={currentUser} />
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

      <CancelRequestModal
        requestToCancel={requestToCancel}
        onClose={() => setRequestToCancel(null)}
        confirmCancel={confirmCancel}
        cancelling={cancelling}
      />
    </div>
  );
};

export default RequestsPage;
