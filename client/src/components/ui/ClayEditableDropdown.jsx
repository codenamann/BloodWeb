import React, { useState, useEffect, useRef } from 'react';
import { Edit3, Check, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ClayEditableDropdown = ({
  initialValue = '',
  onSave,
  options = [],
  placeholder = 'Select...',
  className = '',
  disabled = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [isSaving, setIsSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  // Sync with external initialValue if it changes while not editing
  useEffect(() => {
    if (!isEditing) {
      setValue(initialValue);
      setIsOpen(false);
    }
  }, [initialValue, isEditing]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEdit = () => {
    if (disabled) return;
    setIsEditing(true);
    setIsOpen(true); // Open the dropdown when entering edit mode
  };

  const handleCancel = () => {
    setIsEditing(false);
    setValue(initialValue);
    setIsOpen(false);
  };

  const handleSaveClick = async () => {
    if (value === initialValue) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      if (onSave) {
        await onSave(value);
      }
      setIsEditing(false);
    } catch (error) {
      // Keep editing if save fails so user can correct
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex-1 min-w-0" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => {
            if (!isEditing && !disabled) {
              handleEdit();
            } else if (isEditing && !isSaving) {
              setIsOpen(!isOpen);
            }
          }}
          disabled={isSaving || (disabled && !isEditing)}
          className={`w-full px-3 py-2 text-xs font-medium rounded-xl transition-all duration-300 outline-none flex items-center justify-between text-left
            ${
              isEditing
                ? 'bg-[#faf7f2] border border-stone-200 text-stone-900 shadow-inner focus:border-stone-300 cursor-pointer'
                : 'bg-[#faf7f2] border border-transparent text-stone-600 cursor-default pr-8'
            }
            ${isSaving ? 'opacity-70' : ''}
          `}
        >
          <span className={!value ? 'text-stone-400' : 'truncate'}>
            {value || placeholder}
          </span>

          {isEditing && (
            <ChevronDown
              className={`w-4 h-4 text-stone-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          )}
        </button>

        <AnimatePresence>
          {!isEditing && !disabled && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => {
                e.stopPropagation(); // Don't trigger the button's onClick
                handleEdit();
              }}
              type="button"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-[#d93829] transition-colors cursor-pointer rounded-md"
              title="Edit"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isOpen && isEditing && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 top-full mt-2 w-full clay-card p-2 overflow-hidden border border-stone-100"
            >
              <div className="max-h-30 overflow-y-auto pr-1 flex flex-col gap-1">
                {options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setValue(option);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg flex items-center justify-between transition-colors ${
                      value === option
                        ? 'text-[#d93829] bg-red-50'
                        : 'text-stone-700 hover:bg-stone-100 border-2 border-transparent hover:border-amber-50'
                    }`}
                  >
                    {option}
                    {value === option && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, width: 0, x: -10 }}
            animate={{ opacity: 1, width: 'auto', x: 0 }}
            exit={{ opacity: 0, width: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5 shrink-0"
          >
            <button
              onClick={handleSaveClick}
              disabled={isSaving}
              type="button"
              className="w-8 h-8 flex items-center justify-center clay-btn-cream text-emerald-600 disabled:opacity-50"
              title="Save"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              type="button"
              className="w-8 h-8 flex items-center justify-center clay-btn-cream text-red-500 disabled:opacity-50"
              title="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClayEditableDropdown;
