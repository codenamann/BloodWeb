import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Droplets, AlertCircle, RefreshCw } from 'lucide-react';

export const RequestNotFoundView = () => (
  <div className="clay-card p-10 sm:p-12 text-center bg-white space-y-4 max-w-lg mx-auto my-12 shadow-sm">
    <div className="w-16 h-16 rounded-3xl bg-red-50 text-[#d93829] flex items-center justify-center mx-auto border border-red-100">
      <Droplets className="w-8 h-8" />
    </div>
    <div className="space-y-1">
      <h2 className="text-xl sm:text-2xl font-black text-stone-900">
        Blood Request Not Found
      </h2>
      <p className="text-xs text-stone-500 leading-relaxed">
        The requested blood emergency does not exist or may have been removed.
      </p>
    </div>
    <div className="pt-2">
      <Link
        to="/requests"
        className="clay-btn-crimson px-5 py-2.5 text-xs font-bold inline-flex items-center gap-2"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Requests</span>
      </Link>
    </div>
  </div>
);

export const RequestErrorView = ({ error, onRetry }) => (
  <div className="clay-card p-8 sm:p-10 text-center bg-white space-y-4 max-w-lg mx-auto my-12 border border-red-100 shadow-sm">
    <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#d93829] flex items-center justify-center mx-auto border border-red-100">
      <AlertCircle className="w-7 h-7" />
    </div>
    <div className="space-y-1">
      <h2 className="text-lg sm:text-xl font-black text-stone-900">
        Unable to Load Request
      </h2>
      <p className="text-xs text-stone-500 leading-relaxed">
        {error || 'An unexpected error occurred while fetching request details.'}
      </p>
    </div>
    <div className="flex items-center justify-center gap-3 pt-2">
      <button
        onClick={onRetry}
        className="clay-btn-crimson px-4 py-2 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>Try Again</span>
      </button>
      <Link
        to="/requests"
        className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Requests</span>
      </Link>
    </div>
  </div>
);
