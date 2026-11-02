import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Bell, ChevronRight } from 'lucide-react';
import { ClayDropCharacter } from '../ClayAssets/ClayIllustrations';

export const RecentNotificationsFeed = ({ recentNotifs }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full lg:w-1/3 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base md:text-lg font-black text-stone-900 tracking-tight">
          Recent Notifications
        </h3>
        <Link
          to="/notifications"
          className="text-xs font-black text-[#d93829] hover:underline flex items-center gap-1"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {recentNotifs.map((n) => (
          <div
            key={n._id}
            onClick={() => {
              if (n.redirectUrl) navigate(n.redirectUrl);
            }}
            className="clay-card p-3.5 bg-white/95 flex items-start justify-between gap-3 hover:shadow-md cursor-pointer transition-all"
          >
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700 shrink-0 mt-0.5">
                <Bell className="w-3.5 h-3.5 text-[#d93829]" />
              </div>
              <div>
                <div className="text-xs font-black text-stone-900 leading-tight">
                  {n.title}
                </div>
                <p className="text-[11px] text-stone-500 font-medium mt-0.5 line-clamp-1">
                  {n.body}
                </p>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-stone-300 shrink-0 mt-2" />
          </div>
        ))}
      </div>

      {/* Clay Sitting Drop Character Quote Card */}
      <div className="clay-card p-4 bg-white/95 flex items-center gap-3 shadow-xs">
        <div className="shrink-0 w-16 h-16 flex items-center justify-center">
          <ClayDropCharacter size={56} />
        </div>
        <div className="text-xs">
          <p className="font-bold text-stone-800 italic">
            "You don't have to be a doctor to save lives."
          </p>
          <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">
            — Just a Donor
          </span>
        </div>
      </div>
    </div>
  );
};

export default RecentNotificationsFeed;
