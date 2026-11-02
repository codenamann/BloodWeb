import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { toast } from '../../../components/ui/toast';

const AvailabilityCard = () => {
  const { currentUser, toggleAvailability } = useAuth();

  const hasBloodGroup = !!currentUser?.bloodGroup;
  const hasLocation = !!(
    currentUser?.location?.city && currentUser?.location?.state
  );
  const hasCoordinates = !!currentUser?.location?.coordinates;
  const canBeAvailable = hasBloodGroup && hasLocation && hasCoordinates;

  return (
    <div className="p-5 rounded-2xl bg-[#faf7f2] border border-stone-200/80 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-black text-stone-900">
            Donation Availability
          </div>
          <p className="text-xs text-stone-500 font-medium mt-0.5">
            Available donors are indexed by the real-time matching engine
            for emergency requests.
          </p>
        </div>

        <button
          onClick={async () => {
            if (!hasBloodGroup) {
              toast.error(
                'Blood Group Required',
                'Please set up your verified blood group before enabling availability.'
              );
              return;
            }
            if (!hasLocation || !hasCoordinates) {
              toast.error(
                'Location Required',
                'Please set up your location and coordinates before enabling availability.'
              );
              return;
            }
            try {
              await toggleAvailability();
              toast.success(
                currentUser?.availability ? 'Availability Paused' : 'Now Available',
                currentUser?.availability
                  ? 'You will no longer receive emergency requests.'
                  : 'You are now visible to the matching engine!'
              );
            } catch (err) {
              toast.error(
                'Cannot Toggle Availability',
                err?.response?.data?.message || err?.message || 'Failed to update availability.'
              );
            }
          }}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            currentUser?.availability
              ? 'clay-btn-crimson bg-emerald-600 text-white shadow-md'
              : 'clay-btn-cream text-stone-700'
          }`}
        >
          {currentUser?.availability ? 'Available' : 'Paused'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-stone-200/60 text-xs">
        <div className="flex items-center gap-1.5">
          <CheckCircle2
            className={`w-4 h-4 ${hasBloodGroup ? 'text-emerald-600' : 'text-stone-300'}`}
          />
          <span
            className={
              hasBloodGroup
                ? 'text-stone-800 font-bold'
                : 'text-stone-400 font-medium'
            }
          >
            Blood Group: {currentUser?.bloodGroup || 'Missing'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2
            className={`w-4 h-4 ${hasLocation ? 'text-emerald-600' : 'text-stone-300'}`}
          />
          <span
            className={
              hasLocation
                ? 'text-stone-800 font-bold'
                : 'text-stone-400 font-medium'
            }
          >
            City & State:{' '}
            {currentUser?.location?.city ? 'Set' : 'Missing'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2
            className={`w-4 h-4 ${hasCoordinates ? 'text-emerald-600' : 'text-stone-300'}`}
          />
          <span
            className={
              hasCoordinates
                ? 'text-stone-800 font-bold'
                : 'text-stone-400 font-medium'
            }
          >
            Geolocation: {hasCoordinates ? 'Active' : 'Missing'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCard;
