import React from 'react';
import { Crosshair, MapPin, Check, AlertCircle, Loader2 } from 'lucide-react';

export const DonorLocationFields = ({
  locCountry,
  setLocCountry,
  locState,
  setLocState,
  locCity,
  setLocCity,
  locArea,
  setLocArea,
  locPincode,
  setLocPincode,
  locCoords,
  isDetectingLocation,
  handleDetectLocation,
  onOpenPicker,
  onClearError,
}) => {
  return (
    <div className="space-y-2 pt-1 border-t border-stone-100">
      <div className="flex items-center justify-between">
        <label className="text-xs font-extrabold text-stone-800 flex items-center gap-1.5">
          <span>2. Your Location</span>
          <span className="text-[#d93829]">*</span>
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDetectLocation}
            disabled={isDetectingLocation}
            className="text-[10px] font-black text-[#d93829] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            {isDetectingLocation ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Crosshair className="w-3 h-3" />
            )}
            <span>Detect Location</span>
          </button>
          <span className="text-stone-300">•</span>
          <button
            type="button"
            onClick={onOpenPicker}
            className="text-[10px] font-black text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
          >
            <MapPin className="w-3 h-3 text-stone-400" />
            <span>Pick on Map</span>
          </button>
        </div>
      </div>

      {/* Coordinates Status Badge */}
      <div className="flex items-center justify-between text-[11px] pb-1">
        {locCoords && typeof locCoords.lat === 'number' && typeof locCoords.lng === 'number' ? (
          <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/80 flex items-center gap-1.5">
            <Check className="w-3 h-3 text-emerald-600" />
            <span>Coordinates: {locCoords.lat.toFixed(4)}, {locCoords.lng.toFixed(4)}</span>
          </span>
        ) : (
          <span className="text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/80 flex items-center gap-1.5">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            <span>Coordinates required (use Detect or Pick on Map)</span>
          </span>
        )}
      </div>

      {/* Country & State */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] font-bold text-stone-500 block mb-0.5">Country *</label>
          <input
            type="text"
            value={locCountry}
            onChange={(e) => {
              setLocCountry(e.target.value);
              onClearError?.();
            }}
            placeholder="e.g. India"
            className="w-full px-3 py-2 text-xs bg-[#faf7f2] rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#d93829]/30 font-bold text-stone-800"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-stone-500 block mb-0.5">State *</label>
          <input
            type="text"
            value={locState}
            onChange={(e) => {
              setLocState(e.target.value);
              onClearError?.();
            }}
            placeholder="e.g. Madhya Pradesh"
            className="w-full px-3 py-2 text-xs bg-[#faf7f2] rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#d93829]/30 font-bold text-stone-800"
          />
        </div>
      </div>

      {/* City & Area */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] font-bold text-stone-500 block mb-0.5">City *</label>
          <input
            type="text"
            value={locCity}
            onChange={(e) => {
              setLocCity(e.target.value);
              onClearError?.();
            }}
            placeholder="e.g. Indore"
            className="w-full px-3 py-2 text-xs bg-[#faf7f2] rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#d93829]/30 font-bold text-stone-800"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-stone-500 block mb-0.5">Area / Locality *</label>
          <input
            type="text"
            value={locArea}
            onChange={(e) => {
              setLocArea(e.target.value);
              onClearError?.();
            }}
            placeholder="e.g. Vijay Nagar"
            className="w-full px-3 py-2 text-xs bg-[#faf7f2] rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#d93829]/30 font-bold text-stone-800"
          />
        </div>
      </div>

      {/* Pincode */}
      <div>
        <label className="text-[10px] font-bold text-stone-500 block mb-0.5">Pincode *</label>
        <input
          type="text"
          value={locPincode}
          onChange={(e) => {
            setLocPincode(e.target.value);
            onClearError?.();
          }}
          placeholder="e.g. 452010"
          className="w-full px-3 py-2 text-xs bg-[#faf7f2] rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#d93829]/30 font-bold text-stone-800"
        />
      </div>
    </div>
  );
};

export default DonorLocationFields;
