import React from 'react';

export const StaticBloodDrop = ({ size = 32, className = '' }) => {
  return (
    <svg
      width={size}
      height={size * 1.2}
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Main Teardrop with crisp white border */}
      <path
        d="M50 10 C50 10 15 60 15 85 C15 105 30 115 50 115 C70 115 85 105 85 85 C85 60 50 10 50 10 Z"
        fill="#b92b27"
        stroke="white"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      {/* Crescent highlight on the left */}
      <path
        d="M 42 40 Q 25 65 32 92"
        stroke="#f4aca9"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default StaticBloodDrop;
