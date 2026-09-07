import React from 'react';
import { Link } from 'react-router-dom';

export const ClayLogo = ({ size = 'md', to = '/' }) => {
  const isLarge = size === 'lg';
  return (
    <Link
      to={to}
      className="flex items-center gap-2.5 group cursor-pointer select-none"
    >
      {/* 3D Clay Droplet Icon */}
      <div className="relative flex items-center w-40 justify-center transition-transform duration-200 group-hover:scale-105">
        <img src="/BloodWeb-Text.png" alt="" />
      </div>
    </Link>
  );
};

export default ClayLogo;
