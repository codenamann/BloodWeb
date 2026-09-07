import React from 'react';

export const ClayPedestal = ({ children, className = "" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer Tier */}
      <div className="clay-pedestal-outer w-[230px] h-[230px] sm:w-[280px] sm:h-[280px] flex items-center justify-center p-3 sm:p-4">
        {/* Mid Tier */}
        <div className="clay-pedestal-mid w-full h-full flex items-center justify-center p-3 sm:p-4">
          {/* Inner Tier */}
          <div className="clay-pedestal-inner w-full h-full flex items-center justify-center relative">
            {/* Center Drop or content */}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClayPedestal;
