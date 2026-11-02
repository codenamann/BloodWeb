import React from 'react';
import { ShieldCheck, X } from 'lucide-react';

export const DonorReadinessHeader = ({ onClose }) => {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-red-50 text-[#d93829] flex items-center justify-center shrink-0 border border-red-100 shadow-xs">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-black text-stone-900 tracking-tight">
            Requirements to Discover Requests
          </h3>
          <p className="text-[11px] text-stone-500 font-medium">
            Configure your blood group, location & availability to discover local emergency requests.
          </p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="p-1.5 rounded-xl hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default DonorReadinessHeader;
