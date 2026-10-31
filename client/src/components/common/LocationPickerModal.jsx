import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import {
  MapPin,
  Navigation,
  X,
  Check,
  Loader2,
  Search,
  Maximize2,
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { toast } from '../ui/toast.js';

import { useLocationPicker } from '../../hooks/useLocationPicker.js';
import { MapCenterObserver, MapController } from './MapComponents.jsx';

const LocationPickerModal = ({
  isOpen,
  onClose,
  onExpand,
  initialLocation,
  onConfirm,
}) => {
  const {
    address,
    center,
    setCenter,
    flyToCoords,
    setFlyToCoords,
    isLocating,
    isReverseGeocoding,
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    isSearching,
    showDropdown,
    setShowDropdown,
    isSearchExpanded,
    setIsSearchExpanded,
    handleGetCurrentLocation,
    isConfirmDisabled,
    selectedBoundary,
    setSelectedBoundary,
  } = useLocationPicker({ initialLocation, isOpen });

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
      <div
        className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 250 }}
        className="w-full sm:max-w-lg bg-[#f6f1eb] rounded-t-[32px] sm:rounded-[32px] shadow-2xl relative overflow-hidden flex flex-col h-[90vh] sm:h-auto sm:max-h-[95vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-stone-200/50 bg-white/50">
          <div className="pr-3">
            <h2 className="text-base sm:text-lg font-black text-stone-900 select-none leading-tight">
              Set Precise Location
            </h2>

            <p className="text-[11px] sm:text-xs font-semibold text-stone-500 select-none leading-tight mt-0.5">
              Drag map & position the pin
            </p>
          </div>

          <div className="flex gap-2 sm:gap-3">
            {onExpand && (
              <button
                onClick={onExpand}
                className="w-10 h-10 flex items-center justify-center rounded-full clay-card-flat text-stone-700 cursor-pointer"
                title="Expand map"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full clay-card-flat text-stone-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="relative flex-1 min-h-[30vh] sm:h-80 sm:flex-none w-full bg-stone-200">
          {/* Search Overlay */}
          <div
            className="absolute top-3 left-3 sm:top-4 sm:left-4 z-[400]"
            onMouseEnter={() => setIsSearchExpanded(true)}
            onMouseLeave={() => {
              if (!searchQuery) setIsSearchExpanded(false);
            }}
          >
            <motion.div
              initial={false}
              animate={{
                width:
                  isSearchExpanded || searchQuery
                    ? 'min(calc(100vw - 24px), 300px)'
                    : '40px',
              }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className={`relative flex items-center h-10 overflow-hidden clay-card-flat rounded-full ${
                isSearchExpanded || searchQuery
                  ? 'cursor-text'
                  : 'cursor-pointer'
              }`}
              onClick={() => setIsSearchExpanded(true)}
            >
              <div className="shrink-0 w-10 h-10 flex items-center justify-center pointer-events-none">
                <Search
                  className={`w-4 h-4 transition-colors ${
                    isSearchExpanded || searchQuery
                      ? 'text-stone-600'
                      : 'text-stone-500'
                  }`}
                />
              </div>

              <div className="flex-1 flex items-center h-full min-w-0 pr-2">
                <input
                  type="text"
                  placeholder="Search a place..."
                  className="flex-1 bg-transparent border-none text-sm font-bold text-stone-700 py-1 px-1 outline-none placeholder:text-stone-400 placeholder:font-semibold min-w-[150px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    setIsSearchExpanded(true);
                    if (searchQuery.trim().length > 2) setShowDropdown(true);
                  }}
                  onBlur={() => {
                    if (!searchQuery) setIsSearchExpanded(false);
                  }}
                />
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin text-stone-400 shrink-0 ml-1" />
                ) : searchQuery ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSearchQuery('');
                      setSearchResults([]);
                      setShowDropdown(false);
                      setSelectedBoundary(null);
                    }}
                    className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors shrink-0 ml-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : null}
              </div>
            </motion.div>

            {/* Dropdown */}
            <div
              className={`absolute top-full mt-2 left-0 w-[calc(100vw-24px)] sm:w-[320px] transition-all duration-300 origin-top ${
                (isSearchExpanded || searchQuery) &&
                showDropdown &&
                searchQuery.trim().length > 2
                  ? 'opacity-100 scale-y-100 visible'
                  : 'opacity-0 scale-y-95 invisible pointer-events-none'
              }`}
            >
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-stone-200/50 max-h-60 overflow-y-auto overflow-x-hidden flex flex-col py-2">
                {isSearching ? (
                  <div className="p-4 text-center text-xs font-semibold text-stone-500">
                    Searching...
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((res, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setFlyToCoords({
                          lat: Number(res.lat),
                          lng: Number(res.lon),
                        });
                        setSelectedBoundary(res.geojson || null);
                        setShowDropdown(false);
                      }}
                      className="text-left px-4 py-3 hover:bg-stone-50 transition-colors border-b border-stone-100 last:border-0 cursor-pointer"
                    >
                      <p className="text-sm font-bold text-stone-800 line-clamp-1">
                        {res.name || res.display_name.split(',')[0]}
                      </p>
                      <p className="text-xs font-semibold text-stone-500 line-clamp-1 mt-0.5">
                        {res.display_name}
                      </p>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs font-semibold text-stone-500">
                    No locations found
                  </div>
                )}
              </div>
            </div>
          </div>

          <MapContainer
            center={[center.lat, center.lng]}
            zoom={15}
            zoomControl={false}
            className="w-full h-full z-0"
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapCenterObserver onCenterChange={setCenter} />
            <MapController center={flyToCoords} />

            {selectedBoundary && (
              <GeoJSON
                key={JSON.stringify(selectedBoundary)}
                data={selectedBoundary}
                style={{
                  color: '#d93829',
                  weight: 2,
                  opacity: 0.8,
                  fillColor: '#d93829',
                  fillOpacity: 0.1,
                  interactive: false,
                }}
              />
            )}
          </MapContainer>

          {/* Fixed Center Pin */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none flex flex-col items-center">
            <div
              className="bg-[#d93829] text-white p-2.5 rounded-full shadow-lg mb-1 relative animate-bounce"
              style={{ animationDuration: '2s' }}
            >
              <MapPin className="w-5 h-5 fill-current" />

              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#d93829] rotate-45" />
            </div>

            <div className="w-3 h-1.5 bg-stone-900/20 rounded-full blur-[2px]" />
          </div>

          {/* Current Location Button */}
          <button
            onClick={handleGetCurrentLocation}
            className={`absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10 w-11 h-11 flex items-center justify-center rounded-full clay-card-flat text-stone-700 shadow-md transition-transform ${
              isLocating
                ? 'opacity-90 cursor-not-allowed'
                : 'cursor-pointer hover:scale-105 active:scale-95'
            }`}
            title="Use my current location"
          >
            {isLocating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Navigation className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Location Details */}
        <div className="p-4 sm:p-6 pb-6 sm:pb-6 bg-white/95 shrink-0 sm:flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6">
            {/* Area */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-wider select-none">
                Area / Neighborhood
              </label>

              <div className="px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-100 text-xs font-bold text-stone-800 min-h-[38px] flex items-center">
                {isReverseGeocoding ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-400" />
                ) : (
                  address.area || 'Not available'
                )}
              </div>
            </div>

            {/* City & Pincode */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-wider select-none">
                City & Pincode
              </label>

              <div className="px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-100 text-xs font-bold text-stone-800 min-h-[38px] flex items-center">
                {isReverseGeocoding ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-400" />
                ) : address.city ? (
                  address.pincode ? (
                    `${address.city}, ${address.pincode}`
                  ) : (
                    address.city
                  )
                ) : (
                  'Not available'
                )}
              </div>
            </div>

            {/* State & Country */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-wider select-none">
                State & Country
              </label>

              <div className="px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-100 text-xs font-bold text-stone-800 min-h-[38px] flex items-center">
                {isReverseGeocoding ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-400" />
                ) : address.state ? (
                  `${address.state}, ${address.country}`
                ) : (
                  'Not available'
                )}
              </div>
            </div>

            {/* Coordinates */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-wider select-none">
                Coordinates
              </label>

              <div className="px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-100 text-xs font-bold text-stone-500 font-mono min-h-[38px] flex items-center truncate">
                {center.lat.toFixed(5)}, {center.lng.toFixed(5)}
              </div>
            </div>
          </div>

          {/* Confirm */}
          <button
            onClick={() => onConfirm?.({ coordinates: center, ...address })}
            disabled={isConfirmDisabled}
            className={`w-full py-3.5 rounded-2xl text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isConfirmDisabled
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                : 'clay-btn-crimson shadow-md hover:scale-[1.02] active:scale-95'
            }`}
          >
            {isReverseGeocoding ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Resolving
                Address...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" /> Confirm Location
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

export default LocationPickerModal;
