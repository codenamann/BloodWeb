import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, MessageSquare, ChevronRight, MoreVertical, Trash2 } from 'lucide-react';

export const RequestCardActions = ({
  request,
  isRequester = false,
  hasVolunteered = false,
  isTerminal = false,
  isCompatible = true,
  onVolunteer,
  onCancel,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
      {/* Volunteer Button for non-creators who haven't volunteered yet and whose blood matches */}
      {!isRequester && !hasVolunteered && !isTerminal && isCompatible && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onVolunteer?.(e, request);
          }}
          className="clay-btn-crimson h-10 px-4 rounded-xl text-xs font-black text-white shadow-sm flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.03] active:scale-95 cursor-pointer"
        >
          <Heart className="w-3.5 h-3.5 fill-white" />
          <span>Volunteer</span>
        </button>
      )}

      {/* Coordination Room Button (Available to requester and volunteers) */}
      {(isRequester || hasVolunteered) && (
        <Link
          to={`/coordination/${request._id}`}
          onClick={(e) => e.stopPropagation()}
          className="clay-btn-crimson h-10 px-3.5 rounded-xl text-xs font-black text-white shadow-sm flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.02] active:scale-95 shrink-0"
          title="Open Coordination Room"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Coordination Room</span>
        </Link>
      )}

      {/* Details Button */}
      <Link
        to={`/requests/${request._id}`}
        onClick={(e) => e.stopPropagation()}
        className="clay-btn-cream text-stone-700 hover:text-stone-900 h-10 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-transform hover:scale-[1.02] active:scale-95 shrink-0"
      >
        <span>Details</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </Link>

      {/* 3-Dots Safe Overflow Menu for Creator */}
      {isRequester && !isTerminal && (
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="w-10 h-10 rounded-xl clay-btn-cream text-stone-500 hover:text-stone-900 shadow-2xs flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
            title="More options"
            aria-label="More options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                  }}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.12 }}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 bottom-full mb-2 w-48 rounded-2xl bg-white border border-stone-200/80 shadow-xl p-1.5 z-50 origin-bottom-right clay-card"
                >
                  <button
                    onClick={(e) => {
                      setMenuOpen(false);
                      onCancel?.(e, request);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50/80 rounded-xl transition-colors cursor-pointer text-left"
                  >
                    <Trash2 className="w-4 h-4 text-red-500 shrink-0" />
                    <span>Cancel Request</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default RequestCardActions;
