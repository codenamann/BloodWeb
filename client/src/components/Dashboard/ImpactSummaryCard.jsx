import React, { useState } from 'react';
import { differenceInDays } from 'date-fns';
import { Heart, Users, Droplets, ChevronDown } from 'lucide-react';

export const ImpactSummaryCard = ({ currentUser }) => {
  const [impactTimeframe] = useState('All Time');

  return (
    <div className="w-full lg:w-1/3 clay-card p-5 bg-white/95 flex flex-col justify-between shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <span className="text-xs font-black text-stone-900 uppercase tracking-wider">
          Your Impact
        </span>
        <div className="flex items-center gap-1 text-[11px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-lg">
          <span>{impactTimeframe}</span>
          <ChevronDown className="w-3 h-3" />
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-red-100 flex items-center justify-center text-[#d93829]">
              <Heart className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-bold text-stone-700">
              Lives Helped
            </span>
          </div>
          <span className="text-sm font-black text-stone-900">
            {currentUser?.successfulDonations || 0}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
              <Users className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-stone-700">
              Requests Supported
            </span>
          </div>
          <span className="text-sm font-black text-stone-900">
            {currentUser?.totalVolunteers || 0}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
              <Droplets className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-stone-700">
              Days as a Donor
            </span>
          </div>
          <span className="text-sm font-black text-stone-900">
            {currentUser?.createdAt
              ? differenceInDays(new Date(), new Date(currentUser.createdAt))
              : 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ImpactSummaryCard;
