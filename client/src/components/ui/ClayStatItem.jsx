import React from 'react';

const ClayStatItem = ({
  icon: Icon,
  label,
  value,
  title,
  iconColor = "red", // "red" | "stone"
  className = "",
  fillIcon = false
}) => {
  const isRed = iconColor === 'red';
  const iconBg = isRed ? 'bg-[#fceceb] text-[#d93829]' : 'bg-[#f6efe9] text-stone-600';
  
  return (
    <div className={`flex flex-1 items-center gap-3 px-2 sm:px-3 min-w-0 ${className}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
        {Icon && <Icon className={`w-4 h-4 ${fillIcon ? 'fill-current' : ''}`} />}
      </div>
      <div className="flex flex-col min-w-0 pr-1">
        <span className="text-[10px] font-semibold text-stone-400 leading-tight">
          {label}
        </span>
        <span
          className="text-[13px] font-black text-stone-800 leading-tight truncate"
          title={title}
        >
          {value}
        </span>
      </div>
    </div>
  );
};

export default ClayStatItem;
