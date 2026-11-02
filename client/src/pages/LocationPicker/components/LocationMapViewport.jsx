import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { MapCenterObserver, MapController } from '../../../components/common/MapComponents.jsx';

export const LocationMapViewport = ({
  center,
  setCenter,
  flyToCoords,
  selectedBoundary,
}) => {
  return (
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
        <div
          className="bg-[#d93829] text-white p-3 rounded-full shadow-xl mb-1 relative animate-bounce"
          style={{ animationDuration: '2s' }}
        >
          <MapPin className="w-6 h-6 fill-current" />
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#d93829] rotate-45 rounded-sm" />
        </div>
        <div className="w-5 h-2 bg-stone-900/30 rounded-full blur-[2px]" />
      </div>
    </div>
  );
};

export default LocationMapViewport;
