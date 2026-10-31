import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import ClayBloodDrop from '../../ClayAssets/ClayBloodDrop';
import { motion } from 'motion/react';

const Sidebar = ({ navItems, activeNav }) => {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 space-y-6 sticky top-28 self-start max-h-[calc(100vh-8rem)] select-none">
      {/* Navigation Pill List */}
      <nav className="clay-card-flat p-3 bg-white/90 space-y-1.5 shadow-sm">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            (activeNav
              ? activeNav === item.name
              : location.pathname === item.path) ||
            (item.path === '/requests' &&
              location.pathname.startsWith('/requests') &&
              location.pathname !== '/requests/create');

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={`relative px-4 py-3 rounded-2xl text-xs font-black flex items-center justify-between transition-all cursor-pointer hover:bg-white/80`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 clay-btn-crimson text-white shadow-md transition-none!"
                  style={{ borderRadius: 16 }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 40,
                  }}
                />
              )}
              <div
                className={`flex z-10 items-center gap-3 ${isActive ? 'text-white' : 'text-[#575965] hover:text-[#1c1d22]'}`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </div>
              {item.badge > 0 && (
                <span
                  className={`px-2 py-0.5 z-10 rounded-full text-[10px] font-black ${
                    isActive
                      ? 'bg-white text-[#d93829]'
                      : 'bg-[#d93829] text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Supportive Motivation Card */}
      <div className="clay-card p-5 bg-white/95 text-center space-y-3 shadow-md relative overflow-hidden">
        <div className="w-14 h-14 mx-auto flex items-center justify-center">
          <ClayBloodDrop size={48} />
        </div>
        <div>
          <h4 className="text-xs font-black text-[#d93829] tracking-wide">
            A little kindness goes a long way.
          </h4>
          <p className="text-[11px] text-stone-500 font-semibold mt-1">
            Be available. Be the difference.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
