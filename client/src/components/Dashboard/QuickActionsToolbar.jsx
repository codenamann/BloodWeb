import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, User } from 'lucide-react';

export const QuickActionsToolbar = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-3 pt-2">
      <h3 className="text-xs font-black text-stone-400 uppercase tracking-wider">
        Quick Actions
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => navigate('/requests/create')}
          className="clay-card p-4 bg-white/95 flex items-center gap-3.5 hover:shadow-md cursor-pointer transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center text-[#d93829] shrink-0 group-hover:scale-105 transition-transform">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-stone-900 group-hover:text-[#d93829] transition-colors">
              Create Blood Request
            </h4>
            <p className="text-[11px] text-stone-500 font-medium">
              Request blood for someone in need &gt;
            </p>
          </div>
        </div>

        <div
          onClick={() => navigate('/donors')}
          className="clay-card p-4 bg-white/95 flex items-center gap-3.5 hover:shadow-md cursor-pointer transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700 shrink-0 group-hover:scale-105 transition-transform">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-stone-900 group-hover:text-blue-700 transition-colors">
              Discover Requests
            </h4>
            <p className="text-[11px] text-stone-500 font-medium">
              Find and volunteer for requests &gt;
            </p>
          </div>
        </div>

        <div
          onClick={() => navigate('/profile')}
          className="clay-card p-4 bg-white/95 flex items-center gap-3.5 hover:shadow-md cursor-pointer transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0 group-hover:scale-105 transition-transform">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-stone-900 group-hover:text-amber-700 transition-colors">
              Update Profile
            </h4>
            <p className="text-[11px] text-stone-500 font-medium">
              Keep your information current &gt;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsToolbar;
