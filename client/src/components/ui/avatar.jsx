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
  return (
    <div className={`shrink-0 ${className}`} {...props}>
      <ClayAvatar
        src={src}
        type={clayType || 'neutral'}
        size={size}
        showBadge={showBadge}
        badgeColor={badgeColor}
        name={alt}
      />
    </div>
  );
};

export default Avatar;
