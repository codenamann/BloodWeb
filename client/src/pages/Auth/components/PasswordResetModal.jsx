import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2 } from 'lucide-react';
import { ResetRequestStep, ResetConfirmStep } from './reset';

export const PasswordResetModal = ({
  showResetModal,
  setShowResetModal,
  resetStep,
  setResetStep,
  resetEmail,
  setResetEmail,
  resetOtp,
  setResetOtp,
  resetNewPassword,
  setResetNewPassword,
  resetConfirmPassword,
  setResetConfirmPassword,
  resetLoading,
  resetError,
  resetSuccessMessage,
  cooldownSeconds,
  handleSendResetOtp,
  handleConfirmReset,
}) => {
  return (
    <AnimatePresence>
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full border border-stone-200 shadow-2xl relative"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowResetModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Step 1: Request OTP */}
            {resetStep === 1 && (
              <ResetRequestStep
                resetEmail={resetEmail}
                setResetEmail={setResetEmail}
                resetError={resetError}
                resetLoading={resetLoading}
                handleSendResetOtp={handleSendResetOtp}
                onClose={() => setShowResetModal(false)}
              />
            )}

            {/* Step 2: Enter Code & New Password */}
            {resetStep === 2 && (
              <ResetConfirmStep
                resetEmail={resetEmail}
                resetOtp={resetOtp}
                setResetOtp={setResetOtp}
                resetNewPassword={resetNewPassword}
                setResetNewPassword={setResetNewPassword}
                resetConfirmPassword={resetConfirmPassword}
                setResetConfirmPassword={setResetConfirmPassword}
                resetLoading={resetLoading}
                resetError={resetError}
                resetSuccessMessage={resetSuccessMessage}
                cooldownSeconds={cooldownSeconds}
                handleSendResetOtp={handleSendResetOtp}
                handleConfirmReset={handleConfirmReset}
                onBack={() => setResetStep(1)}
              />
            )}

            {/* Step 3: Success Confirmation */}
            {resetStep === 3 && (
              <div className="text-center py-4 space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-stone-900">
                  Password Reset Complete
                </h3>
                <p className="text-xs text-stone-600 max-w-xs mx-auto">
                  {resetSuccessMessage} Your new password has been applied.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PasswordResetModal;
