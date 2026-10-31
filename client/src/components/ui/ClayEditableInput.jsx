import React, { useState, useEffect, useRef } from 'react';
import { Edit3, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ClayEditableInput = ({
  initialValue = '',
  onSave,
  type = 'text',
  placeholder = '',
  maxLength,
  className = '',
  disabled = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef(null);

  // Sync with external initialValue if it changes while not editing
  useEffect(() => {
    if (!isEditing) {
      setValue(initialValue);
    }
  }, [initialValue, isEditing]);

  const handleEdit = () => {
    if (disabled) return;
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setValue(initialValue);
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveClick();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex-1 min-w-0">
        <input
          ref={inputRef}
          type={type}
          maxLength={maxLength}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!isEditing || isSaving}
          placeholder={placeholder}
          className={`w-full px-3 py-2 text-xs font-medium rounded-xl transition-all duration-300 outline-none
            ${
              isEditing
                ? 'bg-[#faf7f2] border border-stone-200 text-stone-900 shadow-inner focus:border-stone-300'
                : 'bg-[#faf7f2] border border-transparent text-stone-600 cursor-default pr-8'
            }
            ${isSaving ? 'opacity-70' : ''}
          `}
        />

        <AnimatePresence>
          {!isEditing && !disabled && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              onClick={handleEdit}
              type="button"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-[#d93829] transition-colors cursor-pointer rounded-md"
              title="Edit"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </motion.button>
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

export default ClayEditableInput;
