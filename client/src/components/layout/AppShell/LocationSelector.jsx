import React, { useState } from 'react';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import LocationPickerModal from '../../common/LocationPickerModal.jsx';
import LocationPickerPage from '../../../pages/LocationPickerPage.jsx';
import { updateUserLocation } from '../../../api/profile.api.js';
import { useAuth } from '../../../context/AuthContext.jsx';
import { toast } from '../../ui/toast.js';

const LocationSelector = ({ currentUser }) => {
  const { updateUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const location = currentUser?.location;
  const place = location?.area || location?.city;

  const currentLocationLabel = place
    ? `${place.charAt(0).toUpperCase() + place.slice(1)}, ${location.state || ''}`
    : 'Set Location';

  const handleLocationConfirm = async (locationData) => {
    setIsSaving(true);
    try {
      const newLocation = {
        country: locationData.country,
        state: locationData.state,
        city: locationData.city.toLowerCase(),
        area: locationData.area,
        pincode: locationData.pincode,
        coordinates: locationData.coordinates,
      };

      await updateUserLocation(newLocation);

      updateUser({
        ...currentUser,
        location: newLocation,
      });

      toast.success(
        'Location Updated',
        'Your location has been saved successfully.'
      );
      setIsModalOpen(false);
      setIsFullscreen(false);
    } catch (err) {
      console.error(err);
      toast.error('Update Failed', 'Could not save your location. Try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative hidden md:block">
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={isSaving}
        className={`flex items-center gap-1.5 px-3.5 py-3.5 clay-card-flat text-xs font-extrabold text-stone-700 hover:text-[#d93829] shadow-sm transition-all hover:shadow-md group ${
          isSaving ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        {isSaving ? (
          <Loader2 className="w-3.5 h-3.5 text-stone-500 animate-spin" />
        ) : (
          <MapPin className="w-3.5 h-3.5 text-[#d93829] group-hover:scale-110 transition-transform" />
        )}
        <span>{isSaving ? 'Saving...' : currentLocationLabel}</span>
      </button>

      {/* Reusing our beautiful new Location Picker Modal */}
      {!isFullscreen && (
        <LocationPickerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onExpand={() => setIsFullscreen(true)}
          initialLocation={currentUser?.location}
          onConfirm={handleLocationConfirm}
        />
      )}

      {isFullscreen && isModalOpen && (
        <LocationPickerPage
          initialLocation={currentUser?.location}
          onConfirm={handleLocationConfirm}
          onBack={() => setIsFullscreen(false)}
        />
      )}
    </div>
  );
};

export default LocationSelector;
