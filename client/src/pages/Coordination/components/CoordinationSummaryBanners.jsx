import React from 'react';

export const CoordinationSummaryBanners = ({ request, activeVolunteers }) => {
  const acceptedCount = activeVolunteers.filter(
    (v) => v.status === 'ACCEPTED'
  ).length;
  const unitsNeeded = request.unitsNeeded || 1;
  const progressPct = Math.min(
    100,
    Math.round((acceptedCount / unitsNeeded) * 100)
  );

  return (
    <>
      {/* Emergency Requirement Summary Banner */}
      <div className="col-span-full w-full p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-red-500 to-[#d93829] text-white flex flex-wrap items-center justify-between gap-3 shadow-md">
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
    </>
  );
};

export default CoordinationSummaryBanners;
