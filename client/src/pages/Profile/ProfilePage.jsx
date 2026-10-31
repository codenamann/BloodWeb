import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from '../../components/ui/toast';
import { updateUserLocation } from '../../api/profile.api';
import LocationPickerModal from '../../components/common/LocationPickerModal';
import LocationPickerPage from '../LocationPickerPage';

import ProfileHeroCard from './components/ProfileHeroCard';
import AvailabilityCard from './components/AvailabilityCard';
import PersonalInfoCard from './components/PersonalInfoCard';
import ReliabilityCard from './components/ReliabilityCard';
import AccountActionsCard from './components/AccountActionsCard';

export const ProfilePage = () => {
  const { currentUser, updateUser } = useAuth();
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isLocationFullscreen, setIsLocationFullscreen] = useState(false);

  const handleLocationConfirm = async (locationData) => {
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
      setIsLocationModalOpen(false);
      setIsLocationFullscreen(false);
    } catch (err) {
      console.error(err);
      toast.error('Update Failed', 'Could not save your location. Try again.');
    }
  };

  return (
    <>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header Profile Hero Card */}
        <ProfileHeroCard />
        
        {/* Donor Availability Master Validation Card */}
        <AvailabilityCard />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main 2-Cols: Information Editor */}
          <div className="lg:col-span-2 space-y-6">
            <PersonalInfoCard onOpenLocationModal={() => setIsLocationModalOpen(true)} />
          </div>

          {/* Right 1-Col: Reliability & Account Actions */}
          <div className="space-y-6">
            <ReliabilityCard />
            <AccountActionsCard />
          </div>
        </div>
      </div>

      {/* Location Picker Modal */}
      {!isLocationFullscreen && (
        <LocationPickerModal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          onExpand={() => setIsLocationFullscreen(true)}
          initialLocation={currentUser?.location}
          onConfirm={handleLocationConfirm}
        />
      )}

      {isLocationFullscreen && isLocationModalOpen && (
        <LocationPickerPage
          initialLocation={currentUser?.location}
          onConfirm={handleLocationConfirm}
          onBack={() => setIsLocationFullscreen(false)}
        />
      )}
    </>
  );
};

export default ProfilePage;
