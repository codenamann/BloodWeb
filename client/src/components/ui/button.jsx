import React from 'react';

export const Button = React.forwardRef(
  (
    {
      children,
      className = '',
      variant = 'crimson',
      size = 'default',
      type = 'button',
      disabled = false,
      onClick,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-bold transition-all duration-200 cursor-pointer select-none disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed';

    const variants = {
      crimson: 'clay-btn-crimson text-white shadow-md',
      cream: 'clay-btn-cream text-[#1c1d22] shadow-md',
      outline:
        'border-2 border-stone-200 bg-white/80 text-[#1c1d22] hover:bg-white hover:border-[#d93829]/40',
      ghost: 'text-[#575965] hover:text-[#1c1d22] hover:bg-black/5 rounded-xl',
      link: 'text-[#d93829] hover:underline p-0 h-auto font-semibold',
      destructive:
        'bg-red-600 hover:bg-red-700 text-white rounded-2xl shadow-md',
    };

    const sizes = {
      default: 'px-5 py-2.5 text-sm rounded-2xl',
      sm: 'px-3.5 py-1.5 text-xs rounded-xl',
      lg: 'px-7 py-3.5 text-base rounded-2xl shadow-lg',
      icon: 'p-2.5 rounded-2xl aspect-square',
    };

    const variantClass = variants[variant] || variants.crimson;
    const sizeClass = sizes[size] || sizes.default;

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={`${baseStyles} ${variantClass} ${sizeClass} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
