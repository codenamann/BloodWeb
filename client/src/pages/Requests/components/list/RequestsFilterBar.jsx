import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const STATUS_CHIPS = [
  { id: 'ALL', label: 'All Statuses' },
  { id: 'ACTIVE', label: 'Active' },
  { id: 'PARTIALLY_FULFILLED', label: 'Partially Fulfilled' },
  { id: 'FULFILLED', label: 'Fulfilled' },
  { id: 'COMPLETED', label: 'Completed' },
  { id: 'CANCELLED', label: 'Cancelled' },
];

export const RequestsFilterBar = ({
  scopeTab,
  setScopeTab,
  myTotal,
  networkTotal,
  searchQuery,
  setSearchQuery,
  selectedBloodGroup,
  setSelectedBloodGroup,
  bloodGroups,
  statusTab,
  setStatusTab,
}) => {
  return (
    <div className="clay-card-flat p-4 bg-white/95 space-y-3.5 shadow-xs">
      {/* Top Row: Scope Selector + Search & Blood Group Filter */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Scope Switch (Received Requests vs My Created) */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-stone-100/90 max-w-fit flex-wrap">
          <button
            onClick={() => setScopeTab('MINE')}
            className={`relative px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer hover:opacity-90 ${
              scopeTab === 'MINE'
                ? 'text-white'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {scopeTab === 'MINE' && (
              <motion.div
                layoutId="requests-scope-tab"
                className="absolute inset-0 clay-btn-crimson text-white shadow-xs transition-none!"
                style={{ borderRadius: 12 }}
                transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <span>My Created</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  scopeTab === 'MINE'
                    ? 'bg-white/20 text-white'
                    : 'bg-stone-200 text-stone-700'
                }`}
              >
                {myTotal || 0}
              </span>
            </span>
          </button>

          <button
            onClick={() => setScopeTab('RECEIVED')}
            className={`relative px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer hover:opacity-90 ${
              scopeTab === 'RECEIVED'
                ? 'text-white'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {scopeTab === 'RECEIVED' && (
              <motion.div
                layoutId="requests-scope-tab"
                className="absolute inset-0 clay-btn-crimson text-white shadow-xs transition-none!"
                style={{ borderRadius: 12 }}
                transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <span>Received Requests</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  scopeTab === 'RECEIVED'
                    ? 'bg-white/20 text-white'
                    : 'bg-red-100 text-[#d93829]'
                }`}
              >
                {networkTotal || 0}
              </span>
            </span>
          </button>
        </div>

        {/* Search Input & Blood Group Selector */}
        <div className="flex items-center gap-2 flex-1 md:max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hospital, city, condition..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-[#faf7f2] rounded-xl border border-stone-200/80 focus:outline-none focus:ring-2 focus:ring-[#d93829]/30 font-medium"
            />
          </div>

          <select
            value={selectedBloodGroup}
            onChange={(e) => setSelectedBloodGroup(e.target.value)}
            className="px-3 py-2 text-xs font-extrabold bg-[#faf7f2] rounded-xl border border-stone-200/80 text-stone-700 cursor-pointer focus:outline-none"
          >
            {bloodGroups.map((bg) => (
              <option key={bg} value={bg}>
                {bg === 'ALL' ? 'All Blood Types' : `Type ${bg}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bottom Row: Status Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
        {STATUS_CHIPS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusTab(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
              statusTab === tab.id
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100/80 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RequestsFilterBar;
