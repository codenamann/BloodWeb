import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { MapPin, Navigation, ArrowLeft, Check, Loader2, Search } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { useLocationPicker } from '../hooks/useLocationPicker.js';
import { MapCenterObserver, MapController } from '../components/common/MapComponents.jsx';

const LocationPickerPage = ({ initialLocation, onConfirm, onBack }) => {
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
    isSearching,
    showDropdown,
    setShowDropdown,
    handleGetCurrentLocation,
    isConfirmDisabled,
    selectedBoundary,
    setSelectedBoundary,
  } = useLocationPicker({ initialLocation, isOpen: true });

  const renderSearch = () => (
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

  const renderDetails = () => (
    <div className="clay-card rounded-[2rem] p-4 sm:p-6 w-full flex flex-col gap-4 relative overflow-hidden pointer-events-auto">
      {/* Decorative top bar for mobile sheet look */}
      <div className="w-12 h-1.5 bg-stone-200 rounded-full mx-auto sm:hidden mb-1" />
      
      <div>
        <h2 className="text-xl font-black text-stone-800 mb-1 leading-tight">
          {address.city ? (address.pincode ? `${address.city}, ${address.pincode}` : address.city) : 'Locating...'}
        </h2>
        <p className="text-sm font-bold text-stone-500 leading-snug">
          {address.area ? `${address.area}, ${address.state}` : address.state || 'Scanning area...'}
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs font-mono font-bold text-stone-400 bg-stone-50 py-2.5 px-3 rounded-xl border border-stone-100 w-fit">
        <MapPin className="w-3.5 h-3.5 text-stone-300" />
        {center.lat.toFixed(5)}, {center.lng.toFixed(5)}
      </div>

      <button
        onClick={() => onConfirm?.({ coordinates: center, ...address })}
        disabled={isConfirmDisabled}
        className={`w-full py-4 rounded-2xl text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer mt-1 ${
          isConfirmDisabled
            ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
            : 'clay-btn-crimson shadow-md hover:scale-[1.02] active:scale-95'
        }`}
      >
        {isReverseGeocoding ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Resolving Address...
          </>
        ) : (
          <>
            <Check className="w-4 h-4" /> Confirm Location
          </>
        )}
      </button>
    </div>
  );

  return createPortal(
    <div className="fixed inset-0 z-[100] bg-stone-100 flex flex-col overflow-hidden">
      
      {/* MAP LAYER */}
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={15}
          zoomControl={false}
          className="w-full h-full z-0"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
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
          <div className="bg-[#d93829] text-white p-3 rounded-full shadow-xl mb-1 relative animate-bounce" style={{ animationDuration: '2s' }}>
            <MapPin className="w-6 h-6 fill-current" />
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#d93829] rotate-45 rounded-sm" />
          </div>
          <div className="w-5 h-2 bg-stone-900/30 rounded-full blur-[2px]" />
        </div>
      </div>

      {/* FOREGROUND CONTROLS LAYER */}
      
      {/* Mobile Top Controls */}
      <div className="absolute top-0 left-0 right-0 p-3 pt-4 z-10 sm:hidden pointer-events-none flex gap-2">
        <button
          onClick={onBack}
          className="w-12 h-12 clay-card-flat rounded-full flex items-center justify-center text-stone-700 pointer-events-auto active:scale-95 transition-transform shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 pointer-events-auto">
          {renderSearch()}
        </div>
      </div>

      {/* Desktop Left Panel */}
      <div className="absolute top-6 left-6 bottom-6 w-[360px] z-10 hidden sm:flex flex-col gap-5 pointer-events-none">
        <div className="flex gap-3 pointer-events-auto">
          <button
            onClick={onBack}
            className="w-12 h-12 clay-card-flat rounded-full flex items-center justify-center text-stone-700 pointer-events-auto active:scale-95 transition-all shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            {renderSearch()}
          </div>
        </div>
        
        <div className="mt-auto pointer-events-auto">
          {renderDetails()}
        </div>
      </div>

      {/* Desktop Current Location */}
      <button
        onClick={handleGetCurrentLocation}
        className="absolute bottom-6 right-6 z-10 hidden sm:flex w-12 h-12 clay-card-flat rounded-full items-center justify-center text-stone-700 pointer-events-auto hover:scale-105 active:scale-95 transition-transform"
      >
        {isLocating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5" />}
      </button>

      {/* Mobile Bottom Area */}
      <div className="absolute bottom-0 left-0 right-0 p-3 pb-4 z-10 sm:hidden pointer-events-none flex flex-col justify-end items-end gap-3">
        {/* Current Location Button */}
        <button
          onClick={handleGetCurrentLocation}
          className={`w-12 h-12 clay-card-flat rounded-full flex items-center justify-center text-stone-700 pointer-events-auto active:scale-95 transition-transform ${
            isLocating ? 'opacity-90 cursor-not-allowed' : ''
          }`}
        >
          {isLocating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Navigation className="w-6 h-6" />}
        </button>
        
        {/* Bottom Sheet */}
        <div className="w-full pointer-events-auto">
          {renderDetails()}
        </div>
      </div>

    </div>,
    document.body
  );
};

export default LocationPickerPage;
