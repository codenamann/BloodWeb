import React from 'react';
import { Phone } from 'lucide-react';

export const RequesterPhoneInput = ({ contactPhone, setContactPhone }) => {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-extrabold text-stone-700 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5 text-stone-400" />
          <span>Contact Phone Number</span>
        </span>
        <span className="text-[10px] text-stone-400 font-bold">10-Digit Mobile</span>
      </label>
      <div className="flex items-center gap-2">
        <div className="px-3 py-2.5 text-xs font-black bg-stone-100 rounded-xl border border-stone-200 text-stone-600 shrink-0 select-none">
          +91
        </div>
        <input
          type="tel"
          maxLength={10}
          value={contactPhone}
          onChange={(e) => {
            const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
            setContactPhone(cleaned);
          }}
          placeholder="Enter number"
          className="w-full px-3.5 py-2.5 text-xs bg-[#faf7f2] rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#d93829]/30 font-black text-stone-800 tracking-wider"
        />
      </div>
      <p className="text-[10px] text-stone-400 font-medium">
        Must be a valid 10-digit Indian mobile number (starts with 6, 7, 8, or 9).
      </p>
    </div>
  );
};

export default RequesterPhoneInput;
