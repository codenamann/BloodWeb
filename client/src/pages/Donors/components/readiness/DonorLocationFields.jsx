import React from 'react';
import { MapPin, Check } from 'lucide-react';

export const DonorLocationFields = ({
  locCountry,
  locState,
  locCity,
  locArea,
  locPincode,
  locCoords,
  onOpenPicker,
}) => {
  const hasValidLocation = Boolean(
    locCoords &&
    typeof locCoords.lat === 'number' &&
    typeof locCoords.lng === 'number' &&
    (locCity || locArea || locState)
  );

  return (
    <div className="space-y-2 pt-1 border-t border-stone-100">
      <div className="flex items-center justify-between">
        <label className="text-xs font-extrabold text-stone-800 flex items-center gap-1.5">
          <span>2. Your Location</span>
          <span className="text-[#d93829]">*</span>
        </label>
        {hasValidLocation ? (
          <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-600" />
            <span>Coordinates Verified</span>
          </span>
        ) : (
          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            Location Required
          </span>
        )}
      </div>

      {!hasValidLocation ? (
        <button
          type="button"
          onClick={onOpenPicker}
          className="w-full p-4 rounded-2xl border-2 border-dashed border-stone-300 hover:border-[#d93829] bg-[#faf7f2] hover:bg-red-50/40 transition-all flex items-center justify-between group cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-stone-200 flex items-center justify-center text-stone-400 group-hover:text-[#d93829] group-hover:scale-105 transition-all">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-stone-800 group-hover:text-[#d93829] transition-colors">
                Set Up Location
              </div>
              <div className="text-[11px] text-stone-500 font-medium">
                Detect automatically, search address, or pick on map
              </div>
            </div>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl clay-btn-crimson text-xs font-bold shadow-xs shrink-0">
            Select
          </div>
        </button>
      ) : (
        <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black text-stone-900 truncate">
                {[locArea, locCity].filter(Boolean).join(', ') || 'Selected Location'}
              </div>
              <div className="text-[11px] text-stone-500 font-medium truncate">
                {[locState, locCountry, locPincode].filter(Boolean).join(', ')}
              </div>
              <div className="text-[10px] font-mono text-emerald-700 font-bold mt-0.5">
                {locCoords.lat.toFixed(4)}, {locCoords.lng.toFixed(4)}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenPicker}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
          >
            Change
          </button>
        </div>
      )}
    </div>
  );
};

export default DonorLocationFields;
