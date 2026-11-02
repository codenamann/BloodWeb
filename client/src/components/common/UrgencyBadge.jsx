import React from 'react';

export const UrgencyBadge = ({ urgency, className = '', size = 'sm' }) => {
  const getStyles = (level) => {
    switch (level?.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-red-100 text-[#d93829] border border-red-200/60 font-black';
      case 'HIGH':
        return 'bg-amber-100 text-amber-900 border border-amber-200/60 font-bold';
      default:
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200/60 font-bold';
    }
  };

  const sizeClasses = size === 'xs' ? 'px-1.5 py-0.5 text-[8px]' : 'px-2 py-0.5 text-[9px]';

  return (
    <span
      className={`rounded-full uppercase tracking-wider inline-flex items-center ${sizeClasses} ${getStyles(
        urgency
      )} ${className}`}
    >
      {urgency || 'NORMAL'}
    </span>
  );
};

export default UrgencyBadge;
