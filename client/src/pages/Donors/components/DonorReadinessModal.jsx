import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { ClayButton } from '../../../components/ui';
import { BloodGroupSelector } from '../../../components/common/BloodGroupSelector';
import LocationPickerModal from '../../../components/common/LocationPickerModal';
import {
  DonorReadinessHeader,
  DonorLocationFields,
  DonorAvailabilityToggle,
} from './readiness';
import { useDonorReadinessForm } from './readiness/useDonorReadinessForm';
import { toast } from '../../../components/ui/toast';

export const DonorReadinessModal = ({
  isOpen,
  onClose,
  currentUser,
  onSuccess,
}) => {
  const {
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
  } = useDonorReadinessForm({ isOpen, currentUser, onSuccess, onClose });

  if (!isOpen) return null;

  const isLocationReady = Boolean(
    locCoords &&
    typeof locCoords.lat === 'number' &&
    typeof locCoords.lng === 'number' &&
    locCountry?.trim() &&
    locState?.trim() &&
    locCity?.trim()
  );

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
                locState={locState}
                locCity={locCity}
                locArea={locArea}
                locPincode={locPincode}
                locCoords={locCoords}
                onOpenPicker={() => setIsPickerOpen(true)}
              />

              <DonorAvailabilityToggle
                availabilityState={availabilityState}
                hasBloodGroup={Boolean(selectedBloodGroup)}
                onToggle={() => {
                  if (!selectedBloodGroup) {
                    toast.error(
                      'Blood Group Required',
                      'Please select your verified blood group first before turning on donor availability.'
                    );
                    setSetupError('Please select your verified blood group first.');
                    return;
                  }
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
                    !isLocationReady ||
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
          onConfirm={handleMapConfirm}
        />
      )}
    </>
  );
};

export default DonorReadinessModal;
