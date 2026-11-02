import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';

export const LocationSearchInput = ({
  searchQuery,
  setSearchQuery,
  isSearching,
  showDropdown,
  setShowDropdown,
  searchResults,
  setFlyToCoords,
  setSelectedBoundary,
}) => {
  return (
    <div className="relative z-[400] w-full">
      <div className="relative flex items-center h-12 clay-card-flat rounded-full px-4 transition-all">
        <Search className="w-5 h-5 text-stone-400 mr-3 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search a place or address..."
          className="flex-1 bg-transparent border-none outline-none text-stone-800 text-sm font-bold placeholder:font-semibold placeholder:text-stone-400"
        />
        {isSearching && <Loader2 className="w-4 h-4 text-stone-400 animate-spin ml-3 shrink-0" />}
      </div>

      <AnimatePresence>
        {showDropdown && searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-3xl shadow-xl border border-stone-200/50 overflow-hidden py-2"
          >
            {searchResults.map((result) => (
              <button
                key={result.place_id}
                onClick={() => {
                  setSearchQuery('');
                  setShowDropdown(false);
                  setFlyToCoords({ lat: parseFloat(result.lat), lng: parseFloat(result.lon) });
                  setSelectedBoundary(result.geojson || null);
                }}
                className="w-full px-4 py-3 text-left hover:bg-stone-50 transition-colors flex flex-col items-start border-b border-stone-50 last:border-0"
              >
                <span className="text-sm font-bold text-stone-800 line-clamp-1">
                  {result.display_name.split(',')[0]}
                </span>
                <span className="text-xs font-semibold text-stone-500 line-clamp-1 mt-0.5">
                  {result.display_name}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationSearchInput;
