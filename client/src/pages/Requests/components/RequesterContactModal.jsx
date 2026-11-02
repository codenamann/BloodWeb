import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, AlertCircle, X, Loader2, ArrowRight } from 'lucide-react';
import { ClayButton } from '../../../components/ui';
import { updateContactInfo } from '../../../api/profile.api';
import { RequesterPhoneInput, RequesterEmailStatusRow } from './contact';

export const RequesterContactModal = ({ isOpen, onClose, currentUser, onSuccess }) => {
  const [contactName, setContactName] = useState(currentUser?.name || '');
  const [contactPhone, setContactPhone] = useState(
    (currentUser?.phone || '').replace(/\D/g, '').slice(-10)
  );
  const [contactError, setContactError] = useState('');
  const [isSavingContact, setIsSavingContact] = useState(false);

  useEffect(() => {
    if (currentUser && isOpen) {
      const pDigits = (currentUser.phone || '').replace(/\D/g, '').slice(-10);
      setContactName(currentUser.name || '');
      setContactPhone(pDigits);
      setContactError('');
    }
  }, [currentUser, isOpen]);

  const handleSaveContact = async (e) => {
    e.preventDefault();
    setContactError('');

    const trimmedName = contactName.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setContactError('Please enter your full name (minimum 2 characters).');
      return;
    }

    const cleanedPhone = contactPhone.replace(/\D/g, '').slice(-10);
    if (!cleanedPhone || cleanedPhone.length !== 10 || !/^[6-9]/.test(cleanedPhone)) {
      setContactError('Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.');
      return;
    }

    if (!currentUser?.emailVerified) {
      setContactError('Your email address must be verified before creating emergency requests.');
      return;
    }

    setIsSavingContact(true);
    try {
      const res = await updateContactInfo({
        name: trimmedName,
        phone: cleanedPhone,
      });
      if (res.status === 'success' && res.data?.user) {
        onSuccess?.(res.data.user);
        onClose();
      }
    } catch (err) {
      console.error('Failed to update contact info:', err);
      setContactError(
        err.response?.data?.message || err.message || 'Failed to save contact information.'
      );
    } finally {
      setIsSavingContact(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="clay-card p-6 sm:p-8 bg-white border border-stone-200/80 shadow-2xl rounded-3xl max-w-lg w-full space-y-5 my-8 text-left"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide uppercase bg-red-100 text-[#d93829] inline-block">
                Required to Broadcast Request
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                Complete Contact Details
              </h2>
              <p className="text-xs text-stone-500 font-medium leading-relaxed">
                Emergency blood requests require your verified contact details so donors and coordination rooms can reach you immediately.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
              title="Go Back"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSaveContact} className="space-y-4 pt-1">
            {contactError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-[#d93829] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{contactError}</span>
              </div>
            )}

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-stone-700 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-stone-400" />
                  <span>Full Name</span>
                </span>
                <span className="text-[10px] text-stone-400 font-bold">Required</span>
              </label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full px-3.5 py-2.5 text-xs bg-[#faf7f2] rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#d93829]/30 font-bold text-stone-800"
              />
            </div>

            {/* Phone Number */}
            <RequesterPhoneInput
              contactPhone={contactPhone}
              setContactPhone={setContactPhone}
            />

            {/* Email Address Status */}
            <RequesterEmailStatusRow currentUser={currentUser} />

            {/* Actions */}
            <div className="pt-3 flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-1/3 py-2.5 text-xs font-bold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <ClayButton
                type="submit"
                disabled={isSavingContact || !contactName.trim() || contactPhone.length !== 10}
                className="w-full sm:w-2/3 py-2.5 text-xs font-black shadow-md cursor-pointer disabled:opacity-50"
              >
                {isSavingContact ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving Details...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <span>Save & Continue to Form</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                )}
              </ClayButton>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RequesterContactModal;
