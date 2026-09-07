import React from 'react';
import { cn } from '../../utils/util';

export const Card = React.forwardRef(
  ({ children, className = '', variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'clay-card bg-white',
      flat: 'clay-card-flat bg-white',
      elevated: 'clay-card-elevated bg-white',
      crimson: 'clay-card-crimson text-white',
    };

    const variantClass = variants[variant] || variants.default;

    return (
      <div
        ref={ref}
        className={cn(variantClass, `p-6 ${className}`)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`flex flex-col space-y-1.5 pb-4 ${className}`} {...props}>
    {children}
  </div>
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = ({ children, className = '', ...props }) => (
  <h3
    className={`text-lg sm:text-xl font-black text-[#1c1d22] tracking-tight ${className}`}
    {...props}
  >
    {children}
  </h3>
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = ({ children, className = '', ...props }) => (
  <p
    className={`text-xs sm:text-sm text-[#575965] font-medium leading-relaxed ${className}`}
    {...props}
  >
    {children}
  </p>
);
CardDescription.displayName = 'CardDescription';

export const CardContent = ({ children, className = '', ...props }) => (
  <div className={`space-y-4 ${className}`} {...props}>
    {children}
  </div>
);
CardContent.displayName = 'CardContent';

export const CardFooter = ({ children, className = '', ...props }) => (
  <div
    className={`pt-4 border-t border-stone-100 flex items-center justify-between gap-3 ${className}`}
    {...props}
  >
    {children}
  </div>
);
CardFooter.displayName = 'CardFooter';

export default Card;
