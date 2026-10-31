import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Filter,
  Radio,
  MessageSquare,
  AlertCircle,
  UserCheck,
  Building,
  Heart,
  ShieldCheck,
  Sparkles,
  Mail,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

import {
  ClayMailEnvelope,
  ClayCharacterBoy,
  ClayDropCharacter,
} from '../../components/ClayAssets/ClayIllustrations';

export const NotificationsPage = () => {
  const { currentUser } = useAuth();
  const { getNotificationsForUser, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const [filterCategory, setFilterCategory] = useState('ALL'); // 'ALL' | 'REQUESTS' | 'MESSAGES' | 'SYSTEM'

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

  const unreadCount = filtered.filter((n) => !n.read).length;

  const handleNotificationClick = (n) => {
    markAsRead(n._id);
    if (n.redirectUrl) navigate(n.redirectUrl);
  };

  return (
    <div className="space-y-6">
        
        {/* ========================================================================= */}
        {/* 1. TOP HEADER & INSPIRATIONAL BANNER */}
        {/* ========================================================================= */}
        <div className="clay-card p-6 sm:p-8 bg-gradient-to-r from-red-50/80 via-white to-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm border border-red-100/50">
          <div className="space-y-2 text-center md:text-left z-10 max-w-lg">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-black text-stone-500 hover:text-stone-900 transition-colors mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="text-2xl sm:text-4xl font-black text-[#1c1d22] tracking-tight">
              Notifications
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 font-medium">
              Stay updated with everything that matters in your blood coordination network.
            </p>
          </div>

          {/* 3D Envelope with Heart */}
          <div className="shrink-0 flex items-center justify-center">
            <ClayMailEnvelope size={150} />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. MAIN NOTIFICATIONS INBOX GRID */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left 3-Cols: Notification Stream */}
          <div className="lg:col-span-3 space-y-5">
            
            {/* Filter Tabs & Mark Read Bar */}
            <div className="clay-card-flat p-3 bg-white/95 flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {[
                  { id: 'ALL', label: 'All', count: allNotifications.filter(n => !n.read).length },
                  { id: 'REQUESTS', label: 'Requests', count: allNotifications.filter(n => n.category === 'REQUESTS' && !n.read).length },
                  { id: 'MESSAGES', label: 'Messages', count: allNotifications.filter(n => n.category === 'MESSAGES' && !n.read).length },
                  { id: 'SYSTEM', label: 'System', count: allNotifications.filter(n => n.category === 'SYSTEM' && !n.read).length },
                ].map((tab) => {
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
                        <span className={`relative z-10 px-1.5 py-0.2 rounded-full text-[9px] font-black ${
                          isActive ? 'bg-white text-[#d93829]' : 'bg-red-100 text-[#d93829]'
                        }`}>
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

            {/* Notifications Groups */}
            {filtered.length === 0 ? (
              <div className="clay-card p-10 bg-white/95 text-center text-stone-500 space-y-2 shadow-xs">
                <Bell className="w-8 h-8 text-stone-300 mx-auto" />
                <h4 className="text-sm font-bold text-stone-700">No notifications yet</h4>
                <p className="text-xs text-stone-400">You're all caught up on your requests and coordination rooms.</p>
              </div>
            ) : (
              ['Today', 'Yesterday', 'Earlier'].map((group) => {
                const groupItems = filtered.filter((n) => n.timeGroup === group);
                if (groupItems.length === 0) return null;

                return (
                  <div key={group} className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-black text-stone-500 uppercase tracking-wider pl-1">
                      <span className="w-2 h-2 rounded-full bg-[#d93829]" />
                      <span>{group}</span>
                    </div>

                    <div className="space-y-2.5">
                      {groupItems.map((n) => {
                        const Icon = n.icon;

                        return (
                        <div
                          key={n._id}
                          onClick={() => handleNotificationClick(n)}
                          className={`clay-card p-4 sm:p-5 bg-white/95 flex items-start justify-between gap-4 hover:shadow-md cursor-pointer transition-all ${
                            !n.read ? 'bg-red-50/40' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3.5 flex-1 min-w-0">
                            
                            {/* Icon Box */}
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${n.iconColor}`}>
                              <Icon className="w-5 h-5" />
                            </div>

                            {/* Text Body */}
                            <div className="space-y-1 flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                {!n.read && (
                                  <span className="w-2 h-2 rounded-full bg-[#d93829] shrink-0" />
                                )}
                                <h4 className="text-xs sm:text-sm font-black text-stone-900 leading-tight">
                                  {n.title}
                                </h4>
                              </div>
                              <p className="text-xs text-stone-600 font-medium leading-relaxed">
                                {n.body}
                              </p>
                            </div>
                          </div>

                          {/* Timestamp & Chevron */}
                          <div className="flex items-center gap-3 shrink-0 text-right">
                            <span className="text-[11px] font-bold text-stone-400 hidden sm:inline">
                              {n.timeStr}
                            </span>
                            <div className="p-1.5 rounded-xl bg-stone-50 text-stone-400">
                              <ChevronRight className="w-4 h-4" />
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}

          </div>

          {/* Right 1-Col: Sidebar & Channels Settings */}
          <div className="space-y-5">
            
            {/* Filter Notifications Card */}
            <div className="clay-card p-5 bg-white/95 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-black text-stone-900 uppercase tracking-wider">
                <Filter className="w-4 h-4 text-[#d93829]" />
                <span>Filter Notifications</span>
              </div>

              <div className="space-y-1">
                {[
                  { id: 'ALL', label: 'All Notifications', count: allNotifications.length },
                  { id: 'REQUESTS', label: 'Blood Requests', count: allNotifications.filter(n => n.category === 'REQUESTS').length },
                  { id: 'MESSAGES', label: 'Live Messages', count: allNotifications.filter(n => n.category === 'MESSAGES').length },
                  { id: 'SYSTEM', label: 'System & Security', count: allNotifications.filter(n => n.category === 'SYSTEM').length },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setFilterCategory(item.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                      filterCategory === item.id ? 'bg-red-50 text-[#d93829] font-black' : 'text-stone-700 hover:bg-stone-50'
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
                Emergency blood requests and room updates are delivered directly to your verified email address: <strong>{currentUser?.email}</strong>.
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
              <p className="text-[11px] text-stone-500 font-medium">Small updates bring us closer to a stronger community.</p>
            </div>

          </div>

        </div>

      </div>
  );
};

export default NotificationsPage;
