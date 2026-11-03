import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Calendar, Heart, Loader2, AlertCircle, MapPin, CheckCircle2 } from 'lucide-react';
import { differenceInYears } from 'date-fns';
import { updateDonorReadiness } from '../../api/profile.api';
import LocationPickerModal from './LocationPickerModal';
import { toast } from '../ui/toast';

export default function VolunteerSetupModal({
  isOpen,
  onClose,
  request,
  currentUser,
  updateUser,
  onVolunteerSuccess,
}) {
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [dob, setDob] = useState(
    currentUser?.dob ? new Date(currentUser.dob).toISOString().split('T')[0] : ''
  );
  const [location, setLocation] = useState(
    currentUser?.location || { country: 'India', state: '', city: '', area: '', pincode: '', coordinates: null }
  );
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !request) return null;

  const cleanPhone = phone.replace(/\D/g, '').slice(-10);
  const isPhoneValid = cleanPhone.length === 10 && /^[6-9]/.test(cleanPhone);
  const age = dob ? differenceInYears(new Date(), new Date(dob)) : null;
  const isAgeValid = age !== null && !isNaN(age) && age >= 18;
  const isLocationValid = Boolean(location?.city && location?.coordinates?.lat && location?.coordinates?.lng);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isPhoneValid) {
      setError('Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.');
      return;
    }
    if (!isAgeValid) {
      setError('You must be at least 18 years old to volunteer as a blood donor.');
      return;
    }
    if (!isLocationValid) {
      setError('Please set up your donation location on the map.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await updateDonorReadiness({
        bloodGroup: currentUser?.bloodGroup || request.patientBloodGroup,
        phone: cleanPhone,
        dob,
        location,
        availability: true,
      });

      if (res?.data?.user) updateUser(res.data.user);
      await onVolunteerSuccess(request);
      toast.success('Volunteered Successfully', 'Opening Coordination Room...');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to complete volunteering.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 14 }}
            className="clay-card p-6 sm:p-7 bg-white rounded-3xl max-w-md w-full shadow-2xl space-y-5 my-6 text-left relative"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 border border-red-200/70 flex items-center justify-center text-[#d93829] shadow-xs shrink-0">
                  <Heart className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-stone-900 leading-tight">Volunteer Eligibility</h3>
                  <p className="text-[11px] text-stone-500 font-medium mt-0.5">Contact & location verification for donor coordination</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-50 transition cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200/80 rounded-2xl flex items-center gap-2.5 text-xs text-red-700 font-bold">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Field 1: Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-stone-800 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#d93829]" />
                  <span>Contact Mobile Number</span>
                  <span className="text-[#d93829]">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="h-11 px-3 rounded-xl bg-stone-100 border border-stone-200/80 text-xs font-extrabold text-stone-700 flex items-center justify-center select-none shrink-0">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    className="h-11 flex-1 px-3.5 rounded-xl bg-stone-50/70 border border-stone-200 text-xs font-bold text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:border-[#d93829] focus:ring-2 focus:ring-red-100 transition-all"
                  />
                </div>
                <p className="text-[10px] text-stone-400 font-medium">Shared only with the coordinator/hospital once accepted.</p>
              </div>

              {/* Field 2: Date of Birth */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-stone-800 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#d93829]" />
                    <span>Date of Birth</span>
                    <span className="text-[#d93829]">*</span>
                  </label>
                  {age !== null && (
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 ${isAgeValid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-red-50 text-red-600 border border-red-200/60'}`}>
                      {isAgeValid ? `Age: ${age} • Eligible` : `Age: ${age} • Must be 18+`}
                    </span>
                  )}
                </div>
                <input
                  type="date"
                  value={dob}
                  max={new Date(Date.now() - 18 * 365.25 * 86400000).toISOString().split('T')[0]}
                  onChange={(e) => setDob(e.target.value)}
                  className="h-11 w-full px-3.5 rounded-xl bg-stone-50/70 border border-stone-200 text-xs font-bold text-stone-900 focus:bg-white focus:outline-none focus:border-[#d93829] focus:ring-2 focus:ring-red-100 transition-all"
                />
              </div>

              {/* Field 3: Location */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-stone-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#d93829]" />
                    <span>Donation Location</span>
                    <span className="text-[#d93829]">*</span>
                  </label>
                  {isLocationValid ? (
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Verified</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                      Required
                    </span>
                  )}
                </div>

                <div className="p-3.5 rounded-2xl bg-[#faf7f2] border border-stone-200/90 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-white border border-stone-200/80 flex items-center justify-center text-[#d93829] shrink-0 shadow-2xs">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-black text-stone-900 capitalize truncate">
                        {[location.area, location.city].filter(Boolean).join(', ') || 'Select Location'}
                      </div>
                      <div className="text-[10px] text-stone-500 font-medium truncate">
                        {[location.state, location.country, location.pincode].filter(Boolean).join(', ')}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPickerOpen(true)}
                    className="clay-btn-cream h-8 px-3 rounded-xl text-xs font-bold text-stone-700 hover:text-stone-900 shadow-2xs shrink-0 cursor-pointer"
                  >
                    Change
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 h-11 rounded-2xl clay-btn-cream text-xs font-bold text-stone-700 hover:text-stone-900 flex items-center justify-center cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !isPhoneValid || !isAgeValid || !isLocationValid}
                  className="flex-[1.6] h-11 rounded-2xl clay-btn-crimson text-white text-xs font-black shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className="w-4 h-4 fill-white" />}
                  <span>{submitting ? 'Confirming...' : 'Confirm & Volunteer'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </AnimatePresence>

      {isPickerOpen && (
        <LocationPickerModal
          isOpen={isPickerOpen}
          onClose={() => setIsPickerOpen(false)}
          initialLocation={location}
          onConfirm={(newLoc) => {
            setLocation(newLoc);
            setIsPickerOpen(false);
          }}
        />
      )}
    </>
  );
}
