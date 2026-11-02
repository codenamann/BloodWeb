import React from 'react';

export const CoordinationSummaryBanners = ({ request, activeVolunteers }) => {
  const acceptedCount = activeVolunteers.filter((v) => v.status === 'ACCEPTED').length;
  const unitsNeeded = request.unitsNeeded || 1;
  const progressPct = Math.min(100, Math.round((acceptedCount / unitsNeeded) * 100));

  return (
    <>
      {/* Emergency Requirement Summary Banner */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-red-500 to-[#d93829] text-white flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-black text-lg">
            {request.patientBloodGroup}
          </div>
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider opacity-90">
              {request.unitsNeeded} Units Required • {request.hospitalName}
            </div>
            <div className="text-[11px] font-medium opacity-80">
              Needed by{' '}
              {request.neededBy
                ? new Date(request.neededBy).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Immediate'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-white/20 text-xs font-bold">
            {request.urgency} Urgency
          </span>
        </div>
      </div>

      {/* Fulfillment Operational Status Banner */}
      <div className="clay-card-flat p-4 bg-white/95 flex flex-wrap items-center justify-between gap-4 shadow-xs border border-stone-200/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#d93829] font-black text-sm flex items-center justify-center border border-red-100 shadow-2xs">
            {request.patientBloodGroup}
          </div>
          <div>
            <div className="text-xs sm:text-sm font-black text-stone-900">
              {acceptedCount} of {unitsNeeded} Units Confirmed
            </div>
            <div className="text-[11px] text-stone-500 font-medium">
              {request.hospitalName} • Hospital Blood Bank Coordination
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="w-40 sm:w-48 h-3 rounded-full bg-stone-100 overflow-hidden p-0.5 border border-stone-200/50">
            <div
              className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs font-black text-stone-800 shrink-0">
            {progressPct}%
          </span>
        </div>
      </div>
    </>
  );
};

export default CoordinationSummaryBanners;
