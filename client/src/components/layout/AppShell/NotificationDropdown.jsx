import React from 'react';
import { Bell, X, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../../../context/NotificationContext';

const NotificationDropdown = ({ currentUser, isOpen, onToggle }) => {
  const navigate = useNavigate();
  const { getUnreadCount, getNotificationsForUser, markAsRead, markAllAsRead } =
    useNotifications();

  const unreadCount = getUnreadCount(currentUser?._id);
  const userNotifications = getNotificationsForUser(currentUser?._id);

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="p-2 sm:p-3 clay-card-flat text-stone-700 hover:text-stone-900 relative shadow-sm cursor-pointer transition-all hover:shadow-md"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#d93829] text-white text-[9px] font-black flex items-center justify-center shadow-sm">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="fixed sm:absolute top-16 sm:top-full right-3 sm:right-0 mt-2 w-[calc(100vw-1.5rem)] max-w-sm sm:w-96 rounded-3xl clay-card bg-white p-4 shadow-2xl z-50 origin-top-right"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#d93829]" />
                <span className="font-extrabold text-sm text-[#1c1d22]">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-red-100 text-[#d93829] text-[10px] font-bold">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] font-bold text-[#d93829] hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => onToggle(false)}
                  className="p-1 rounded-lg hover:bg-stone-100 text-stone-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto py-2 space-y-2 divide-y divide-stone-100">
              {userNotifications.length === 0 ? (
                <div className="py-8 text-center text-xs text-stone-400 font-medium">
                  No notifications at the moment
                </div>
              ) : (
                userNotifications.slice(0, 5).map((n) => (
                  <div
                    key={n._id}
                    onClick={() => {
                      markAsRead(n._id);
                      onToggle(false);
                      if (n.redirectUrl) navigate(n.redirectUrl);
                    }}
                    className={`pt-2.5 pb-1 px-2 rounded-xl text-left cursor-pointer transition-colors ${
                      !n.read
                        ? 'bg-red-50/70 hover:bg-red-50'
                        : 'hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-black text-stone-900 leading-tight">
                        {n.title}
                      </span>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-[#d93829] shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-[11px] text-stone-600 font-medium mt-0.5 line-clamp-2">
                      {n.body}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-stone-100 text-center">
              <Link
                to="/notifications"
                onClick={() => onToggle(false)}
                className="text-xs font-black text-[#d93829] hover:underline inline-flex items-center gap-1"
              >
                View All Notifications <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;
