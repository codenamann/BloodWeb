import React from 'react';

export const RequestCardSkeleton = () => {
  return (
    <div className="clay-card-flat bg-white/95 rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-stone-200/60 space-y-3.5 relative overflow-hidden animate-pulse">
      {/* 1. TOP METADATA ROW */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-stone-100">
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="h-5 w-16 rounded-full bg-stone-200/80" />
          <div className="h-5 w-20 rounded-full bg-stone-200/80" />
          <div className="h-5 w-24 rounded-full bg-stone-100" />
          <div className="h-5 w-24 rounded-full bg-stone-100" />
        </div>
        <div className="h-4 w-36 rounded bg-stone-200/70" />
      </div>

      {/* 2. MAIN ROW: BLOOD TILE + INFO + ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Tile + Details */}
        <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-stone-200/80 shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-5 w-40 rounded bg-stone-200/80" />
            <div className="h-4 w-52 rounded bg-stone-100" />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
          <div className="h-10 w-20 rounded-xl bg-stone-100" />
          <div className="h-10 w-24 rounded-xl bg-stone-200/80" />
        </div>
      </div>
    </div>
  );
};

export default RequestCardSkeleton;
