import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { ClayButton } from '../../../components/ui';
import { BloodGroupSelector } from '../../../components/common/BloodGroupSelector';
import LocationPickerModal from '../../../components/common/LocationPickerModal';
import { updateDonorReadiness } from '../../../api/profile.api';
import { toast } from '../../../components/ui/toast';
import {
  DonorReadinessHeader,
  DonorLocationFields,
  DonorAvailabilityToggle,
} from './readiness';

export const DonorReadinessModal = ({
  isOpen,
  onClose,
  currentUser,
  onSuccess,
}) => {
  const [selectedBloodGroup, setSelectedBloodGroup] = useState(
    currentUser?.bloodGroup || ''
  );
  const [locCountry, setLocCountry] = useState(
    currentUser?.location?.country || ''
  );
  const [locState, setLocState] = useState(currentUser?.location?.state || '');
  const [locCity, setLocCity] = useState(currentUser?.location?.city || '');
  const [locArea, setLocArea] = useState(currentUser?.location?.area || '');
  const [locPincode, setLocPincode] = useState(
    currentUser?.location?.pincode || ''
  );
  const [locCoords, setLocCoords] = useState(
    currentUser?.location?.coordinates || null
  );
  const [availabilityState, setAvailabilityState] = useState(
    Boolean(currentUser?.availability)
  );

  const [setupError, setSetupError] = useState('');
  const [isSavingSetup, setIsSavingSetup] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  useEffect(() => {
    if (currentUser && isOpen) {
      setSelectedBloodGroup(currentUser.bloodGroup || '');
      setLocCountry(currentUser.location?.country || '');
      setLocState(currentUser.location?.state || '');
      setLocCity(currentUser.location?.city || '');
      setLocArea(currentUser.location?.area || '');
      setLocPincode(currentUser.location?.pincode || '');
      setLocCoords(currentUser.location?.coordinates || null);
      setAvailabilityState(Boolean(currentUser.availability));
      setSetupError('');
    }
  }, [currentUser, isOpen]);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Location Error', 'Geolocation is not supported by your browser.');
      return;
    }
    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          setLocCoords({ lat: latitude, lng: longitude });
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const country = addr.country || '';
            const city =
              addr.city || addr.town || addr.village || addr.suburb || '';
            const state = addr.state || '';
            const area =
              addr.suburb || addr.neighbourhood || addr.road || '';
            const pincode = addr.postcode || '';
            if (country) setLocCountry(country);
            if (state) setLocState(state);
            if (city) setLocCity(city);
            if (area) setLocArea(area);
            if (pincode) setLocPincode(pincode);
            toast.success(
              'Location Detected',
              `${city || area || 'Location'}, ${state}`
            );
          }
        } catch (e) {
          console.error('Reverse geocode failed:', e);
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (err) => {
        console.warn('Geolocation denied or error:', err);
        setIsDetectingLocation(false);
        toast.error(
          'Location Access Denied',
          'Please enter your location manually or pick on map.'
        );
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSaveDonorReadiness = async (e) => {
    if (e) e.preventDefault();
    setSetupError('');

    const trimmedBloodGroup = selectedBloodGroup?.trim();
    if (!trimmedBloodGroup) {
      setSetupError('Please select your blood group.');
      return;
    }

    const trimmedCountry = locCountry.trim();
    const trimmedState = locState.trim();
    const trimmedCity = locCity.trim();
    const trimmedArea = locArea.trim();
    const trimmedPincode = locPincode.trim();

    if (!trimmedCountry || !trimmedState || !trimmedCity || !trimmedArea || !trimmedPincode) {
      setSetupError('All location fields (Country, State, City, Area, Pincode) must be provided.');
      return;
    }

    if (
      !locCoords ||
      typeof locCoords.lat !== 'number' ||
      typeof locCoords.lng !== 'number'
    ) {
      setSetupError(
        'Precise coordinates are required for emergency donor discovery. Please use "Pick on Map" or "Detect Location" to capture your exact coordinates.'
      );
      return;
    }

    if (!availabilityState) {
      setSetupError('Donor availability status must be active (ON) to discover requests.');
      return;
    }

    setIsSavingSetup(true);
    try {
      const res = await updateDonorReadiness({
        bloodGroup: trimmedBloodGroup,
        location: {
          country: trimmedCountry,
          state: trimmedState,
          city: trimmedCity,
          area: trimmedArea,
          pincode: trimmedPincode,
          coordinates: {
            lat: locCoords.lat,
            lng: locCoords.lng,
          },
        },
        availability: true,
      });

      if (res.status === 'success' && res.data?.user) {
        toast.success(
          'Ready to Discover!',
          'Your donor requirements are verified. Showing matching requests.'
        );
        onSuccess?.(res.data.user);
        onClose();
      }
    } catch (err) {
      console.error('Failed to update donor readiness:', err);
      setSetupError(
        err.response?.data?.message ||
          err.message ||
          'Failed to save details. Please try again.'
      );
    } finally {
      setIsSavingSetup(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="clay-card p-6 sm:p-7 bg-white border border-stone-200/80 shadow-2xl rounded-3xl max-w-lg w-full space-y-5 my-8 text-left"
          >
            <DonorReadinessHeader onClose={onClose} />

            {setupError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700 font-bold">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{setupError}</span>
              </div>
            )}

            <form onSubmit={handleSaveDonorReadiness} className="space-y-4">
              <BloodGroupSelector
                value={selectedBloodGroup}
                onChange={(bg) => {
                  setSelectedBloodGroup(bg);
                  setSetupError('');
                }}
                label="1. Verified Blood Group"
                required
              />

              <DonorLocationFields
                locCountry={locCountry}
                setLocCountry={setLocCountry}
                locState={locState}
                setLocState={setLocState}
                locCity={locCity}
                setLocCity={setLocCity}
                locArea={locArea}
                setLocArea={setLocArea}
                locPincode={locPincode}
                setLocPincode={setLocPincode}
                locCoords={locCoords}
                isDetectingLocation={isDetectingLocation}
                handleDetectLocation={handleDetectLocation}
                onOpenPicker={() => setIsPickerOpen(true)}
                onClearError={() => setSetupError('')}
              />

              <DonorAvailabilityToggle
                availabilityState={availabilityState}
                onToggle={() => {
                  setAvailabilityState((prev) => !prev);
                  setSetupError('');
                }}
              />

              {/* Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-1/3 py-2.5 text-xs font-bold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <ClayButton
                  type="submit"
                  disabled={
                    isSavingSetup ||
                    !selectedBloodGroup ||
                    !locCountry.trim() ||
                    !locState.trim() ||
                    !locCity.trim() ||
                    !locArea.trim() ||
                    !locPincode.trim() ||
                    !locCoords ||
                    !availabilityState
                  }
                  className="w-full sm:w-2/3 py-2.5 text-xs font-black shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSavingSetup ? (
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Details...</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <span>Save & Discover Requests</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  )}
                </ClayButton>
              </div>
            </form>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Visual Map Modal */}
      {isPickerOpen && (
        <LocationPickerModal
          isOpen={isPickerOpen}
          onClose={() => setIsPickerOpen(false)}
          initialLocation={{
            country: locCountry,
            city: locCity,
            state: locState,
            area: locArea,
            pincode: locPincode,
            coordinates: locCoords,
          }}
          onConfirm={(locData) => {
            if (locData.country) setLocCountry(locData.country);
            if (locData.state) setLocState(locData.state);
            if (locData.city) setLocCity(locData.city);
            if (locData.area) setLocArea(locData.area);
            if (locData.pincode) setLocPincode(locData.pincode);
            if (locData.coordinates) setLocCoords(locData.coordinates);
            setIsPickerOpen(false);
            toast.success(
              'Location Selected',
              `${locData.city || locData.area}, ${locData.state}`
            );
          }}
        />
      )}
    </>
  );
};

export default DonorReadinessModal;
