import React from 'react';

const ClayStatStrip = ({ children, className = '' }) => {
  const elements = React.Children.toArray(children).filter(Boolean);

  return (
    <div
      className={`mt-6 flex flex-wrap sm:flex-nowrap items-center justify-between bg-[#fcfaf7] rounded-2xl px-2 py-3 shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)] border border-stone-200/40 relative z-10 gap-y-4 ${className}`}
    >
      {elements.map((child, index) => (
        <React.Fragment key={index}>
          {child}
          {index < elements.length - 1 && (
            <div className="hidden sm:block w-px h-8 bg-stone-200/70 shrink-0"></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ClayStatStrip;
