import React from 'react';
import { Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { isDonorCompatible } from '../../../utils/compatibility';
import { RequestCardBadges, RequestCardActions } from './card';

export const formatHumanDateTime = (dateVal) => {
  if (!dateVal) return 'Immediate / ASAP';
  if (
    typeof dateVal === 'string' &&
    (dateVal.includes('Immediate') ||
      dateVal.includes('mins') ||
      dateVal.includes('hours'))
  ) {
    return dateVal;
  }
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return String(dateVal);

  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const isTomorrow =
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear();

  const timeStr = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  if (isToday) return `Today at ${timeStr}`;
  if (isTomorrow) return `Tomorrow at ${timeStr}`;

  const dateStr = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() === now.getFullYear() ? undefined : 'numeric',
  });

  return `${dateStr} at ${timeStr}`;
};

export const RequestCard = ({
  request,
  currentUser,
  currentUserId,
  onCancel,
  onVolunteer,
}) => {
  const navigate = useNavigate();

  const acceptedVolunteers =
    request.responses?.filter((r) => r.status === 'ACCEPTED') || [];

  const reqCreatorId = (
    request.createdBy?._id ||
    request.createdBy?.id ||
    request.createdBy
  )?.toString();
  const isRequester = currentUserId && reqCreatorId === currentUserId;
  const isTerminal = ['COMPLETED', 'CANCELLED', 'EXPIRED'].includes(request.status);

  const hasVolunteered = Boolean(
    currentUserId &&
    request.responses?.some((r) => {
      const donorId = (r.donorId || r.donor?._id || r.donor?.id)?.toString();
      return donorId === currentUserId;
    })
  );

  const isCompatible = currentUser?.bloodGroup
    ? isDonorCompatible(currentUser.bloodGroup, request.patientBloodGroup)
    : true;

  const humanDeadline = formatHumanDateTime(request.neededBy);
  const responseCount = request.responses?.length || 0;

  return (
    <div
      onClick={() => navigate(`/requests/${request._id}`)}
      className="clay-card p-4 sm:p-5 bg-white/95 rounded-2xl sm:rounded-3xl border border-stone-200/60 shadow-sm hover:shadow-md transition-all flex flex-col gap-3.5 group cursor-pointer"
    >
      <RequestCardBadges
        request={request}
        acceptedVolunteers={acceptedVolunteers}
        responseCount={responseCount}
        isRequester={isRequester}
        isCompatible={isCompatible}
        currentUser={currentUser}
        hasVolunteered={hasVolunteered}
        humanDeadline={humanDeadline}
      />

      {/* MAIN ROW: BLOOD GROUP TILE + DETAILS + ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Side: Blood Group Tile + Request Info */}
        <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-red-50 to-red-100/80 border border-red-200/70 shadow-xs flex flex-col items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
            <span className="text-xl sm:text-2xl font-black text-[#d93829] leading-none tracking-tight">
              {request.patientBloodGroup}
            </span>
            <span className="text-[8px] font-black tracking-widest text-[#d93829]/70 uppercase mt-0.5">
              TYPE
            </span>
          </div>

          <div className="min-w-0 space-y-1 flex-1">
            <h3 className="text-base sm:text-lg font-black text-[#1c1d22] group-hover:text-[#d93829] transition-colors leading-tight truncate">
              {request.unitsNeeded}{' '}
              {request.unitsNeeded === 1 ? 'Unit' : 'Units'} Needed
            </h3>

            <div className="flex items-center gap-1.5 text-xs text-stone-600 font-medium">
              <Building2 className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span className="font-semibold text-stone-700 truncate">
                {request.hospitalName || 'Unspecified Hospital'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Action Buttons cluster */}
        <RequestCardActions
          request={request}
          isRequester={isRequester}
          hasVolunteered={hasVolunteered}
          isTerminal={isTerminal}
          isCompatible={isCompatible}
          onVolunteer={onVolunteer}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
};

export default RequestCard;
