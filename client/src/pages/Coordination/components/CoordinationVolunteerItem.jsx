import React from 'react';
import ClayAvatar from '../../../components/ClayAssets/ClayAvatar';

export const CoordinationVolunteerItem = ({
  volunteer,
  request,
  isRequester,
  isClosed,
  updatingVolunteerId,
  handleVolunteerStatusUpdate,
}) => {
  const donorInfo = volunteer.donorId || volunteer.donor || {};
  const isAccepted = volunteer.status === 'ACCEPTED';
  const isPending = volunteer.status === 'PENDING';
  const isBackup = volunteer.status === 'BACKUP';

  const statusConfig = isAccepted
    ? {
        label: 'Accepted',
        dotClass: 'bg-emerald-500',
        tooltipClass: 'bg-emerald-50 text-emerald-800 border-emerald-100',
        arrowClass: 'bg-emerald-50 border-emerald-100',
      }
    : isPending
      ? {
          label: 'Pending',
          dotClass: 'bg-amber-500',
          tooltipClass: 'bg-amber-50 text-amber-900 border-amber-100',
          arrowClass: 'bg-amber-50 border-amber-100',
        }
      : isBackup
        ? {
            label: 'Backup',
            dotClass: 'bg-blue-500',
            tooltipClass: 'bg-blue-50 text-blue-900 border-blue-100',
            arrowClass: 'bg-blue-50 border-blue-100',
          }
        : {
            label: volunteer.status || 'Status',
            dotClass: 'bg-stone-400',
            tooltipClass: 'bg-stone-50 text-stone-700 border-stone-200/60',
            arrowClass: 'bg-stone-50 border-stone-200/60',
          };

  return (
    <div
      className={`group p-3 rounded-xl border flex flex-col gap-2 transition-all ${
        isAccepted
          ? 'bg-emerald-50/50 border-emerald-100'
          : isPending
            ? 'bg-amber-50/40 border-amber-100'
            : 'bg-stone-50 border-stone-100'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ClayAvatar
            src={donorInfo.avatar}
            type="neutral"
            size={32}
            showBadge={false}
          />
          <div>
            <div className="text-xs font-bold text-stone-800">
              {donorInfo.name || 'Verified Donor'}{' '}
              <span className="text-[10px] text-stone-500">
                ({donorInfo.bloodGroup || request.patientBloodGroup})
              </span>
            </div>
            <div className="text-[10px] text-stone-400 font-medium">
              {volunteer.estimatedDistanceKm != null &&
                `${volunteer.estimatedDistanceKm} km away`}
            </div>
          </div>
        </div>

        {/* Status Dot with Hover Colored Tooltip */}
        <div className="relative group/status flex items-center justify-center shrink-0 pr-1 py-1">
          <span
            role="status"
            aria-label={`Status: ${statusConfig.label}`}
            className={`w-2.5 h-2.5 rounded-full ${statusConfig.dotClass} cursor-default`}
          />

          {/* Colored Aria Label Tooltip (Positioned Above Dot, Right-Aligned to prevent overflow) */}
          <div
            role="tooltip"
            className={`absolute bottom-full mb-1.5 right-0 pointer-events-none opacity-0 group-hover/status:opacity-100 transition-opacity duration-150 ease-out z-30 px-2 py-0.5 rounded-md text-[9px] font-black tracking-wider uppercase whitespace-nowrap shadow-xs border ${statusConfig.tooltipClass}`}
          >
            {statusConfig.label}
            {/* Arrow pointing downwards towards the dot */}
            <div
              className={`absolute top-full right-1.5 -mt-1 w-1.5 h-1.5 rotate-45 border-b border-r ${statusConfig.arrowClass}`}
            />
          </div>
        </div>
      </div>

      {/* Volunteer Actions (Zero height when unhovered, expands smoothly to fit buttons on hover) */}
      {isRequester && !isClosed && (
        <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-250 ease-out">
          <div className="overflow-hidden">
            <div className="pt-2 border-t border-stone-200/60 flex items-center gap-2 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {isPending && (
                <>
                  <button
                    type="button"
                    disabled={updatingVolunteerId === volunteer._id}
                    onClick={() =>
                      handleVolunteerStatusUpdate(volunteer._id, 'ACCEPTED')
                    }
                    className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black cursor-pointer disabled:opacity-50 transition-colors shadow-xs text-center"
                  >
                    {updatingVolunteerId === volunteer._id
                      ? 'Updating...'
                      : 'Accept'}
                  </button>
                  <button
                    type="button"
                    disabled={updatingVolunteerId === volunteer._id}
                    onClick={() =>
                      handleVolunteerStatusUpdate(volunteer._id, 'BACKUP')
                    }
                    className="flex-1 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 text-[11px] font-bold cursor-pointer disabled:opacity-50 transition-colors text-center"
                  >
                    Backup
                  </button>
                </>
              )}

              {isAccepted && (
                <>
                  <button
                    type="button"
                    disabled={updatingVolunteerId === volunteer._id}
                    onClick={() =>
                      handleVolunteerStatusUpdate(volunteer._id, 'BACKUP')
                    }
                    className="flex-1 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 border border-stone-200 text-[11px] font-bold cursor-pointer disabled:opacity-50 transition-colors text-center"
                  >
                    Move to Backup
                  </button>
                  <button
                    type="button"
                    disabled={updatingVolunteerId === volunteer._id}
                    onClick={() =>
                      handleVolunteerStatusUpdate(volunteer._id, 'PENDING')
                    }
                    className="flex-1 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-[11px] font-bold cursor-pointer disabled:opacity-50 transition-colors text-center"
                  >
                    Remove
                  </button>
                </>
              )}

              {isBackup && (
                <>
                  <button
                    type="button"
                    disabled={updatingVolunteerId === volunteer._id}
                    onClick={() =>
                      handleVolunteerStatusUpdate(volunteer._id, 'ACCEPTED')
                    }
                    className="flex-1 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[11px] font-black cursor-pointer disabled:opacity-50 transition-colors text-center"
                  >
                    Promote
                  </button>
                  <button
                    type="button"
                    disabled={updatingVolunteerId === volunteer._id}
                    onClick={() =>
                      handleVolunteerStatusUpdate(volunteer._id, 'PENDING')
                    }
                    className="flex-1 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 border border-stone-200 text-[11px] font-bold cursor-pointer disabled:opacity-50 transition-colors text-center"
                  >
                    Remove
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoordinationVolunteerItem;
