import React from 'react';

export const DonorAvailabilityToggle = ({
  availabilityState,
  onToggle,
}) => {
  return (
    <div className="space-y-2 pt-1 border-t border-stone-100">
      <div className="flex items-center justify-between">
        <label className="text-xs font-extrabold text-stone-800 flex items-center gap-1.5">
          <span>3. Donor Availability Status</span>
          <span className="text-[#d93829]">*</span>
        </label>
      </div>

      <div
        onClick={onToggle}
        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
          availabilityState
            ? 'bg-emerald-50/70 border-emerald-200/80 shadow-xs'
            : 'bg-stone-50 border-stone-200/80'
        }`}
      >
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                availabilityState
                  ? 'bg-emerald-500 animate-pulse'
                  : 'bg-stone-400'
              }`}
            />
            <span
              className={`text-xs font-black ${
                availabilityState
                  ? 'text-emerald-900'
                  : 'text-stone-700'
              }`}
            >
              {availabilityState
                ? 'Available to Donate (Active)'
                : 'Availability Paused (Inactive)'}
            </span>
          </div>
          <p className="text-[10px] text-stone-500 font-medium">
            {availabilityState
              ? 'Ready to receive notifications and discover urgent blood requests.'
              : 'Must be turned ON to discover matching blood requests.'}
          </p>
        </div>

        {/* Toggle Switch */}
        <div
          className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center shrink-0 ${
            availabilityState
              ? 'bg-emerald-500 justify-end'
              : 'bg-stone-300 justify-start'
          }`}
        >
          <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
        </div>
      </div>
    </div>
  );
};

export default DonorAvailabilityToggle;
