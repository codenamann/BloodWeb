import React from 'react';
import { Bell } from 'lucide-react';
import NotificationItem from './NotificationItem';

export const NotificationsList = ({ filtered, onNotificationClick }) => {
  if (filtered.length === 0) {
    return (
      <div className="clay-card p-10 bg-white/95 text-center text-stone-500 space-y-2 shadow-xs">
        <Bell className="w-8 h-8 text-stone-300 mx-auto" />
        <h4 className="text-sm font-bold text-stone-700">No notifications yet</h4>
        <p className="text-xs text-stone-400">
          You're all caught up on your requests and coordination rooms.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {['Today', 'Yesterday', 'Earlier'].map((group) => {
        const groupItems = filtered.filter((n) => n.timeGroup === group);
        if (groupItems.length === 0) return null;

        return (
          <div key={group} className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-black text-stone-500 uppercase tracking-wider pl-1">
              <span className="w-2 h-2 rounded-full bg-[#d93829]" />
              <span>{group}</span>
            </div>

            <div className="space-y-2.5">
              {groupItems.map((n) => (
                <NotificationItem
                  key={n._id}
                  notification={n}
                  onClick={onNotificationClick}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationsList;
