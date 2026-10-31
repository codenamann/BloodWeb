import React from 'react';
import { ChevronDown, User, FileText, Search, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';

const ProfileDropdown = ({ currentUser, isOpen, onToggle }) => {
  const navigate = useNavigate();
  const { toggleAvailability, logout } = useAuth();

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 sm:gap-2.5 p-1 sm:pr-3 clay-card-flat text-stone-700 hover:shadow-md cursor-pointer transition-all"
      >
        <div className="w-9 h-9 rounded-full bg-stone-100 border border-stone-200/80 flex items-center justify-center shrink-0">
          <User className="w-4 h-4 text-stone-400" />
        </div>
        <div className="hidden sm:block text-left leading-none">
          <div className="text-xs font-black text-stone-900">
            {currentUser?.name || 'Setup Profile'}
          </div>
          <div className="flex items-center text-[10px] font-bold text-stone-400 mt-0.5">
            <span>
              {currentUser?.bloodGroup
                ? currentUser.bloodGroup
                : 'Set Blood Type'}
            </span>
            <span className="w-px h-2.5 bg-stone-300 mx-1.5 rounded-full"></span>
            <span>
              {currentUser?.availability ? 'Available' : 'Paused'}
            </span>
          </div>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-stone-400 hidden sm:block transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Profile Popover Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-72 rounded-3xl clay-card bg-white p-4 shadow-2xl z-50 origin-top-right"
          >
            {/* User Header Info */}
            <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
              <div className="relative">
                <div className="w-11 h-11 rounded-full bg-stone-100 border border-stone-200/80 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-stone-400" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#d93829] border-2 border-white"></span>
              </div>
              <div>
                <div className="text-sm font-black text-stone-900 leading-tight">
                  {currentUser?.name || 'Setup Profile'}
                </div>
                <div className="text-xs text-stone-500 font-medium">
                  {currentUser?.email || 'No email provided'}
                </div>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-red-100 text-[#d93829] text-[10px] font-extrabold">
                  {currentUser?.bloodGroup
                    ? `Type ${currentUser.bloodGroup}`
                    : 'Type Not Set'}
                </span>
              </div>
            </div>

            {/* Donor Availability Switch */}
            <div className="py-3 border-b border-stone-100 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-black text-stone-900">
                  Donation Availability
                </div>
                <div className="text-[10px] text-stone-500 font-semibold">
                  {currentUser?.availability
                    ? 'Active for emergency matches'
                    : 'Paused'}
                </div>
              </div>
              <button
                onClick={() => toggleAvailability()}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  currentUser?.availability
                    ? 'clay-btn-crimson bg-emerald-600 text-white shadow-sm'
                    : 'clay-btn-cream text-stone-700'
                }`}
              >
                {currentUser?.availability ? 'Available' : 'Paused'}
              </button>
            </div>

            {/* Quick Menu Links */}
            <div className="py-2 space-y-1">
              <Link
                to="/profile"
                onClick={() => onToggle(false)}
                className="w-full px-3 py-2 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-50 flex items-center gap-2"
              >
                <User className="w-3.5 h-3.5 text-stone-500" />
                <span>My Profile Settings</span>
              </Link>
              <Link
                to="/requests"
                onClick={() => onToggle(false)}
                className="w-full px-3 py-2 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-50 flex items-center gap-2"
              >
                <FileText className="w-3.5 h-3.5 text-stone-500" />
                <span>My Blood Requests</span>
              </Link>
              <Link
                to="/donors"
                onClick={() => onToggle(false)}
                className="w-full px-3 py-2 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-50 flex items-center gap-2"
              >
                <Search className="w-3.5 h-3.5 text-stone-500" />
                <span>Discover Requests</span>
              </Link>
            </div>

            {/* Logout */}
            <div className="pt-3 mt-2 border-t border-stone-100">
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="w-full px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 text-red-600" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
