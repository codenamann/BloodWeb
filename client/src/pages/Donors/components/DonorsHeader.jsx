import React from 'react';
import { ClayCharacterBoy } from '../../../components/ClayAssets/ClayIllustrations';

export const DonorsHeader = () => {
  return (
    <div className="clay-card p-6 sm:p-8 bg-gradient-to-r from-red-50/80 via-white to-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm border border-red-100/50">
      <div className="space-y-2 text-center md:text-left z-10 max-w-lg">
        <span className="text-[10px] font-black text-[#d93829] uppercase tracking-wider">
          ← DISCOVER REQUESTS
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-[#1c1d22] tracking-tight">
          Find a way to help.
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 font-medium">
          Real people. Real needs. Real impact. Find blood requests near you
          and save lives.
        </p>
      </div>

      {/* 3D Boy Holding Blood Drop */}
      <div className="shrink-0 flex items-center justify-center">
        <ClayCharacterBoy size={140} />
      </div>
    </div>
  );
};

export default DonorsHeader;
