import React from 'react';
import { cn } from '../../utils/util';
import './ClayButton.css';

/**
 * Customizable Claymorphic Button
 * Uses simple component-specific CSS for tactile shadows & insets.
 */
export const ClayButton = React.forwardRef(
  (
    {
      children,
      className = '',
      variant = 'crimson',
      active = undefined,
      rounded = 'lg',
      size = 'default',
      type = 'button',
      disabled = false,
      onClick,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-bold select-none cursor-pointer transition-all duration-200 border disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed';

    const roundedMap = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      '2xl': 'rounded-2xl',
      '3xl': 'rounded-3xl',
      full: 'rounded-full',
    };

    const sizeMap = {
      xs: 'h-7 px-2.5 text-[11px]',
      sm: 'h-8 px-3 text-xs',
      default: 'h-10 px-4 py-2 text-sm',
      lg: 'h-12 px-6 py-2.5 text-base',
      icon: 'h-8 w-8 p-0',
    };

    // Style variants using standard Tailwind + component-specific clay shadow classes
    const crimsonStyles =
      'bg-gradient-to-br from-[#eb4535] to-[#c3271b] text-white border-none clay-shadow-crimson hover:from-[#ef4b3b] hover:to-[#c92a1e] active:translate-y-0.5';

    const creamStyles =
      'bg-gradient-to-br from-[#f6f4f1] to-[#ede3d7] text-stone-800 border-stone-200/60 clay-shadow-cream hover:from-[#faf8f6] hover:to-[#f2e9de] active:translate-y-0.5';

    const inactiveStyles =
      'bg-white text-stone-700 border-stone-200/80 hover:bg-stone-50 hover:text-stone-900 shadow-2xs';

    let variantStyles = '';

    if (active === true) {
      variantStyles = variant === 'cream' ? creamStyles : crimsonStyles;
    } else if (active === false) {
      variantStyles = inactiveStyles;
    } else {
      switch (variant) {
        case 'cream':
          variantStyles = creamStyles;
          break;
        case 'outline':
          variantStyles =
            'border-stone-200 bg-white/80 text-stone-800 hover:bg-white hover:border-[#d93829]/40';
          break;
        case 'ghost':
          variantStyles =
            'border-transparent text-stone-600 hover:text-stone-900 hover:bg-black/5';
          break;
        case 'crimson':
        default:
          variantStyles = crimsonStyles;
          break;
      }
    }

    const roundedClass = roundedMap[rounded] || roundedMap.lg;
    const sizeClass = sizeMap[size] || sizeMap.default;

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          baseStyles,
          roundedClass,
          sizeClass,
          variantStyles,
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

ClayButton.displayName = 'ClayButton';

export default ClayButton;
