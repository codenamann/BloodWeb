import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from '../components/ui/toast.js';

export const reverseGeocode = async ({ lat, lng }) => {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
    {
      headers: {
        'Accept-Language': 'en-US,en;q=0.9',
      },
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch address');
  }

  const data = await res.json();
  return data;
};

export const searchLocation = async (query) => {
  if (!query) return [];

  const params = new URLSearchParams({
    format: 'json',
    q: query,
    limit: '5',
    addressdetails: '1',
    countrycodes: 'in',
    polygon_geojson: '1',
  });

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?${params.toString()}`,
    {
      headers: {
        'Accept-Language': 'en-US,en;q=0.9',
      },
    }
  );

  if (!res.ok) throw new Error('Search failed');

  return res.json();
};

export function useLocationPicker({ initialLocation, isOpen = true }) {
  const defaultCenter = {
    lat: 24.6,
    lng: 80.83,
  };

  const [address, setAddress] = useState({
    area: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
  });

  const [center, setCenter] = useState(
    initialLocation?.coordinates || defaultCenter
  );

  const lastFetchedCenter = useRef(
    initialLocation?.coordinates || defaultCenter
  );

  const [flyToCoords, setFlyToCoords] = useState(null);

  const [isLocating, setIsLocating] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [selectedBoundary, setSelectedBoundary] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const coords = initialLocation?.coordinates || defaultCenter;
      setCenter(coords);
      setFlyToCoords(coords);
      lastFetchedCenter.current = coords;
      setAddress({
        area: initialLocation?.area || '',
        city: initialLocation?.city || '',
        state: initialLocation?.state || '',
        country: initialLocation?.country || '',
        pincode: initialLocation?.pincode || '',
      });
      setSearchQuery('');
      setSearchResults([]);
      setShowDropdown(false);
      setIsSearchExpanded(false);
      setSelectedBoundary(null);
    }
  }, [isOpen, initialLocation]); // Reactivity to initialLocation changes on open

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (searchQuery.trim().length > 2) {
        setIsSearching(true);
        try {
          const results = await searchLocation(searchQuery);
          setSearchResults(results);
          setShowDropdown(true);
        } catch (err) {
          console.error(err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    if (!isOpen) return;

    const isSameLocation =
      lastFetchedCenter.current?.lat?.toFixed(4) === center.lat?.toFixed(4) &&
      lastFetchedCenter.current?.lng?.toFixed(4) === center.lng?.toFixed(4);

    if (isSameLocation && address.city) {
      return;
    }

    const fetchAddress = async () => {
      setIsReverseGeocoding(true);
      try {
        const data = await reverseGeocode(center);

        if (data && data.address) {
          const addr = data.address;

          setAddress({
            area:
              addr.suburb ||
              addr.neighbourhood ||
              addr.village ||
              addr.road ||
              '',
            city: addr.city || addr.town || addr.state_district || '',
            state: addr.state || '',
            country: addr.country || '',
            pincode: addr.postcode || '',
          });

          lastFetchedCenter.current = center;
        }
      } catch (error) {
        console.error(error);
        return;
      } finally {
        setIsReverseGeocoding(false);
      }
    };

    const timer = setTimeout(fetchAddress, 800);

    return () => clearTimeout(timer);
  }, [center, isOpen]);

  const handleGetCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error('Not Supported', 'Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        if (accuracy >= 200) {
          toast.error(
            'Imprecise Location',
            'Please adjust the pin manually on the map.'
          );

          setIsLocating(false);
          return;
        }

        const coords = {
          lat: latitude,
          lng: longitude,
        };

        setFlyToCoords(coords);
        setIsLocating(false);
      },
      (error) => {
        console.error(error);
        setIsLocating(false);

        if (error.code === error.PERMISSION_DENIED) {
          toast.error(
            'Access Denied',
            'Please allow location permission in your browser.'
          );
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          toast.error(
            'Location Error',
            'Your current location could not be determined.'
          );
        } else if (error.code === error.TIMEOUT) {
          toast.error(
            'Request Timed Out',
            'The location request took too long. Try again.'
          );
        } else {
          toast.error('Location Error', 'Unable to retrieve your location.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  const isUnchanged =
    !!initialLocation?.coordinates &&
    center.lat?.toFixed(4) === initialLocation.coordinates.lat?.toFixed(4) &&
    center.lng?.toFixed(4) === initialLocation.coordinates.lng?.toFixed(4);

  const isConfirmDisabled = isReverseGeocoding || !address.city || isUnchanged;

  return {
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
  };
}
