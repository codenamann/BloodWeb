import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Trash2,
  MessageSquare,
  Heart,
  RefreshCw,
} from 'lucide-react';

export const RequestDetailHeader = ({
  request,
  formattedCreatedAt,
  isRequester,
  isTerminal,
  hasAcceptedVolunteers,
  confirmingComplete,
  setConfirmingComplete,
  handleCompleteRequest,
  handleCancelRequest,
  completing,
  cancelling,
  actionLoading,
  alreadyVolunteered,
  isCompatible,
  handleVolunteer,
}) => {
  const navigate = useNavigate();

  return (
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
          Request ID:{' '}
          <span className="font-bold text-stone-800">#{request._id}</span>
          {formattedCreatedAt && <> • Created on {formattedCreatedAt}</>}
        </p>
      </div>

      {/* Header Actions: Requester Controls or Volunteer/Coordination Action */}
      <div className="flex items-center gap-2 self-start sm:self-auto">
        {isRequester && !isTerminal && (
          <div className="flex items-center gap-2">
            {hasAcceptedVolunteers &&
              (confirmingComplete ? (
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
              ))}
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

        {/* Dynamic Action: Coordination Room when authorized, or Volunteer to Donate when not */}
        {isRequester || alreadyVolunteered ? (
          <button
            onClick={() => navigate(`/coordination/${request._id}`)}
            className="clay-btn-crimson px-4 py-2.5 text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Coordination Room</span>
          </button>
        ) : (
          !isTerminal &&
          isCompatible && (
            <button
              onClick={handleVolunteer}
              disabled={actionLoading}
              className="clay-btn-crimson px-5 py-3 text-xs font-black text-white flex items-center gap-2 shadow-sm transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {actionLoading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Heart className="w-3.5 h-3.5 fill-white" />
              )}
              <span>
                {actionLoading ? 'Submitting...' : 'Volunteer to Donate'}
              </span>
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default RequestDetailHeader;
