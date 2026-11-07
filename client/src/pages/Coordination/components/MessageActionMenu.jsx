import React, { useEffect, useRef } from 'react';
import { ChevronDown, Trash2 } from 'lucide-react';

export const MessageActionMenu = ({
  isSelf,
  isOpen,
  onToggle,
  onClose,
  onDelete,
  messageId,
}) => {
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('touchstart', handleClickOutside, true);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <div
      ref={menuRef}
      className={`absolute top-0 right-0 pt-1.5 pr-0 pl-0 pb-0 rounded-sm flex items-start justify-end transition-opacity duration-200 z-20 ${
        isSelf
          ? 'bg-gradient-to-l from-[#c62828] via-[#c62828]/95 to-transparent'
          : 'bg-gradient-to-l from-stone-100 via-stone-100/95 to-transparent'
      } ${
        isOpen
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto'
      }`}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        title="Message options"
        aria-label="Message options"
        className={`p-0.5 rounded cursor-pointer transition-all duration-150 ${
          isSelf
            ? 'text-white/85 hover:text-white hover:bg-black/20 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
            : 'text-stone-500 hover:text-stone-800 hover:bg-stone-200/60 drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]'
        } ${isOpen ? (isSelf ? 'bg-black/25 text-white' : 'bg-stone-200 text-stone-900') : ''}`}
      >
        <ChevronDown className="w-4 h-4" />
      </button>

      {/* Smooth WhatsApp-Style Dropdown Menu */}
      <div
        className={`absolute right-1 top-full mt-0.5 w-28 bg-white rounded-xl shadow-lg border border-stone-200/90 py-1 z-40 origin-top-right transition-all duration-200 ease-out ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'
        }`}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
            onDelete(messageId);
          }}
          className="w-full px-2.5 py-1.5 text-left text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5 text-red-500" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};

export default MessageActionMenu;
