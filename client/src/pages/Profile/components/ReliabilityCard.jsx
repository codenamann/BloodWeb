import React from 'react';
import { useAuth } from '../../../context/AuthContext';

const ReliabilityCard = () => {
  const { currentUser } = useAuth();

  const hasHistory = (currentUser?.totalVolunteers || 0) > 0;
  const reliability = hasHistory
    ? `${Math.round((currentUser?.reliabilityScore || 0) * 100)}%`
    : 'N/A';

  return (
    <div className="clay-card p-6 bg-white/95 space-y-4 shadow-sm text-center">
      <div className="text-xs font-black text-stone-900 uppercase tracking-wider text-left">
        Donor Reliability Score
      </div>

      <div className="w-24 h-24 mx-auto rounded-full bg-red-50 border-4 border-red-100 flex flex-col items-center justify-center text-[#d93829] shadow-inner">
        <span className="text-2xl font-black">{reliability}</span>
        <span className="text-[8px] font-black uppercase tracking-wider text-stone-400">
          Score
        </span>
      </div>

      <div className="space-y-2 text-xs font-semibold text-stone-600 text-left pt-2 border-t border-stone-100">
        <div className="flex items-center justify-between">
          <span>Volunteer Responses:</span>
          <span className="font-black text-stone-900">
            {currentUser?.totalVolunteers || 0}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Completed Donations:</span>
          <span className="font-black text-stone-900">
            {currentUser?.successfulDonations || 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReliabilityCard;
