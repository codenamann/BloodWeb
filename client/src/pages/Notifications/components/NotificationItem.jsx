import React from 'react';
import { ChevronRight } from 'lucide-react';

export const NotificationItem = ({ notification, onClick }) => {
  const Icon = notification.icon;

  return (
    <div
      onClick={() => onClick(notification)}
      className={`clay-card p-4 sm:p-5 bg-white/95 flex items-start justify-between gap-4 hover:shadow-md cursor-pointer transition-all ${
        !notification.read ? 'bg-red-50/40' : ''
      }`}
    >
      <div className="flex items-start gap-3.5 flex-1 min-w-0">
        {/* Icon Box */}
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${notification.iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>

        {/* Text Body */}
        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {!notification.read && (
              <span className="w-2 h-2 rounded-full bg-[#d93829] shrink-0" />
            )}
            <h4 className="text-xs sm:text-sm font-black text-stone-900 leading-tight">
              {notification.title}
            </h4>
          </div>
          <p className="text-xs text-stone-600 font-medium leading-relaxed">
            {notification.body}
          </p>
        </div>
      </div>

      {/* Timestamp & Chevron */}
      <div className="flex items-center gap-3 shrink-0 text-right">
        <span className="text-[11px] font-bold text-stone-400 hidden sm:inline">
          {notification.timeStr}
        </span>
        <div className="p-1.5 rounded-xl bg-stone-50 text-stone-400">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
