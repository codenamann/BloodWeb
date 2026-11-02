import React from 'react';
import { MapPin, Check, Loader2 } from 'lucide-react';

export const LocationDetailsSheet = ({
  address,
  center,
  isReverseGeocoding,
  isConfirmDisabled,
  onConfirm,
}) => {
  return (
    <div className="clay-card rounded-[2rem] p-4 sm:p-6 w-full flex flex-col gap-4 relative overflow-hidden pointer-events-auto">
      {/* Decorative top bar for mobile sheet look */}
      <div className="w-12 h-1.5 bg-stone-200 rounded-full mx-auto sm:hidden mb-1" />
      
      <div>
        <h2 className="text-xl font-black text-stone-800 mb-1 leading-tight">
          {address.city ? (address.pincode ? `${address.city}, ${address.pincode}` : address.city) : 'Locating...'}
        </h2>
        <p className="text-sm font-bold text-stone-500 leading-snug">
          {address.area ? `${address.area}, ${address.state}` : address.state || 'Scanning area...'}
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs font-mono font-bold text-stone-400 bg-stone-50 py-2.5 px-3 rounded-xl border border-stone-100 w-fit">
        <MapPin className="w-3.5 h-3.5 text-stone-300" />
        {center.lat.toFixed(5)}, {center.lng.toFixed(5)}
      </div>

      <button
        onClick={() => onConfirm?.({ coordinates: center, ...address })}
        disabled={isConfirmDisabled}
        className={`w-full py-4 rounded-2xl text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer mt-1 ${
          isConfirmDisabled
            ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
            : 'clay-btn-crimson shadow-md hover:scale-[1.02] active:scale-95'
        }`}
      >
        {isReverseGeocoding ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Resolving Address...
          </>
        ) : (
          <>
            <Check className="w-4 h-4" /> Confirm Location
          </>
        )}
      </button>
    </div>
  );
};

export default LocationDetailsSheet;
