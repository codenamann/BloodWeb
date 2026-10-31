import { useEffect } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';

export const MapCenterObserver = ({ onCenterChange }) => {
  const map = useMap();

  useMapEvents({
    moveend: () => {
      const center = map.getCenter();

      onCenterChange({
        lat: center.lat,
        lng: center.lng,
      });
    },
  });

  return null;
};

export const MapController = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.flyTo([center.lat, center.lng], 15, { animate: true, duration: 1 });
    }
  }, [center, map]);

  return null;
};
