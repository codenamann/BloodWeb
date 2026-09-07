import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle2, ArrowRight, ExternalLink, Filter, Radio, MessageSquare, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import AppNavbar from '../../components/layout/AppNavbar';
import PersonaSwitcher from '../../components/common/PersonaSwitcher';

export const NotificationsPage = () => {
  const { currentUser } = useAuth();
  const { getNotificationsForUser, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'UNREAD' | 'ACTIONABLE'

  const userNotifications = getNotificationsForUser(currentUser?._id);

  const filtered = userNotifications.filter((n) => {
    if (filterType === 'UNREAD') return !n.read;
    if (filterType === 'ACTIONABLE') return n.type === 'ACTIONABLE';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f6f1eb] text-[#1c1d22] font-sans pb-24 sm:pb-16">
      <AppNavbar />
      <PersonaSwitcher />

      <main className="mx-auto max-w-4xl px-3 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-5 sm:space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-3xl font-black text-[#1c1d22] tracking-tight">
              Notification Center
            </h1>
            <p className="text-xs sm:text-sm text-[#575965] font-medium mt-0.5">
              Live updates for emergency blood requests, donor responses, and coordination rooms
            </p>
          </div>

          <button
            onClick={markAllAsRead}
            className="clay-btn-cream px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-bold text-[#1c1d22] flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mark All as Read</span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white clay-card-flat max-w-md overflow-x-auto">
          {[
            { id: 'ALL', label: 'All' },
            { id: 'UNREAD', label: 'Unread' },
            { id: 'ACTIONABLE', label: 'Actionable SOS' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`flex-1 py-2 px-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                filterType === tab.id
                  ? 'clay-btn-crimson text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {filtered.length === 0 ? (
          <div className="clay-card p-8 sm:p-12 text-center bg-white space-y-3">
            <Bell className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-[#1c1d22]">No Notifications</h3>
            <p className="text-xs text-[#575965]">You are completely up to date with your BloodWeb activity.</p>
          </div>
        ) : (
          <div className="space-y-3.5 sm:space-y-4">
            {filtered.map((notif) => (
              <motion.div
                key={notif._id}
                whileHover={{ y: -2 }}
                className={`clay-card p-4 sm:p-5 bg-white transition-all ${
                  notif.read ? 'opacity-90' : 'border-l-4 border-l-[#d93829] shadow-md'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 sm:gap-4">
                  
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      notif.type === 'ACTIONABLE' ? 'clay-card-crimson text-white' : 'bg-red-50 text-[#d93829]'
                    }`}>
                      {notif.type === 'ACTIONABLE' ? <Radio className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" /> : <Bell className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-xs sm:text-sm text-[#1c1d22]">{notif.title}</h4>
                        {!notif.read && (
                          <span className="px-1.5 py-0.2 rounded-full bg-red-100 text-[#d93829] text-[8px] sm:text-[9px] font-black uppercase">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#575965] leading-relaxed max-w-xl font-medium">
                        {notif.body}
                      </p>
                      <span className="text-[10px] text-[#747682] font-semibold block pt-0.5">
                        {new Date(notif.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                    {notif.actions ? (
                      notif.actions.map((act, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            markAsRead(notif._id);
                            navigate(act.url);
                          }}
                          className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            idx === 0
                              ? 'clay-btn-crimson shadow-sm'
                              : 'clay-btn-cream text-[#1c1d22]'
                          }`}
                        >
                          <span>{act.label}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ))
                    ) : (
                      <button
                        onClick={() => {
                          markAsRead(notif._id);
                          navigate(notif.redirectUrl);
                        }}
                        className="w-full sm:w-auto px-3.5 py-2 clay-btn-crimson text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Open Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                </div>
              </motion.div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
};

export default NotificationsPage;
