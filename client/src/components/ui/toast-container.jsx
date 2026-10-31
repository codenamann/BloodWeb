import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { toast } from './toast.js';

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = toast.subscribe((newToast) => {
      setToasts((prev) => [...prev, newToast]);

      if (newToast.duration !== Infinity) {
        setTimeout(() => {
          removeToast(newToast.id);
        }, newToast.duration);
      }
    });
    return unsubscribe;
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return createPortal(
    <div className="fixed bottom-4 sm:bottom-auto sm:top-4 left-0 right-0 sm:left-auto sm:right-4 z-[9999] flex flex-col gap-2 pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-[20px] shadow-xl max-w-[calc(100vw-32px)] sm:w-auto sm:min-w-[300px] sm:max-w-[360px] mx-auto sm:mx-0 bg-white/95 backdrop-blur-md border border-stone-200/50"
          >
            <div className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-xl ${
              t.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
              t.type === 'error' ? 'bg-red-100 text-red-600' :
              'bg-blue-100 text-blue-600'
            }`}>
              {t.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
              {t.type === 'error' && <AlertCircle className="w-4 h-4" />}
              {t.type === 'info' && <Info className="w-4 h-4" />}
            </div>
            
            <div className="flex-1 pt-0.5">
              <p className="text-sm font-black text-stone-800 leading-tight">
                {t.title}
              </p>
              {t.subtitle && (
                <p className="text-xs font-semibold text-stone-500 mt-0.5 leading-snug">
                  {t.subtitle}
                </p>
              )}
            </div>

            <button 
              onClick={() => removeToast(t.id)}
              className="shrink-0 p-1.5 -mr-1 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
};
