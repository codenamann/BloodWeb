import React from 'react';
import { Card } from '../../ui';

export const HeroFloatingCard = ({
  icon,
  iconBg = 'bg-red-50 text-[#d93829]',
  category,
  categoryColor = 'text-[#d93829]',
  title,
  subtitle,
  footer,
  animation = 'slow',
  className = '',
}) => {
  const animClass =
    animation === 'reverse' ? 'animate-float-reverse' : 'animate-float-slow';

  return (
    <Card
      variant="flat"
      className={`p-3.5 bg-white/95 max-w-[185px] sm:max-w-[200px] flex gap-2 ${animClass} ${className}`}
    >
      {icon && (
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}
          >
            {icon}
          </div>
        </div>
      )}

      <div className="overflow-hidden flex-1">
        {category && (
          <div className={`text-xs font-bold tracking-wider mb-2 ${categoryColor}`}>
            {category}
          </div>
        )}

        {title && (
          <div className="text-[9px] font-black text-[#60626a] leading-normal truncate">
            {title}
          </div>
        )}

        {subtitle && (
          <div className="text-[10px] text-[#747682] font-medium truncate">
            {subtitle}
          </div>
        )}

        {footer && (
          <div className="mt-2 flex items-center justify-between">
            {footer}
          </div>
        )}
      </div>
    </Card>
  );
};

export default HeroFloatingCard;
