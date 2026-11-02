import React from 'react';
import { AlertCircle, CheckCircle2, Heart } from 'lucide-react';
import { ClayButton } from '../../../components/ui';

export const DonorsIncompleteRequirements = ({
  hasBloodGroup,
  hasLocation,
  isAvailable,
  currentUser,
  onConfigureClick,
}) => {
  return (
    <div className="clay-card p-8 sm:p-10 text-center bg-white space-y-4 shadow-xs border border-amber-200/60">
      <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-xs border border-amber-200/60">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-black text-stone-900">
          Strict Requirements Incomplete
        </h3>
        <p className="text-xs text-stone-500 max-w-md mx-auto">
          To discover and respond to emergency blood requests, you must strictly
          configure your blood group, location, and active donor availability.
        </p>
      </div>

      {/* Requirements Status Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-lg mx-auto text-left pt-1">
        <div
          className={`p-3 rounded-xl border text-xs transition-colors ${
            hasBloodGroup
              ? 'bg-emerald-50/60 border-emerald-200/60 text-emerald-900'
              : 'bg-red-50/60 border-red-200/60 text-red-900'
          }`}
        >
          <div className="font-extrabold flex items-center gap-1.5">
            {hasBloodGroup ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-red-500" />
            )}
            <span>Blood Group</span>
          </div>
          <div className="text-[10px] font-bold mt-0.5 opacity-80">
            {currentUser?.bloodGroup || 'Not Configured'}
          </div>
        </div>

        <div
          className={`p-3 rounded-xl border text-xs transition-colors ${
            hasLocation
              ? 'bg-emerald-50/60 border-emerald-200/60 text-emerald-900'
              : 'bg-red-50/60 border-red-200/60 text-red-900'
          }`}
        >
          <div className="font-extrabold flex items-center gap-1.5">
            {hasLocation ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-red-500" />
            )}
            <span>Location</span>
          </div>
          <div className="text-[10px] font-bold mt-0.5 opacity-80 truncate">
            {hasLocation
              ? `${currentUser.location.city}, ${currentUser.location.state}`
              : currentUser?.location?.city
                ? 'Coordinates Missing'
                : 'Not Configured'}
          </div>
        </div>

        <div
          className={`p-3 rounded-xl border text-xs transition-colors ${
            isAvailable
              ? 'bg-emerald-50/60 border-emerald-200/60 text-emerald-900'
              : 'bg-amber-50/60 border-amber-200/60 text-amber-900'
          }`}
        >
          <div className="font-extrabold flex items-center gap-1.5">
            {isAvailable ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            )}
            <span>Availability</span>
          </div>
          <div className="text-[10px] font-bold mt-0.5 opacity-80">
            {isAvailable ? 'Active (ON)' : 'Paused (OFF)'}
          </div>
        </div>
      </div>

      <div className="pt-2">
        <ClayButton
          onClick={onConfigureClick}
          rounded="2xl"
          className="px-6 py-2.5 text-xs font-black shadow-md cursor-pointer inline-flex items-center gap-1.5"
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Configure Strict Requirements Now</span>
        </ClayButton>
      </div>
    </div>
  );
};

export default DonorsIncompleteRequirements;
