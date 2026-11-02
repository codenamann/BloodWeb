import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const CoordinationLoadingSkeleton = () => (
  <div className="space-y-5 max-w-6xl mx-auto animate-pulse">
    <div className="h-10 bg-stone-200/80 rounded-xl w-64" />
    <div className="h-20 bg-stone-200/80 rounded-2xl w-full" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 h-[550px] bg-stone-200/80 rounded-3xl" />
      <div className="space-y-4">
        <div className="h-64 bg-stone-200/80 rounded-3xl" />
        <div className="h-44 bg-stone-200/80 rounded-3xl" />
      </div>
    </div>
  </div>
);

export const CoordinationErrorView = ({ error, onRetry }) => (
  <div className="clay-card p-10 text-center bg-white space-y-4 max-w-xl mx-auto my-12 shadow-sm">
    <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mx-auto text-[#d93829]">
      <AlertCircle className="w-7 h-7" />
    </div>
    <h2 className="text-xl font-black text-stone-900">
      {error?.status === 403
        ? 'Access Restricted'
        : error?.status === 404
        ? 'Room Not Found'
        : 'Connection Error'}
    </h2>
    <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
      {error?.message || 'The associated coordination room could not be loaded.'}
    </p>
    <div className="flex items-center justify-center gap-3 pt-2">
      <button
        onClick={onRetry}
        className="px-4 py-2 text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl inline-flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>Retry</span>
      </button>
      <Link
        to="/requests"
        className="clay-btn-crimson px-5 py-2 text-xs font-bold inline-block"
      >
        Return to Requests
      </Link>
    </div>
  </div>
);
