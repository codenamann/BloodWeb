import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Loader2 } from 'lucide-react';

export const WithdrawConfirmationModal = ({
  responseToWithdraw,
  onClose,
  confirmWithdraw,
  actionLoading,
}) => {
  return (
    <AnimatePresence>
      {responseToWithdraw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="clay-card bg-white max-w-md w-full p-6 space-y-5 rounded-3xl shadow-2xl relative border border-stone-200"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-black text-stone-900">
                  Withdraw Volunteer Offer?
                </h3>
                <p className="text-xs text-stone-500 font-medium leading-relaxed">
                  Are you sure you want to withdraw your offer to donate for this emergency? The requester will be notified that you are no longer available.
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={actionLoading}
                className="clay-btn-cream px-4 py-2.5 text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Keep Offer
              </button>
              <button
                type="button"
                onClick={confirmWithdraw}
                disabled={actionLoading}
                className="clay-btn-crimson px-5 py-2.5 text-xs font-black text-white flex items-center gap-2 shadow-sm disabled:opacity-60 cursor-pointer"
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Withdrawing...</span>
                  </>
                ) : (
                  <span>Yes, Withdraw Offer</span>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WithdrawConfirmationModal;
