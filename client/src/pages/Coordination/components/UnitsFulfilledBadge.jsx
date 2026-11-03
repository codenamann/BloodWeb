import React from 'react';
import { Droplet } from 'lucide-react';

export const UnitsFulfilledBadge = ({ fulfilledUnits = 0, totalUnits = 1 }) => {
  const safeTotal = Math.max(1, totalUnits);
  const safeFulfilled = Math.max(0, fulfilledUnits);
  const pct = Math.min(100, Math.round((safeFulfilled / safeTotal) * 100));
  const remaining = Math.max(0, safeTotal - safeFulfilled);

  // SVG Circular Progress Ring parameters
  const size = 40;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  return (
    <div className="relative group shrink-0">
      {/* Circular Radial Progress Badge */}
      <div
        className="relative flex items-center justify-center cursor-pointer select-none rounded-full shadow-2xs hover:shadow-xs transition-shadow"
        style={{ width: size, height: size }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="absolute inset-0 -rotate-90 pointer-events-none"
        >
          {/* Background track circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="#ffffff"
            stroke="#ffe4e6"
            strokeWidth={strokeWidth}
          />
          {/* Animated progress border fill */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={pct >= 100 ? '#16a34a' : '#d93829'}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-[stroke-dashoffset,stroke] duration-500 ease-out"
          />
        </svg>

        {/* Center units fraction */}
        <span
          className={`relative z-10 font-black text-stone-900 leading-none whitespace-nowrap tabular-nums ${
            `${safeFulfilled}/${safeTotal}`.length > 5
              ? 'text-[9.5px] tracking-tighter'
              : 'text-[11px] tracking-tight'
          }`}
        >
          {safeFulfilled} / {safeTotal}
        </span>
      </div>

      {/* Hover Information Card (opens downward to avoid container overflow clipping) */}
      <div className="absolute top-full mt-2.5 right-0 w-56 sm:w-60 bg-white rounded-2xl p-3 shadow-xl border border-stone-200/90 z-50 transition-all duration-200 pointer-events-none opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 origin-top-right">
        {/* Upward Pointer Arrow */}
        <div className="absolute -top-1.5 right-4 w-2.5 h-2.5 bg-white border-l border-t border-stone-200/90 rotate-45" />

        <div className="flex items-center gap-1.5 text-xs font-black text-stone-900 pb-1 border-b border-stone-100">
          <Droplet className="w-3.5 h-3.5 text-[#d93829] fill-[#d93829]" />
          <span>Units Fulfillment Status</span>
        </div>

        <p className="text-[11px] text-stone-600 font-medium mt-1.5 leading-snug">
          {safeFulfilled} of {safeTotal} required blood unit
          {safeTotal > 1 ? 's' : ''} confirmed.
        </p>

        {/* Progress Bar inside tooltip */}
        <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden mt-2">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              pct >= 100 ? 'bg-emerald-600' : 'bg-[#d93829]'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="text-[10px] font-bold text-stone-400 mt-1.5 flex items-center justify-between">
          <span>{pct}% Fulfilled</span>
          <span>
            {remaining > 0 ? `${remaining} more needed` : 'Target reached'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UnitsFulfilledBadge;
