import React, { useState, useEffect } from 'react';
import { Timer, X, Check } from 'lucide-react';
import WatchDialPicker from './WatchDialPicker';

const OPTIONS = ['Off', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const CooldownModal = ({
  isOpen,
  onClose,
  cooldownEnabled = false,
  currentSeconds = 3,
  onSave,
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [showContent, setShowContent] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const initialIdx = cooldownEnabled
        ? Math.min(10, Math.max(1, Number(currentSeconds) || 3))
        : 0;
      setSelectedIndex(initialIdx);
      const timer = setTimeout(() => setShowContent(true), 20);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
      const timer = setTimeout(() => setShouldRender(false), 250);
      return () => clearTimeout(timer);
    }
  }, [isOpen, cooldownEnabled, currentSeconds]);

  if (!shouldRender) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const isOff = selectedIndex === 0;
      const secondsVal = isOff ? Number(currentSeconds) || 3 : OPTIONS[selectedIndex];
      const success = await onSave({ enabled: !isOff, seconds: secondsVal });
      if (success !== false) onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const isOffSelected = selectedIndex === 0;
  const currentVal = OPTIONS[selectedIndex];

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-out ${
        showContent ? 'bg-black/45 backdrop-blur-xs opacity-100' : 'bg-black/0 opacity-0 pointer-events-none'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-stone-200/80 p-5 space-y-4 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          showContent ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-50 text-[#d93829] border border-red-100 shadow-2xs">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-stone-900 tracking-tight">Message Cooldown</h3>
              <p className="text-[11px] text-stone-400 font-medium">Scroll dial to configure delay</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Watch Dial Picker */}
        <WatchDialPicker
          options={OPTIONS}
          selectedIndex={selectedIndex}
          onChange={setSelectedIndex}
        />

        {/* Live Status Feedback */}
        <div className={`p-2.5 rounded-xl border text-center transition-colors duration-200 ${
          isOffSelected
            ? 'bg-stone-50 border-stone-200 text-stone-600'
            : 'bg-red-50/70 border-red-100 text-[#d93829]'
        }`}>
          <div className="text-xs font-bold">
            {isOffSelected ? 'Cooldown Disabled' : `Active Cooldown: ${currentVal}s`}
          </div>
          <div className="text-[10px] opacity-75 font-medium mt-0.5">
            {isOffSelected
              ? 'Volunteers can send messages freely without waiting'
              : `Participants must wait ${currentVal} seconds between messages`}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-1 border-t border-stone-100">
          <button
            type="button"
            disabled={isSaving}
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="clay-btn-crimson px-4 py-2 rounded-xl text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            {isSaving ? 'Saving...' : (
              <>
                <Check className="w-3.5 h-3.5" />
                Apply Setting
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CooldownModal;
