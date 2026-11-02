import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';

export const CancelRequestModal = ({
  requestToCancel,
  onClose,
  confirmCancel,
  cancelling,
}) => {
  return (
    <AnimatePresence>
      {requestToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="clay-card bg-white max-w-md w-full p-6 space-y-5 rounded-3xl shadow-2xl relative border border-stone-200"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-[#d93829] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-black text-stone-900">
                  Cancel Blood Request?
                </h3>
                <p className="text-xs text-stone-500 font-medium leading-relaxed">
                  Are you sure you want to cancel this emergency request? Any registered volunteers will be notified that this request is no longer active. This action cannot be undone.
                </p>
              </div>
            </div>

            {/* Request snippet */}
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between text-xs">
              <div>
                <span className="font-extrabold text-stone-900">
                  {requestToCancel.unitsNeeded} {requestToCancel.unitsNeeded === 1 ? 'Unit' : 'Units'} needed
                </span>
                <div className="text-[11px] text-stone-500 truncate max-w-[200px]">
                  {requestToCancel.hospitalName || 'Hospital'}
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-red-50 text-[#d93829] font-black border border-red-200/70 text-xs">
                {requestToCancel.patientBloodGroup}
              </span>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={cancelling}
                className="clay-btn-cream px-4 py-2.5 text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Keep Request
              </button>
              <button
                type="button"
                onClick={confirmCancel}
                disabled={cancelling}
                className="clay-btn-crimson px-5 py-2.5 text-xs font-black text-white flex items-center gap-2 shadow-sm disabled:opacity-60 cursor-pointer"
              >
                {cancelling ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Cancelling...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Yes, Cancel Request</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CancelRequestModal;
