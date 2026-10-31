import React from 'react';

export const RequestDetailSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Loading request details">
      {/* 1. TOP HEADER & BREADCRUMB SKELETON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          {/* Breadcrumb */}
          <div className="h-4 w-32 rounded bg-stone-200/80" />
          
          {/* Title + Status Badge */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-48 rounded-xl bg-stone-200/80" />
            <div className="h-6 w-20 rounded-full bg-stone-200/70" />
          </div>
          
          {/* Metadata Subtitle */}
          <div className="h-4 w-64 rounded bg-stone-200/60" />
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="h-10 w-28 rounded-2xl bg-stone-200/70" />
          <div className="h-10 w-36 rounded-2xl bg-stone-200/80" />
        </div>
      </div>

      {/* 2. MAIN REQUEST HERO CARD SKELETON */}
      <div className="clay-card p-6 sm:p-8 bg-white/95 shadow-sm space-y-6">
        {/* Hero Top: Blood Type & Units */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-stone-100">
          <div className="flex items-start gap-4">
            {/* Blood Type Tile Skeleton */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-stone-200/80 shrink-0" />

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-5 w-24 rounded-full bg-stone-200/80" />
                <div className="h-4 w-36 rounded bg-stone-200/60" />
              </div>
              <div className="h-7 w-48 rounded bg-stone-200/80" />
              <div className="h-4 w-56 rounded bg-stone-200/60" />
            </div>
          </div>

          {/* Hands Illustration Placeholder */}
          <div className="hidden md:block w-28 h-28 rounded-full bg-stone-100 shrink-0" />
        </div>

        {/* Navigation Tabs Bar Skeleton */}
        <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
          <div className="h-9 w-24 rounded-xl bg-stone-200/80" />
          <div className="h-9 w-32 rounded-xl bg-stone-100" />
          <div className="h-9 w-36 rounded-xl bg-stone-100" />
        </div>

        {/* Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Cards */}
          <div className="lg:col-span-2 space-y-4">
            {/* Hospital Card */}
            <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="h-4 w-36 rounded bg-stone-200/80" />
                <div className="h-4 w-20 rounded-full bg-stone-200/60" />
              </div>
              <div className="h-5 w-52 rounded bg-stone-200/80" />
              <div className="h-4 w-64 rounded bg-stone-200/60" />
            </div>

            {/* Clinical Context Card */}
            <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-3">
              <div className="h-4 w-44 rounded bg-stone-200/80" />
              <div className="h-16 w-full rounded-xl bg-white border border-stone-100" />
              <div className="flex items-center justify-between pt-1">
                <div className="h-4 w-24 rounded bg-stone-200/60" />
                <div className="h-4 w-32 rounded bg-stone-200/80" />
              </div>
            </div>

            {/* Donor Volunteer Callout Skeleton */}
            <div className="p-5 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-3">
              <div className="h-4 w-40 rounded bg-stone-200/80" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="h-4 w-72 rounded bg-stone-200/60" />
                <div className="h-9 w-36 rounded-xl bg-stone-200/80 shrink-0" />
              </div>
            </div>
          </div>

          {/* Right 1 Col: Progress Gauge & Quick Actions */}
          <div className="space-y-4">
            {/* Progress Gauge */}
            <div className="p-5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-center space-y-3">
              <div className="h-4 w-28 rounded bg-stone-200/80 text-left" />
              <div className="w-28 h-28 mx-auto rounded-full bg-stone-200/80" />
              <div className="space-y-2 pt-2">
                <div className="h-3 w-full rounded bg-stone-200/60" />
                <div className="h-3 w-full rounded bg-stone-200/60" />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200/80 space-y-2">
              <div className="h-4 w-24 rounded bg-stone-200/80 mb-2" />
              <div className="h-10 w-full rounded-xl bg-stone-100" />
              <div className="h-10 w-full rounded-xl bg-stone-100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailSkeleton;
