import React from 'react';

export const Input = React.forwardRef(
  ({ className = '', type = 'text', icon: Icon, error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          type={type}
          ref={ref}
          className={`w-full py-2.5 text-xs sm:text-sm bg-[#faf7f2] rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#d93829]/30 transition-all ${
            Icon ? 'pl-10 pr-4' : 'px-3.5'
          } ${error ? 'border-red-400 focus:ring-red-400/30' : ''} ${className}`}
          {...props}
        />
        {error && <p className="text-[11px] text-[#d93829] font-bold mt-1">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export default Input;
