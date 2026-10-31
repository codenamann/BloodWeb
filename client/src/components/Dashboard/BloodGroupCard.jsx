import React from 'react';
import StaticBloodDrop from '../ClayAssets/StaticBloodDrop';
import { ChevronRight } from 'lucide-react';

function BloodGroupCard({ bloodGroup, onSet }) {
  return (
    <div className="clay-card p-5 bg-[#fdfbf9] flex flex-col gap-7 justify-between relative overflow-hidden group w-full">
      <div className="flex justify-between items-center relative z-10">
        {/* Blood Drop Pedestal (using clay-btn-cream shadow with custom background for that pinkish cream look) */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center clay-pedestal shrink-0 pointer-events-none"
          style={{ background: 'linear-gradient(145deg, #fff3f1, #f5e5e3)' }}
        >
          <StaticBloodDrop size={20} />
        </div>

        {/* Set Button (only visible if no blood group) */}
        {!bloodGroup && (
          <button
            onClick={onSet}
            className="clay-btn-cream pl-3 pr-2 py-[7px] text-xs text-[#d93829] font-black flex items-center gap-1 tracking-wide"
            style={{ background: 'linear-gradient(145deg, #fff3f1, #f5e5e3)' }}
          >
            Set <ChevronRight className="w-3.5 h-3.5" strokeWidth={3} />
          </button>
        )}
      </div>

      <div className=" relative z-10 pl-1">
        <div className="text-[9px] font-bold text-stone-500/80 uppercase tracking-[0.15em] mb-1.5">
          Blood Group
        </div>

        {bloodGroup ? (
          <div className="text-[18px] font-black text-clay-crimson-dark tracking-tight leading-tight mb-2">
            {bloodGroup}
          </div>
        ) : (
          <div className="text-[22px] font-black text-stone-900 leading-tight mb-2 tracking-normal">
            Not Set
          </div>
        )}

        {!bloodGroup ? (
          <p className="text-[10px] text-stone-500/90 font-medium leading-snug">
            Set your blood group to receive relevant requests.
          </p>
        ) : (
          <p className="text-[10px] text-stone-500/90 font-medium leading-snug">
            Blood group is set to donate or receive blood.
          </p>
        )}
      </div>
    </div>
  );
}

export default BloodGroupCard;
