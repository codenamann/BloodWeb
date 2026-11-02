import React from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { ClayButton } from '../../../components/ui';

export const DonorsFilterBar = ({
  radiusKm,
  onRadiusChange,
  selectedUrgency,
  onUrgencyChange,
  unitsFilter,
  onUnitsChange,
  onReset,
  currentUser,
}) => {
  return (
    <div className="clay-card p-4 sm:p-5 bg-white/95 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#d93829]" />
          <span className="text-xs font-black text-stone-900 uppercase tracking-wider">
            Filters
          </span>
          {currentUser?.bloodGroup && (
            <span className="ml-2 px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200/80 text-[11px] font-black text-[#d93829] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d93829] animate-pulse" />
              Type {currentUser.bloodGroup} (Auto-Matched)
            </span>
          )}
        </div>

        <button
          onClick={onReset}
          className="text-xs font-bold text-stone-400 hover:text-[#d93829] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        {/* Distance Radius */}
        <div className="bg-[#faf7f2] p-3 rounded-xl border border-stone-200/60 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold text-stone-700">
              Distance Radius
            </label>
            <span className="text-xs font-black text-[#d93829]">
              Within {radiusKm} km
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="100"
            step="5"
            value={radiusKm}
            onChange={(e) => onRadiusChange(Number(e.target.value))}
            className="w-full accent-[#d93829] cursor-pointer"
          />
          <div className="flex items-center justify-between text-[10px] text-stone-400 font-bold">
            <span>5 km</span>
            <span>100 km</span>
          </div>
        </div>

        {/* Urgency Level */}
        <div className="bg-[#faf7f2] p-3 rounded-xl border border-stone-200/60 flex flex-col justify-between gap-2">
          <label className="text-xs font-extrabold text-stone-700 block">
            Urgency Level
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: 'ALL', label: 'All' },
              { id: 'NORMAL', label: 'Normal' },
              { id: 'HIGH', label: 'High' },
              { id: 'CRITICAL', label: 'Critical' },
            ].map((u) => (
              <ClayButton
                key={u.id}
                size="sm"
                rounded="xl"
                active={selectedUrgency === u.id}
                onClick={() => onUrgencyChange(u.id)}
                className="w-full font-bold"
              >
                {u.label}
              </ClayButton>
            ))}
          </div>
        </div>

        {/* Units Needed */}
        <div className="bg-[#faf7f2] p-3 rounded-xl border border-stone-200/60 flex flex-col justify-between gap-2">
          <label className="text-xs font-extrabold text-stone-700 block">
            Units Needed
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {['ANY', '1', '2', '3+'].map((u) => (
              <ClayButton
                key={u}
                size="sm"
                rounded="xl"
                active={unitsFilter === u}
                onClick={() => onUnitsChange(u)}
                className="w-full font-bold"
              >
                {u}
              </ClayButton>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorsFilterBar;
