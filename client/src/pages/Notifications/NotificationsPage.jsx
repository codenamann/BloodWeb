import React, { useState } from 'react';
import {
  Bell,
  MessageSquare,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

import {
  NotificationsHeader,
  NotificationsFilterTabs,
  NotificationsList,
  NotificationsSidebar,
} from './components';

export const NotificationsPage = () => {
  const { currentUser } = useAuth();
  const { getNotificationsForUser, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const [filterCategory, setFilterCategory] = useState('ALL');

  const userNotifications = getNotificationsForUser(currentUser?._id);

  // Map real notifications with icon, category, and display time formatting
  const allNotifications = userNotifications.map((n) => {
    let icon = Bell;
    let iconColor = 'bg-red-50 text-[#d93829]';
    let category = 'REQUESTS';

    const titleLower = (n.title || '').toLowerCase();
    if (titleLower.includes('message') || titleLower.includes('coordination')) {
      icon = MessageSquare;
      iconColor = 'bg-blue-50 text-blue-700';
      category = 'MESSAGES';
    } else if (titleLower.includes('system') || n.type === 'INFORMATIONAL') {
      icon = ShieldCheck;
      iconColor = 'bg-stone-100 text-stone-700';
      category = 'SYSTEM';
    } else {
      icon = UserCheck;
      iconColor = 'bg-red-50 text-[#d93829]';
      category = 'REQUESTS';
    }

    const createdDate = n.createdAt ? new Date(n.createdAt) : new Date();
    const now = new Date();
    const isToday = createdDate.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = createdDate.toDateString() === yesterday.toDateString();

    let timeGroup = 'Earlier';
    if (isToday) timeGroup = 'Today';
    else if (isYesterday) timeGroup = 'Yesterday';

    const timeStr = createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return {
      ...n,
      icon,
      iconColor,
      category,
      timeGroup,
      timeStr,
    };
  });

  const filtered = allNotifications.filter((n) => {
    if (filterCategory === 'REQUESTS') return n.category === 'REQUESTS';
    if (filterCategory === 'MESSAGES') return n.category === 'MESSAGES';
    if (filterCategory === 'SYSTEM') return n.category === 'SYSTEM';
    return true;
  });

  const handleNotificationClick = (n) => {
    markAsRead(n._id);
    if (n.redirectUrl) navigate(n.redirectUrl);
  };

  return (
    <div className="space-y-6">
      <NotificationsHeader />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3-Cols: Notification Stream */}
        <div className="lg:col-span-3 space-y-5">
          <NotificationsFilterTabs
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            allNotifications={allNotifications}
            markAllAsRead={markAllAsRead}
          />

          <NotificationsList
            filtered={filtered}
            onNotificationClick={handleNotificationClick}
          />
        </div>

        {/* Right 1-Col: Sidebar & Settings */}
        <NotificationsSidebar
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          allNotifications={allNotifications}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
};

export default NotificationsPage;
