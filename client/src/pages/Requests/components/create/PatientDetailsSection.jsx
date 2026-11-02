import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { BloodGroupSelector } from '../../../../components/common/BloodGroupSelector';

export const PatientDetailsSection = ({
  bloodGroup,
  onBloodGroupChange,
  unitsNeeded,
  onUnitsChange,
}) => {
  return (
    <div className="clay-card p-6 bg-white/95 space-y-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="w-7 h-7 rounded-full bg-[#d93829] text-white text-xs font-black flex items-center justify-center">
          1
        </span>
        <div>
          <h3 className="text-sm font-black text-stone-900">Patient Details</h3>
          <p className="text-[11px] text-stone-500 font-medium">
            Tell us about the blood requirement.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {/* Blood Group Selector */}
        <BloodGroupSelector
          value={bloodGroup}
          onChange={onBloodGroupChange}
          label="Patient's Blood Group"
          required
        />

        {/* Units Needed Counter */}
        <div className="space-y-1.5">
          <label className="text-xs font-extrabold text-stone-700">
            Units Needed <span className="text-[#d93829]">*</span>
          </label>
          <div className="flex items-center gap-3 p-2 rounded-2xl bg-[#faf7f2] border border-stone-200/80 justify-between">
            <button
              type="button"
              onClick={() => onUnitsChange(-1)}
              className="w-9 h-9 rounded-xl clay-btn-cream text-stone-700 flex items-center justify-center cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-xl font-black text-stone-900">
              {unitsNeeded}
            </span>
            <button
              type="button"
              onClick={() => onUnitsChange(1)}
              className="w-9 h-9 rounded-xl clay-btn-cream text-[#d93829] flex items-center justify-center cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <span className="text-[10px] text-stone-400 font-semibold block text-center">
            (Standard blood donation unit: 350-450 ml)
          </span>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailsSection;
