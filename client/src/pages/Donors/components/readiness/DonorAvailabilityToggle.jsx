import React from 'react';
import { AlertCircle } from 'lucide-react';
import { toast } from '../../../../components/ui/toast';

export const DonorAvailabilityToggle = ({
  availabilityState,
  onToggle,
  hasBloodGroup = true,
}) => {
  const handleClick = () => {
    if (!availabilityState && !hasBloodGroup) {
      toast.error(
        'Blood Group Required',
        'Please set up your verified blood group first before turning on availability.'
      );
      return;
    }
    onToggle?.();
  };

  return (
    <div className="space-y-2 pt-1 border-t border-stone-100">
      <div className="flex items-center justify-between">
        <label className="text-xs font-extrabold text-stone-800 flex items-center gap-1.5">
          <span>3. Donor Availability Status</span>
          <span className="text-[#d93829]">*</span>
        </label>
        {!hasBloodGroup && (
          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            <span>Set blood group first</span>
          </span>
        )}
      </div>

      <div
        onClick={handleClick}
        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
          availabilityState
            ? 'bg-emerald-50/70 border-emerald-200/80 shadow-xs'
            : !hasBloodGroup
            ? 'bg-stone-50/60 border-stone-200/60 opacity-80'
            : 'bg-stone-50 border-stone-200/80 hover:bg-stone-100/60'
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
              : !hasBloodGroup
              ? 'Please select your blood group above to enable donor availability.'
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
