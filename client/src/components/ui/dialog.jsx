import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const Dialog = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
      />
      {children}
    </div>
  );
};

export const DialogContent = React.forwardRef(
  ({ children, className = '', onClose, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 15 }}
      className={`relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto clay-card bg-[#faf7f2] p-5 sm:p-8 shadow-2xl ${className}`}
      {...props}
    >
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full clay-btn-cream text-slate-500 hover:text-slate-800 transition-colors cursor-pointer z-10"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      {children}
    </motion.div>
  )
);
DialogContent.displayName = 'DialogContent';

export const DialogHeader = ({ children, className = '', ...props }) => (
  <div className={`flex items-center gap-3 mb-5 sm:mb-6 pr-8 ${className}`} {...props}>
    {children}
  </div>
);
DialogHeader.displayName = 'DialogHeader';

export const DialogTitle = ({ children, className = '', ...props }) => (
  <h3 className={`text-lg sm:text-2xl font-extrabold text-[#1c1d22] tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);
DialogTitle.displayName = 'DialogTitle';

export const DialogDescription = ({ children, className = '', ...props }) => (
  <p className={`text-[11px] sm:text-xs text-[#575965] font-medium ${className}`} {...props}>
    {children}
  </p>
);
DialogDescription.displayName = 'DialogDescription';

export const DialogFooter = ({ children, className = '', ...props }) => (
  <div className={`pt-4 border-t border-stone-200/60 flex items-center justify-end gap-3 ${className}`} {...props}>
    {children}
  </div>
);
DialogFooter.displayName = 'DialogFooter';

export default Dialog;
