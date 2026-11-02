import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, ChevronRight } from 'lucide-react';
import { UrgencyBadge } from '../common/UrgencyBadge';

export const RecentRequestsFeed = ({ recentRequests, currentUser }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full lg:w-3/4 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h3 className="text-base md:text-lg font-black text-stone-900 tracking-tight">
          Recent Blood Requests
        </h3>
        <Link
          to="/requests"
          className="text-xs font-black text-[#d93829] hover:underline flex items-center gap-1"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {recentRequests.length === 0 ? (
          <div className="clay-card p-7.5 text-center bg-white/95 text-stone-500 space-y-1 shadow-xs">
            <p className="text-xs font-bold text-stone-700">
              No emergency requests matching your blood type right now
            </p>
            <p className="text-[11px] text-stone-400">
              {currentUser?.bloodGroup
                ? `We will notify you immediately when a patient in need matches ${currentUser.bloodGroup}.`
                : 'Update your blood type in your profile to receive matching donation requests.'}
            </p>
          </div>
        ) : (
          recentRequests.map((req) => (
            <div
              key={req._id}
              onClick={() => navigate(`/requests/${req._id}`)}
              className="clay-card p-4 md:p-5 bg-white/95 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3.5">
                {/* Blood Group Badge */}
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#d93829] font-black text-base flex items-center justify-center shrink-0 shadow-xs border border-red-100">
                  {req.patientBloodGroup}
                </div>

                <div className="space-y-0.5">
                  <div className="text-sm font-black text-stone-900">
                    {req.unitsNeeded} {req.unitsNeeded === 1 ? 'Unit' : 'Units'}{' '}
                    Needed
                  </div>
                  <div className="text-xs text-stone-500 font-medium flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate max-w-[180px] md:max-w-xs">
                      {req.hospitalName}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between w-full md:w-auto md:justify-end gap-3 shrink-0 mt-2 md:mt-0">
                <div className="text-left md:text-right flex md:block items-center gap-2 md:gap-0">
                  <UrgencyBadge urgency={req.urgency} size="sm" />
                  <div className="text-[10px] text-stone-500 font-semibold mt-1">
                    Needed by {req.neededBy || 'Today'}
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-stone-50 text-stone-400 group-hover:text-stone-700">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentRequestsFeed;
