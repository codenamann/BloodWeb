import React from 'react';

export const Badge = ({
  children,
  className = '',
  variant = 'default',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center gap-1.5 text-xs font-extrabold transition-colors select-none';

  const variants = {
    default: 'px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-700',
    crimson: 'px-2.5 py-0.5 rounded-md bg-red-100 text-[#d93829]',
    emerald: 'px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800',
    amber: 'px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900',
    blue: 'px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800',
    inset: 'clay-inset-pill px-3.5 py-1.5 text-[#575965]',
    pill: 'clay-pill-subtle px-2.5 py-0.5 text-[#575965]',
    outline:
      'border border-stone-200 bg-white/60 text-slate-700 px-2.5 py-0.5 rounded-full',
  };

  const variantClass = variants[variant] || variants.default;

  return (
    <span className={`${baseStyles} ${variantClass} ${className}`} {...props}>
      {children}
    </span>
  );
};

export default Badge;
