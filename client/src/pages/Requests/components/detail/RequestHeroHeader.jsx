import React from 'react';
import { Building } from 'lucide-react';
import { ClayHandsHeart } from '../../../../components/ClayAssets/ClayIllustrations';

export const RequestHeroHeader = ({
  patientBloodGroup,
  urgency,
  neededByFormatted,
  unitsNeeded,
  hospitalName,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-stone-100">
      {/* Blood Type & Units */}
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-red-50 text-[#d93829] font-black text-2xl sm:text-3xl flex flex-col items-center justify-center shrink-0 shadow-xs border border-red-100">
          <span>{patientBloodGroup}</span>
          <span className="text-[8px] font-bold text-stone-400 uppercase">TYPE</span>
        </div>

        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                urgency === 'CRITICAL'
                  ? 'bg-red-100 text-[#d93829]'
                  : 'bg-amber-100 text-amber-900'
              }`}
            >
              {urgency} URGENCY
            </span>
            <span className="text-xs text-stone-400 font-bold">
              Needed by{' '}
              <span className="text-stone-800 font-extrabold">
                {neededByFormatted}
              </span>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900">
            {unitsNeeded} {unitsNeeded === 1 ? 'Unit' : 'Units'} Needed
          </h2>
          <p className="text-xs text-stone-500 font-medium flex items-center gap-1">
            <Building className="w-3.5 h-3.5 text-[#d93829]" />
            <span>
              For a patient at <strong className="text-stone-800">{hospitalName}</strong>
            </span>
          </p>
        </div>
      </div>

      {/* 3D Clay Hands Illustration in Hero */}
      <div className="hidden md:flex shrink-0">
        <ClayHandsHeart size={140} />
      </div>
    </div>
  );
};

export default RequestHeroHeader;
