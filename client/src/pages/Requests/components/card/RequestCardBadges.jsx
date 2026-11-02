import React from 'react';
import { Clock, Droplets, Users, CheckCircle2, AlertCircle } from 'lucide-react';

export const RequestCardBadges = ({
  request,
  acceptedVolunteers,
  responseCount,
  isRequester,
  isCompatible,
  currentUser,
  hasVolunteered,
  humanDeadline,
}) => {
  const renderStatusBadge = () => {
    const status = request.status || 'ACTIVE';
    let dotColor = 'bg-emerald-500 animate-pulse';
    let label = status.replace('_', ' ');

    if (status === 'PARTIALLY_FULFILLED') {
      dotColor = 'bg-amber-500';
      label = 'Partially Fulfilled';
    } else if (status === 'FULFILLED') {
      dotColor = 'bg-stone-500';
      label = 'Fulfilled';
    } else if (status === 'COMPLETED') {
      dotColor = 'bg-stone-400';
      label = 'Completed';
    } else if (status === 'CANCELLED') {
      dotColor = 'bg-stone-300';
      label = 'Cancelled';
    } else if (status === 'EXPIRED') {
      dotColor = 'bg-stone-300';
      label = 'Expired';
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-200/80 shadow-2xs">
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
        <span>{label}</span>
      </span>
    );
  };

  const renderUrgencyBadge = () => {
    const urgency = request.urgency || 'ROUTINE';

    if (urgency === 'CRITICAL') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-[#d93829] border border-red-200/80 shadow-2xs">
          <AlertCircle className="w-3 h-3 text-[#d93829]" />
          <span>Critical</span>
        </span>
      );
    }

    if (urgency === 'HIGH') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50/80 text-amber-900 border border-amber-200/60 shadow-2xs">
          <span>High Urgency</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-stone-100 text-stone-600 border border-stone-200/70 shadow-2xs">
        <span>Routine</span>
      </span>
    );
  };

  return (
    <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-stone-100/90 flex-wrap">
      <div className="flex items-center gap-2 flex-wrap">
        {renderStatusBadge()}
        {renderUrgencyBadge()}

        {/* Fulfillment Chip */}
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-100 text-[10px] font-bold text-stone-700 border border-stone-200/80 shadow-2xs">
          <Droplets className="w-3 h-3 text-[#d93829] shrink-0" />
          <span>
            <strong className="font-extrabold text-stone-900">
              {acceptedVolunteers.length} of {request.unitsNeeded}
            </strong>{' '}
            Fulfilled
          </span>
        </span>

        {/* Volunteer Count Chip */}
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-100 text-[10px] font-bold text-stone-700 border border-stone-200/80 shadow-2xs">
          <Users className="w-3 h-3 text-stone-500 shrink-0" />
          <span>
            <strong className="font-extrabold text-stone-900">
              {responseCount}
            </strong>{' '}
            {responseCount === 1 ? 'Volunteer' : 'Volunteers'}
          </span>
        </span>

        {/* Matching Blood Type Badge for compatible donors */}
        {!isRequester && isCompatible && currentUser?.bloodGroup && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80 shadow-2xs">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Matches Blood ({currentUser.bloodGroup})</span>
          </span>
        )}

        {hasVolunteered && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80 shadow-2xs">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>You Volunteered</span>
          </span>
        )}
      </div>

      {/* Needed By at top-right */}
      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 shrink-0">
        <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
        <span>
          Needed by{' '}
          <strong className="text-stone-800 font-bold">
            {humanDeadline}
          </strong>
        </span>
      </div>
    </div>
  );
};

export default RequestCardBadges;
