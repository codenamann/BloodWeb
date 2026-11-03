import React from 'react';
import { Building, MapPin } from 'lucide-react';
import { UrgencyBadge } from '../../../components/common/UrgencyBadge';
import { RequestCardActions } from '../../../components/common/RequestCardActions';
import { formatHumanDateTime, formatDistanceKm } from '../../../utils/dateUtils';
import { isDonorCompatible } from '../../../utils/compatibility';

export const DonorRequestCard = ({
  request,
  currentUser,
  onVolunteer,
  onClick,
}) => {
  const hospitalName =
    request.hospitalName || request.hospitalId?.name || 'Hospital';
  const distanceText = formatDistanceKm(request.distanceKm);
  const neededByText = formatHumanDateTime(request.neededBy);

  const currentUserId = (currentUser?._id || currentUser?.id)?.toString();
  const reqCreatorId = (
    request.createdBy?._id ||
    request.createdBy?.id ||
    request.createdBy
  )?.toString();
  const isRequester = Boolean(currentUserId && reqCreatorId === currentUserId);
  const isTerminal = ['COMPLETED', 'CANCELLED', 'EXPIRED'].includes(request.status);

  const hasVolunteered = Boolean(
    currentUserId &&
    request.responses?.some((r) => {
      const donorId = (
        r.donorId?._id ||
        r.donorId?.id ||
        (typeof r.donorId === 'string' ? r.donorId : null) ||
        r.donor?._id ||
        r.donor?.id ||
        r.donorId
      )?.toString();
      return donorId && donorId === currentUserId && r.status !== 'WITHDRAWN';
    })
  );

  const isCompatible = currentUser?.bloodGroup
    ? isDonorCompatible(currentUser.bloodGroup, request.patientBloodGroup)
    : true;

  return (
    <div
      onClick={onClick}
      className="clay-card p-4 sm:p-5 bg-white/95 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md cursor-pointer transition-all group"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Blood Group Pill */}
        <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#d93829] font-black text-xl flex items-center justify-center shrink-0 shadow-xs border border-red-100 group-hover:scale-105 transition-transform">
          {request.patientBloodGroup}
        </div>

        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-black text-stone-900 group-hover:text-[#d93829] transition-colors">
              {request.unitsNeeded}{' '}
              {request.unitsNeeded === 1 ? 'Unit' : 'Units'} of{' '}
              {request.patientBloodGroup}
            </span>
            <UrgencyBadge urgency={request.urgency} />
          </div>
          <div className="text-xs text-stone-600 font-medium flex items-center gap-1">
            <Building className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="truncate">{hospitalName}</span>
          </div>
          <div className="text-[11px] text-stone-400 font-bold flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#d93829] shrink-0" />
            <span>{distanceText}</span>
            <span>• Needed by {neededByText}</span>
          </div>
        </div>
      </div>

      <RequestCardActions
        request={request}
        isRequester={isRequester}
        hasVolunteered={hasVolunteered}
        isTerminal={isTerminal}
        isCompatible={isCompatible}
        onVolunteer={onVolunteer}
      />
    </div>
  );
};

export default DonorRequestCard;
