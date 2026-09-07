import React from 'react';
import { Card } from '../../ui';

export const ValuePillCard = ({ icon: Icon, line1, line2, className = '' }) => {
  return (
    <Card
      variant="flat"
      className={`p-3.5 px-4 rounded-2xl flex items-center gap-3 shadow-xs hover:-translate-y-0.5 transition-transform duration-200 ${className}`}
    >
      <div className="w-10 h-10 rounded-xl bg-red-200/80 flex items-center justify-center text-[#dd2c1c] shrink-0">
        {Icon && <Icon className="w-5 h-5 text-[#dd2c1c]" />}
      </div>
      <div className="flex flex-col leading-tight select-none">
        <span className="text-xs sm:text-[13px] font-black text-[#1c1d22]">
          {line1}
        </span>
        <span className="text-xs sm:text-[13px] font-black text-[#1c1d22]">
          {line2}
        </span>
      </div>
    </Card>
  );
};

export default ValuePillCard;
