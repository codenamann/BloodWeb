import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

const URGENCY_LEVELS = [
  { id: 'NORMAL', label: 'Normal', color: 'bg-blue-50 text-blue-800' },
  { id: 'HIGH', label: 'High', color: 'bg-amber-50 text-amber-900' },
  { id: 'CRITICAL', label: 'Critical', color: 'bg-red-50 text-[#d93829]' },
];

export const UrgencySection = ({
  urgency,
  onUrgencyChange,
  neededBy,
  onNeededByChange,
  patientCondition,
  onConditionChange,
}) => {
  return (
    <div className="clay-card p-6 bg-white/95 space-y-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="w-7 h-7 rounded-full bg-[#d93829] text-white text-xs font-black flex items-center justify-center">
          3
        </span>
        <div>
          <h3 className="text-sm font-black text-stone-900">Request Details</h3>
          <p className="text-[11px] text-stone-500 font-medium">
            Help donors understand the urgency.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        {/* Urgency Level Pills */}
        <div className="space-y-1.5">
          <label className="text-xs font-extrabold text-stone-700">
            Urgency Level <span className="text-[#d93829]">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {URGENCY_LEVELS.map((u) => {
              const isActive = urgency === u.id;
              return (
                <button
                  type="button"
                  key={u.id}
                  onClick={() => onUrgencyChange(u.id)}
                  className={`relative py-2 px-1 rounded-xl text-xs font-black transition-all cursor-pointer hover:opacity-90 ${
                    isActive ? 'text-white' : `${u.color} border border-stone-200/80`
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="create-request-urgency"
                      className="absolute inset-0 clay-btn-crimson text-white shadow-xs transition-none!"
                      style={{ borderRadius: 12 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 40,
                      }}
                    />
                  )}
                  <span className="relative z-10">{u.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Needed By Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-extrabold text-stone-700">
            Needed By (Timeline) <span className="text-[#d93829]">*</span>
          </label>
          <div className="relative">
            <Clock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="datetime-local"
              value={neededBy}
              onChange={(e) => onNeededByChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#faf7f2] rounded-xl border border-stone-200/80 focus:outline-none focus:ring-2 focus:ring-[#d93829]/30 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Patient Condition Notes */}
      <div className="space-y-1.5 pt-1">
        <label className="text-xs font-extrabold text-stone-700">
          Medical Context / Note for Donors (Optional)
        </label>
        <textarea
          rows={2}
          value={patientCondition}
          onChange={(e) => onConditionChange(e.target.value)}
          placeholder="e.g. Patient undergoing bypass surgery at 4 PM. Low platelets..."
          className="w-full p-3 text-xs bg-[#faf7f2] rounded-xl border border-stone-200/80 focus:outline-none focus:ring-2 focus:ring-[#d93829]/30 font-medium resize-none"
        />
      </div>
    </div>
  );
};

export default UrgencySection;
