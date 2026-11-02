import { useState, useEffect } from 'react';
import { updateDonorReadiness } from '../../../../api/profile.api';
import { toast } from '../../../../components/ui/toast';

export const useDonorReadinessForm = ({ isOpen, currentUser, onSuccess, onClose }) => {
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

  const handleSaveDonorReadiness = async (e) => {
    if (e) e.preventDefault();
    setSetupError('');

    const trimmedBloodGroup = selectedBloodGroup?.trim();
    if (!trimmedBloodGroup) {
      setSetupError('Please select your blood group.');
      return;
    }

    const trimmedCountry = locCountry?.trim() || '';
    const trimmedState = locState?.trim() || '';
    const trimmedCity = locCity?.trim() || '';
    const trimmedArea = locArea?.trim() || '';
    const trimmedPincode = locPincode?.trim() || '';

    if (
      !locCoords ||
      typeof locCoords.lat !== 'number' ||
      typeof locCoords.lng !== 'number' ||
      !trimmedCountry ||
      !trimmedState ||
      !trimmedCity
    ) {
      setSetupError(
        'Please set up your location using the location picker to continue.'
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

  const handleMapConfirm = (locData) => {
    if (locData.country) setLocCountry(locData.country);
    if (locData.state) setLocState(locData.state);
    if (locData.city) setLocCity(locData.city);
    if (locData.area) setLocArea(locData.area);
    if (locData.pincode) setLocPincode(locData.pincode);
    if (locData.coordinates) setLocCoords(locData.coordinates);
    setSetupError('');
    setIsPickerOpen(false);
    toast.success(
      'Location Selected',
      `${locData.city || locData.area}, ${locData.state}`
    );
  };

  return {
    selectedBloodGroup,
    setSelectedBloodGroup,
    locCountry,
    locState,
    locCity,
    locArea,
    locPincode,
    locCoords,
    availabilityState,
    setAvailabilityState,
    setupError,
    setSetupError,
    isSavingSetup,
    isPickerOpen,
    setIsPickerOpen,
    handleSaveDonorReadiness,
    handleMapConfirm,
  };
};

export default useDonorReadinessForm;
