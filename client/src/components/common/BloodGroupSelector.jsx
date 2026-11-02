import React from 'react';
import { ClayButton } from '../ui';
import { Check } from 'lucide-react';

const DEFAULT_BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const BloodGroupSelector = ({
  value,
  onChange,
  options = DEFAULT_BLOOD_GROUPS,
  gridCols = 4,
  label = 'Blood Group',
  required = false,
  disabled = false,
  showStatus = true,
  className = '',
}) => {
  const gridClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    8: 'grid-cols-4 sm:grid-cols-8',
  }[gridCols] || 'grid-cols-4';

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-extrabold text-stone-800 flex items-center gap-1">
            <span>{label}</span>
            {required && <span className="text-[#d93829]">*</span>}
          </label>
          {showStatus && (
            value ? (
              <span className="text-[10px] text-emerald-700 font-black flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600" />
                Selected: {value}
              </span>
            ) : (
              required && (
                <span className="text-[10px] text-amber-600 font-bold">
                  Selection Required
                </span>
              )
            )
          )}
        </div>
      )}

      <div className={`grid ${gridClass} gap-2`}>
        {options.map((bg) => (
          <ClayButton
            key={bg}
            type="button"
            size="sm"
            rounded="xl"
            active={value === bg}
            disabled={disabled}
            onClick={() => onChange(bg)}
            className="w-full font-black text-xs py-2 disabled:opacity-50"
          >
            {bg}
          </ClayButton>
        ))}
      </div>
    </div>
  );
};

export default BloodGroupSelector;
