import React, { useState } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Search,
  Bell,
  User,
  Map,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { ClayFloatingSpheres } from '../ClayAssets/ClayIllustrations';

import Topbar from './AppShell/Topbar';
import Sidebar from './AppShell/Sidebar';
import MobileDrawer from './AppShell/MobileDrawer';
import BottomNav from './AppShell/BottomNav';

export const AppShell = ({
  searchPlaceholder = 'Search hospitals, requests, or locations...',
  onSearch = null,
}) => {
  const { currentUser } = useAuth();
  const { getUnreadCount } = useNotifications();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');

  const unreadCount = getUnreadCount(currentUser?._id);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Requests', path: '/requests', icon: FileText },
    { name: 'Create Request', path: '/requests/create', icon: PlusCircle },
    { name: 'Discover Requests', path: '/donors', icon: Search },
    {
      name: 'Notifications',
      path: '/notifications',
      icon: Bell,
      badge: unreadCount,
    },
    { name: 'My Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#f6f1eb] text-[#1c1d22] font-sans antialiased flex flex-col relative overflow-x-hidden selection:bg-[#d93829] selection:text-white">
      {/* Background Floating Clay Spheres */}
      <ClayFloatingSpheres />

      {/* 1. TOPBAR (HEADER) */}
      <Topbar
        searchPlaceholder={searchPlaceholder}
        onSearch={onSearch}
        headerSearch={headerSearch}
        setHeaderSearch={setHeaderSearch}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* 2. BODY LAYOUT (LEFT SIDEBAR + MAIN CONTENT) */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 flex gap-8">
        {/* DESKTOP SIDEBAR NAVIGATION */}
        <Sidebar navItems={navItems} />

        {/* MAIN VIEW CONTENT CONTAINER */}
        <main className="flex-1 min-w-0 pb-20 lg:pb-8">
          <Outlet />
        </main>
      </div>

      {/* 3. MOBILE SLIDE-OVER DRAWER */}
      <MobileDrawer
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        navItems={navItems}
        location={location}
        currentUser={currentUser}
      />

      {/* 4. MOBILE / TABLET BOTTOM NAVIGATION BAR */}
      <BottomNav location={location} />
    </div>
  );
};

export default AppShell;
