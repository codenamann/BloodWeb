import React from 'react';
import { createPortal } from 'react-dom';
import { Navigation, ArrowLeft, Loader2 } from 'lucide-react';
import { useLocationPicker } from '../hooks/useLocationPicker.js';
import {
  LocationSearchInput,
  LocationDetailsSheet,
  LocationMapViewport,
} from './LocationPicker/components';

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
    <LocationSearchInput
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      isSearching={isSearching}
      showDropdown={showDropdown}
      setShowDropdown={setShowDropdown}
      searchResults={searchResults}
      setFlyToCoords={setFlyToCoords}
      setSelectedBoundary={setSelectedBoundary}
    />
  );

  const renderDetails = () => (
    <LocationDetailsSheet
      address={address}
      center={center}
      isReverseGeocoding={isReverseGeocoding}
      isConfirmDisabled={isConfirmDisabled}
      onConfirm={onConfirm}
    />
  );

  return createPortal(
    <div className="fixed inset-0 z-[100] bg-stone-100 flex flex-col overflow-hidden">
      {/* MAP LAYER */}
      <LocationMapViewport
        center={center}
        setCenter={setCenter}
        flyToCoords={flyToCoords}
        selectedBoundary={selectedBoundary}
      />

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

      {/* Desktop Current Location Button */}
      <button
        onClick={handleGetCurrentLocation}
        className="absolute bottom-6 right-6 z-10 hidden sm:flex w-12 h-12 clay-card-flat rounded-full items-center justify-center text-stone-700 pointer-events-auto hover:scale-105 active:scale-95 transition-transform"
      >
        {isLocating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5" />}
      </button>

      {/* Mobile Bottom Area */}
      <div className="absolute bottom-0 left-0 right-0 p-3 pb-4 z-10 sm:hidden pointer-events-none flex flex-col justify-end items-end gap-3">
        <button
          onClick={handleGetCurrentLocation}
          className={`w-12 h-12 clay-card-flat rounded-full flex items-center justify-center text-stone-700 pointer-events-auto active:scale-95 transition-transform ${
            isLocating ? 'opacity-90 cursor-not-allowed' : ''
          }`}
        >
          {isLocating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Navigation className="w-6 h-6" />}
        </button>
        
        <div className="w-full pointer-events-auto">
          {renderDetails()}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LocationPickerPage;
