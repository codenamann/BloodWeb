import React from 'react';
import { Building, MapPin, ArrowRight, ChevronRight } from 'lucide-react';
import { UrgencyBadge } from '../../../components/common/UrgencyBadge';

export const DonorRequestCard = ({ request, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="clay-card p-4 sm:p-5 bg-white/95 flex items-center justify-between gap-4 hover:shadow-md cursor-pointer transition-all group"
    >
      <div className="flex items-center gap-3.5">
        {/* Blood Group Pill */}
        <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#d93829] font-black text-xl flex items-center justify-center shrink-0 shadow-xs border border-red-100 group-hover:scale-105 transition-transform">
          {request.patientBloodGroup}
        </div>

        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-stone-900 group-hover:text-[#d93829] transition-colors">
              {request.unitsNeeded}{' '}
              {request.unitsNeeded === 1 ? 'Unit' : 'Units'} of{' '}
              {request.patientBloodGroup}
            </span>
            <UrgencyBadge urgency={request.urgency} />
          </div>
          <div className="text-xs text-stone-600 font-medium flex items-center gap-1">
            <Building className="w-3.5 h-3.5 text-stone-400" />
            <span>{request.hospitalName}</span>
          </div>
          <div className="text-[11px] text-stone-400 font-bold flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#d93829]" />
            <span>{request.distanceKm} km away</span>
            <span>• Needed by {request.neededBy || 'Today'}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden sm:inline-flex text-xs font-black text-[#d93829] group-hover:translate-x-0.5 transition-transform items-center gap-1">
          <span>Respond</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
        <ChevronRight className="w-5 h-5 text-stone-400 sm:hidden" />
      </div>
    </div>
  );
};

export default DonorRequestCard;
