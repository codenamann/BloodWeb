import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export const NotificationsFilterTabs = ({
  filterCategory,
  setFilterCategory,
  allNotifications,
  markAllAsRead,
}) => {
  const tabs = [
    {
      id: 'ALL',
      label: 'All',
      count: allNotifications.filter((n) => !n.read).length,
    },
    {
      id: 'REQUESTS',
      label: 'Requests',
      count: allNotifications.filter(
        (n) => n.category === 'REQUESTS' && !n.read
      ).length,
    },
    {
      id: 'MESSAGES',
      label: 'Messages',
      count: allNotifications.filter(
        (n) => n.category === 'MESSAGES' && !n.read
      ).length,
    },
    {
      id: 'SYSTEM',
      label: 'System',
      count: allNotifications.filter((n) => n.category === 'SYSTEM' && !n.read)
        .length,
    },
  ];

  return (
    <div className="clay-card-flat p-3 bg-white/95 flex flex-wrap items-center justify-between gap-3 shadow-xs">
      <div className="flex items-center gap-1.5 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = filterCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFilterCategory(tab.id)}
              className={`relative px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 hover:opacity-90 ${
                isActive ? 'text-white' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="notifications-filter-tab"
                  className="absolute inset-0 clay-btn-crimson text-white shadow-xs transition-none!"
                  style={{ borderRadius: 12 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
              {tab.count > 0 && (
                <span
                  className={`relative z-10 px-1.5 py-0.2 rounded-full text-[9px] font-black ${
                    isActive
                      ? 'bg-white text-[#d93829]'
                      : 'bg-red-100 text-[#d93829]'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <button
        onClick={markAllAsRead}
        className="text-xs font-bold text-stone-700 hover:text-[#d93829] flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>Mark all as read</span>
      </button>
    </div>
  );
};

export default NotificationsFilterTabs;
