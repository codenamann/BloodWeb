import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, User } from 'lucide-react';
import ClayLogo from '../../ClayAssets/ClayLogo';
import { motion, AnimatePresence } from 'framer-motion';

const MobileDrawer = ({
  mobileMenuOpen,
  setMobileMenuOpen,
  navItems,
  location,
  currentUser,
}) => {
  return (
    <AnimatePresence>
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative flex w-72 max-w-[80vw] flex-col justify-between bg-[#f6f1eb] p-6 shadow-2xl z-50 h-full"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <ClayLogo size="md" to="/dashboard" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-2xl clay-btn-cream text-stone-700 hover:shadow-md transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation in Drawer */}
              <nav className="clay-card-flat p-3 bg-white/90 space-y-1.5 shadow-sm">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-3 rounded-2xl text-xs font-black flex items-center justify-between transition-all cursor-pointer ${
                        isActive
                          ? 'clay-btn-crimson text-white shadow-md'
                          : 'text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </div>
                      {item.badge > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-[#d93829] text-white text-[10px] font-black">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* User Quick Info in Drawer Bottom */}
            <div className="clay-card p-4 bg-white/95 flex items-center gap-3 shadow-md mt-4">
              <div className="w-10 h-10 rounded-full bg-stone-100 border border-stone-200/80 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-stone-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-black text-stone-900 truncate">
                  {currentUser?.name || 'Setup Profile'}
                </div>
                <div className="text-[10px] font-bold text-stone-500">
                  {currentUser?.bloodGroup
                    ? currentUser.bloodGroup
                    : 'Blood Type: --'}{' '}
                  | {currentUser?.location?.city || ''}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MobileDrawer;
