import React from 'react';
import { Filter, Mail, CheckCircle2 } from 'lucide-react';
import { ClayDropCharacter } from '../../../components/ClayAssets/ClayIllustrations';

export const NotificationsSidebar = ({
  filterCategory,
  setFilterCategory,
  allNotifications,
  currentUser,
}) => {
  const filterItems = [
    { id: 'ALL', label: 'All Notifications', count: allNotifications.length },
    { id: 'REQUESTS', label: 'Blood Requests', count: allNotifications.filter((n) => n.category === 'REQUESTS').length },
    { id: 'MESSAGES', label: 'Live Messages', count: allNotifications.filter((n) => n.category === 'MESSAGES').length },
    { id: 'SYSTEM', label: 'System & Security', count: allNotifications.filter((n) => n.category === 'SYSTEM').length },
  ];

  return (
    <div className="space-y-5">
      {/* Filter Notifications Card */}
      <div className="clay-card p-5 bg-white/95 space-y-3 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-black text-stone-900 uppercase tracking-wider">
          <Filter className="w-4 h-4 text-[#d93829]" />
          <span>Filter Notifications</span>
        </div>

        <div className="space-y-1">
          {filterItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterCategory(item.id)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                filterCategory === item.id
                  ? 'bg-red-50 text-[#d93829] font-black'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <span>{item.label}</span>
              <span className="text-[10px] font-bold opacity-75">{item.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stay in the Loop Card */}
      <div className="clay-card p-5 bg-white/95 space-y-3 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-black text-stone-900 uppercase tracking-wider">
          <Mail className="w-4 h-4 text-[#d93829]" />
          <span>Delivery Channels</span>
        </div>
        <p className="text-xs text-stone-500 font-medium">
          Emergency blood requests and room updates are delivered directly to your verified email address:{' '}
          <strong>{currentUser?.email}</strong>.
        </p>
        <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Email Notifications Active</span>
        </div>
      </div>

      {/* Clay Illustration Card */}
      <div className="clay-card p-5 bg-white/95 text-center space-y-2 shadow-xs">
        <div className="flex justify-center">
          <ClayDropCharacter size={110} />
        </div>
        <h4 className="text-xs font-black text-stone-900">People Like You Make Change</h4>
        <p className="text-[11px] text-stone-500 font-medium">
          Small updates bring us closer to a stronger community.
        </p>
      </div>
    </div>
  );
};

export default NotificationsSidebar;
