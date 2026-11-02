import React from 'react';
import { motion } from 'framer-motion';

export const RequestDetailTabBar = ({
  activeTab,
  setActiveTab,
  responseCount,
  onOpenCoordination,
}) => {
  const tabs = [
    { id: 'OVERVIEW', label: 'Overview' },
    { id: 'VOLUNTEERS', label: `Volunteers (${responseCount})` },
    { id: 'COORDINATION', label: 'Coordination Room' },
  ];

  return (
    <div className="flex items-center gap-2 border-b border-stone-100 pb-2 overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.id === 'COORDINATION') {
                onOpenCoordination();
              } else {
                setActiveTab(tab.id);
              }
            }}
            className={`relative px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap hover:opacity-90 ${
              isActive
                ? 'text-white'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="request-detail-tab"
                className="absolute inset-0 clay-btn-crimson text-white shadow-xs transition-none!"
                style={{ borderRadius: 12 }}
                transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default RequestDetailTabBar;
