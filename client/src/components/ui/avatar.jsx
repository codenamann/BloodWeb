import React from 'react';
import ClayAvatar from '../ClayAssets/ClayAvatar';

export const Avatar = ({
  clayType,
  src,
  alt = 'Avatar',
  fallback = 'U',
  size = 48,
  showBadge = false,
  badgeColor = 'crimson',
  className = '',
  ...props
}) => {
  if (clayType) {
    return (
      <div className={`shrink-0 ${className}`} {...props}>
        <ClayAvatar
          type={clayType}
          size={size}
          showBadge={showBadge}
          badgeColor={badgeColor}
        />
      </div>
    );
  }

  if (src) {
    return (
      <div
        className={`relative shrink-0 rounded-full overflow-hidden clay-card-flat ${className}`}
        style={{ width: size, height: size }}
        {...props}
      >
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`relative shrink-0 rounded-full clay-card-flat bg-stone-100 flex items-center justify-center font-black text-[#575965] ${className}`}
      style={{ width: size, height: size }}
      {...props}
    >
      <span className="text-sm uppercase">{fallback}</span>
    </div>
  );
};

export default Avatar;
