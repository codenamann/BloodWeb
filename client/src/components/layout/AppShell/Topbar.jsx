import React, { useState, useEffect, useRef } from 'react';
import { Menu } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import ClayLogo from '../../ClayAssets/ClayLogo';
import LocationSelector from './LocationSelector';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';

const Topbar = ({
  searchPlaceholder,
  onSearch,
  headerSearch,
  setHeaderSearch,
  setMobileMenuOpen,
}) => {
  const { currentUser } = useAuth();

  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    if (activeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown((prev) => (prev === dropdownName ? null : dropdownName));
  };

  return (
    <header className="select-none sticky top-0 z-40 w-full bg-[#f6f1eb]/95 backdrop-blur-md border-b border-stone-200/70 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-3 sm:gap-6">
          {/* Left: Mobile Drawer Trigger + Brand Logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-2xl clay-btn-cream text-stone-700 cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <ClayLogo size="sm" to="/dashboard" />
          </div>

          {/* Desktop Brand Logo in Topbar (Subtle) */}
          <div className="hidden lg:flex items-center gap-4">
            <ClayLogo size="md" to="/dashboard" />
          </div>

          {/* Right: Location Selector, Notification Bell, User Avatar Pill */}
          <div
            ref={dropdownRef}
            className="flex items-center gap-2 sm:gap-3 shrink-0"
          >
            <LocationSelector
              currentUser={currentUser}
              isOpen={activeDropdown === 'location'}
              onToggle={(state) => {
                if (state === false) setActiveDropdown(null);
                else toggleDropdown('location');
              }}
            />

            <NotificationDropdown
              currentUser={currentUser}
              isOpen={activeDropdown === 'notifications'}
              onToggle={(state) => {
                if (state === false) setActiveDropdown(null);
                else toggleDropdown('notifications');
              }}
            />

            <ProfileDropdown
              currentUser={currentUser}
              isOpen={activeDropdown === 'profile'}
              onToggle={(state) => {
                if (state === false) setActiveDropdown(null);
                else toggleDropdown('profile');
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
