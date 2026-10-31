import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ClayDropdown = ({ options, value, onChange, placeholder = "Select...", disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full sm:w-48" ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2 text-xs font-black rounded-xl border flex items-center justify-between transition-all outline-none ${
          disabled 
            ? 'clay-input text-stone-600'
            : isOpen
              ? 'bg-white border-[#d1c8bd] text-stone-900 shadow-[inset_1px_1px_3px_rgba(180,160,145,0.15),0_2px_5px_rgba(217,56,41,0.08)]'
              : 'clay-btn-cream'
        }`}
      >
        <span className={!value ? "text-stone-400" : ""}>{value || placeholder}</span>
        {!disabled && (
          <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 top-full mt-2 w-full clay-card p-2 max-h-48 overflow-y-auto no-scrollbar border border-stone-100"
          >
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg flex items-center justify-between transition-colors ${
                  value === option 
                    ? 'text-[#d93829] bg-red-50'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                {option}
                {value === option && <Check className="w-3.5 h-3.5" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClayDropdown;
