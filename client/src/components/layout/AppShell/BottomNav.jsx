import React from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Search,
  User,
} from 'lucide-react';

const BottomNav = ({ location }) => {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-stone-200/80 px-2 py-2 shadow-2xl">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {[
          { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Requests', path: '/requests', icon: FileText },
          {
            name: 'Create',
            path: '/requests/create',
            icon: PlusCircle,
            isCreate: true,
          },
          { name: 'Discover', path: '/donors', icon: Search },
          { name: 'Profile', path: '/profile', icon: User },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;

          if (tab.isCreate) {
            return (
              <Link
                key={tab.name}
                to={tab.path}
                className="w-11 h-11 rounded-full clay-btn-crimson flex items-center justify-center -mt-5 shadow-lg text-white"
                aria-label="Create Request"
              >
                <Icon className="w-5 h-5" />
              </Link>
            );
          }

          return (
            <Link
              key={tab.name}
              to={tab.path}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
                isActive
                  ? 'text-[#d93829] font-black'
                  : 'text-stone-500 font-bold'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px]">{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
