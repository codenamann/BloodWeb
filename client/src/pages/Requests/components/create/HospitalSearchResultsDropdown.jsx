import React from 'react';
import { Loader2 } from 'lucide-react';

export const HospitalSearchResultsDropdown = ({
  hospitalResults,
  isSearchingHospitals,
  hospitalSearchError,
  hasMoreHospitals,
  isLoadingMoreHospitals,
  handleSelectHospital,
  handleLoadMoreHospitals,
}) => {
  return (
    <div className="max-h-48 overflow-y-auto rounded-2xl bg-white border border-stone-200 p-2 shadow-lg space-y-1 divide-y divide-stone-100 relative overflow-hidden">
      {isSearchingHospitals && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
          <Loader2 className="w-5 h-5 animate-spin text-[#d93829]" />
        </div>
      )}
      {isSearchingHospitals && hospitalResults.length === 0 && (
        <div className="h-12 w-full" />
      )}
      {hospitalSearchError ? (
        <div className="py-3 text-center text-xs text-red-500 font-medium">
          {hospitalSearchError}
        </div>
      ) : hospitalResults.length === 0 && !isSearchingHospitals ? (
        <div className="py-3 text-center text-xs text-stone-400 font-medium">
          No verified hospitals found with that query.
        </div>
      ) : (
        <>
          {hospitalResults.map((hosp) => (
            <div
              key={hosp._id}
              onClick={() => handleSelectHospital(hosp)}
              className="pt-2 pb-1.5 px-3 rounded-xl hover:bg-red-50 cursor-pointer flex items-center justify-between transition-colors"
            >
              <div>
                <div className="text-xs font-black text-stone-900">
                  {hosp.name}
                </div>
                <div className="text-[11px] text-stone-500 font-medium">
                  {hosp.address}
                </div>
              </div>
              {hosp.verified && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0">
                  Verified
                </span>
              )}
            </div>
          ))}
          {hasMoreHospitals && (
            <div className="pt-2 pb-1">
              <button
                type="button"
                onClick={handleLoadMoreHospitals}
                disabled={isLoadingMoreHospitals}
                className="w-full py-2 text-[11px] font-bold text-stone-600 bg-stone-50 hover:bg-stone-100 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoadingMoreHospitals ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-500" />
                    <span>Loading more...</span>
                  </>
                ) : (
                  <span>Load 10 more</span>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HospitalSearchResultsDropdown;
