import React from 'react';
import {
  ClayHandsHeart,
  ClayDropCharacter,
} from '../../../components/ClayAssets/ClayIllustrations';
import { ClayButton } from '../../../components/ui';

export const DonorsSidebar = ({ isDiscoverReady, onActionClick }) => {
  return (
    <div className="lg:col-span-1 space-y-5 mt-12">
      {/* Make a Difference Card */}
      <div className="clay-card p-5 bg-white/95 text-center space-y-3 shadow-xs">
        <h4 className="text-xs font-black text-stone-900 uppercase tracking-wider">
          Make a Difference
        </h4>
        <div className="flex justify-center">
          <ClayHandsHeart size={120} />
        </div>
        <p className="text-[10px] text-stone-500 font-medium">
          Your willingness to donate can give someone a second chance at life.
        </p>
        <ClayButton
          onClick={onActionClick}
          rounded="3xl"
          size="sm"
          className="w-full py-2.5 text-xs font-black shadow-md cursor-pointer"
        >
          {isDiscoverReady ? 'Update Donor Status →' : 'Set Up Requirements →'}
        </ClayButton>
      </div>

      {/* Eligibility Guidelines */}
      <div className="clay-card p-5 bg-white/95 space-y-2.5 shadow-xs">
        <h4 className="text-xs font-black text-stone-900 uppercase tracking-wider">
          Not Sure If You're Eligible?
        </h4>
        <p className="text-[10px] text-stone-500 font-medium">
          Check basic eligibility criteria before you volunteer to donate blood.
        </p>
        <button
          onClick={() =>
            alert(
              'Basic Eligibility: Age 18-65, Weight > 50kg, Haemoglobin > 12.5 g/dL, no recent tattoos/surgeries in past 6 months.'
            )
          }
          className="w-full clay-btn-cream py-2 text-xs font-bold text-stone-800 cursor-pointer"
        >
          View Guidelines →
        </button>
      </div>

      {/* Character Sign Card */}
      <div className="clay-card p-4 bg-white/95 flex items-center gap-3 shadow-xs">
        <div className="w-14 h-14 shrink-0 flex items-center justify-center">
          <ClayDropCharacter size={50} />
        </div>
        <div className="text-xs">
          <div className="font-black text-[#d93829]">Same Blood</div>
          <div className="font-bold text-stone-800">Stronger People</div>
        </div>
      </div>
    </div>
  );
};

export default DonorsSidebar;
