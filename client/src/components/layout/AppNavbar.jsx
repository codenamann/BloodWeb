import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Droplets,
  Users,
  Bell,
  User,
  Plus,
  LogOut,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
  Activity,
  Heart,
  Radio,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import ClayLogo from '../ClayAssets/ClayLogo';
import ClayAvatar from '../ClayAssets/ClayAvatar';

export const AppNavbar = () => {
  const {
    currentUser,
    logout,
    toggleAvailability,
    switchPersona,
    allPersonas,
  } = useAuth();
  const { getUnreadCount, getNotificationsForUser, markAsRead, markAllAsRead } =
    useNotifications();
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const unreadCount = getUnreadCount(currentUser?._id);
  const userNotifications = getNotificationsForUser(currentUser?._id);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Blood Requests', path: '/requests', icon: Droplets },
    { name: 'Find Donors', path: '/donors', icon: Users },
    {
      name: 'Notifications',
      path: '/notifications',
      icon: Bell,
      badge: unreadCount,
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#f6f1eb]/95 backdrop-blur-md border-b border-stone-200/70 transition-all">
        <div className="mx-auto max-w-7xl">
          <div className="flex h-16 sm:h-18 items-center justify-between">
            {/* Left: Brand Logo + Live Status */}
            <div className="flex items-center gap-3 sm:gap-6">
              <ClayLogo size="md" to="/dashboard" />

              <div className="hidden md:inline-flex items-center gap-2 px-3 py-1 rounded-full clay-inset-pill text-xs font-bold text-[#575965]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Live Network Active</span>
              </div>
            </div>

            {/* Center: Main Navigation Tabs (Desktop) */}
            <nav className="hidden lg:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                        isActive
                          ? 'clay-btn-crimson text-white shadow-sm scale-102'
                          : 'text-[#575965] hover:text-[#1c1d22] hover:bg-white/60'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                    {item.badge > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-white text-[#d93829] text-[10px] font-black">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            {/* Right Action Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Create Request Quick Button */}
              <button
                onClick={() => navigate('/requests/create')}
                className="clay-btn-crimson px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Create Request</span>
              </button>

              {/* Notifications Popover Trigger */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsNotifOpen(!isNotifOpen);
                    setIsProfileOpen(false);
                  }}
                  className="p-2 sm:p-2.5 rounded-2xl clay-btn-cream text-slate-700 relative cursor-pointer"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#d93829] text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown (Mobile-Safe) */}
                {isNotifOpen && (
                  <div className="fixed sm:absolute top-16 sm:top-full right-3 sm:right-0 mt-2 w-[calc(100vw-1.5rem)] max-w-sm sm:w-96 rounded-3xl clay-card bg-white p-4 shadow-2xl z-50">
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
                            className="text-[11px] font-bold text-[#d93829] hover:underline"
                          >
                            Mark all read
                          </button>
                        )}
                        <button
                          onClick={() => setIsNotifOpen(false)}
                          className="sm:hidden p-1 text-slate-400 hover:text-slate-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="py-2 max-h-72 overflow-y-auto space-y-2 divide-y divide-stone-50">
                      {userNotifications.length === 0 ? (
                        <div className="text-center py-6 text-xs text-slate-400 font-medium">
                          No notifications yet.
                        </div>
                      ) : (
                        userNotifications.slice(0, 5).map((notif) => (
                          <div
                            key={notif._id}
                            onClick={() => {
                              markAsRead(notif._id);
                              setIsNotifOpen(false);
                              navigate(notif.redirectUrl);
                            }}
                            className={`p-3 rounded-2xl transition-all cursor-pointer ${
                              notif.read
                                ? 'bg-transparent hover:bg-stone-50'
                                : 'bg-red-50/50 hover:bg-red-50'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h5 className="font-bold text-xs text-[#1c1d22]">
                                {notif.title}
                              </h5>
                              {!notif.read && (
                                <span className="w-2 h-2 rounded-full bg-[#d93829] shrink-0 mt-1" />
                              )}
                            </div>
                            <p className="text-[11px] text-[#575965] mt-1 leading-snug">
                              {notif.body}
                            </p>
                            <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                              <span>
                                {new Date(notif.createdAt).toLocaleTimeString(
                                  [],
                                  { hour: '2-digit', minute: '2-digit' }
                                )}
                              </span>
                              <span className="font-bold text-[#d93829] flex items-center gap-0.5">
                                Open <ExternalLink className="w-2.5 h-2.5" />
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="pt-2 border-t border-stone-100 text-center">
                      <Link
                        to="/notifications"
                        onClick={() => setIsNotifOpen(false)}
                        className="text-xs font-bold text-[#d93829] hover:underline block py-1"
                      >
                        View All in Inbox →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Avatar & Menu Trigger */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsProfileOpen(!isProfileOpen);
                    setIsNotifOpen(false);
                  }}
                  className="flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 rounded-2xl clay-card-flat bg-white hover:bg-stone-50 transition-all cursor-pointer"
                >
                  <ClayAvatar
                    type={currentUser?.avatarType || 'sarah'}
                    size={32}
                    showBadge={false}
                  />
                  <div className="hidden sm:block text-left pr-1">
                    <div className="text-xs font-black text-[#1c1d22] leading-tight truncate max-w-[100px]">
                      {currentUser?.name || 'Account'}
                    </div>
                    <div className="text-[10px] text-[#d93829] font-extrabold flex items-center gap-1">
                      <span>{currentUser?.bloodGroup || 'O+'}</span>
                      <span>•</span>
                      <span
                        className={
                          currentUser?.availability
                            ? 'text-emerald-600'
                            : 'text-slate-400'
                        }
                      >
                        {currentUser?.availability ? 'Available' : 'Paused'}
                      </span>
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Profile Dropdown (Mobile-Safe) */}
                {isProfileOpen && (
                  <div className="fixed sm:absolute top-16 sm:top-full right-3 sm:right-0 mt-2 w-[calc(100vw-1.5rem)] max-w-sm sm:w-72 rounded-3xl clay-card bg-white p-4 shadow-2xl z-50 space-y-3">
                    {/* User Profile Card */}
                    <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                      <div className="flex items-center gap-3">
                        <ClayAvatar
                          type={currentUser?.avatarType || 'sarah'}
                          size={44}
                          showBadge={true}
                          badgeColor="crimson"
                        />
                        <div className="overflow-hidden">
                          <h4 className="font-extrabold text-sm text-[#1c1d22] truncate">
                            {currentUser?.name}
                          </h4>
                          <p className="text-xs text-[#575965] truncate">
                            {currentUser?.email}
                          </p>
                          <span className="inline-block mt-0.5 px-2 py-0.2 rounded-md bg-stone-100 text-[#575965] text-[9px] font-bold">
                            {currentUser?.roleTag}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsProfileOpen(false)}
                        className="sm:hidden p-1 text-slate-400 hover:text-slate-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Donor Availability Toggle */}
                    <div className="p-3 rounded-2xl bg-[#faf7f2] border border-stone-200/70 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-black text-[#1c1d22]">
                          Donor Status
                        </div>
                        <div className="text-[10px] text-[#747682] font-semibold">
                          {currentUser?.availability
                            ? 'Ready for SOS alerts'
                            : 'Currently paused'}
                        </div>
                      </div>

                      <button
                        onClick={() => toggleAvailability()}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          currentUser?.availability
                            ? 'clay-btn-crimson bg-emerald-600 text-white shadow-sm'
                            : 'clay-btn-cream text-slate-600'
                        }`}
                      >
                        {currentUser?.availability ? 'Available' : 'Paused'}
                      </button>
                    </div>

                    {/* Quick Persona Switcher Helper */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#747682] mb-1.5">
                        Switch Role (Demo Simulator)
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {allPersonas.map((p) => (
                          <button
                            key={p._id}
                            onClick={() => {
                              switchPersona(p._id);
                              setIsProfileOpen(false);
                            }}
                            className={`p-2 rounded-xl text-left text-[11px] font-bold transition-all cursor-pointer ${
                              currentUser?._id === p._id
                                ? 'bg-red-100 text-[#d93829] font-black border border-red-200'
                                : 'bg-stone-50 text-slate-600 hover:bg-stone-100'
                            }`}
                          >
                            <div className="truncate">
                              {p.name.split(' ')[0]}
                            </div>
                            <div className="text-[9px] opacity-75 font-mono">
                              {p.bloodGroup} •{' '}
                              {p._id === 'user-sarah' ? 'Requester' : 'Donor'}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Links */}
                    <div className="pt-2 border-t border-stone-100 space-y-1">
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-stone-50 transition-colors"
                      >
                        <User className="w-4 h-4 text-slate-400" /> My Profile &
                        Blood Data
                      </Link>

                      <button
                        onClick={() => {
                          logout();
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left"
                      >
                        <LogOut className="w-4 h-4 text-red-500" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-stone-200/80 bg-[#faf7f2]/95 backdrop-blur-md px-2 py-1.5 flex items-center justify-around shadow-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `p-2 rounded-xl flex flex-col items-center gap-0.5 text-[10px] font-extrabold transition-all relative ${
                  isActive ? 'text-[#d93829]' : 'text-slate-500'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span className="truncate max-w-[64px]">
                {item.name.split(' ')[0]}
              </span>
              {item.badge > 0 && (
                <span className="absolute top-1 right-2 w-3.5 h-3.5 rounded-full bg-[#d93829] text-white text-[8px] font-black flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>
    </>
  );
};

export default AppNavbar;
