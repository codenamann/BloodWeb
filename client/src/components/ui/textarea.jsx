import React from 'react';

export const Textarea = React.forwardRef(
  ({ className = '', rows = 3, error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <textarea
          rows={rows}
          ref={ref}
          className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#faf7f2] rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#d93829]/30 transition-all ${
            error ? 'border-red-400 focus:ring-red-400/30' : ''
          } ${className}`}
          {...props}
        />
        {error && <p className="text-[11px] text-[#d93829] font-bold mt-1">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export default Textarea;
