import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { ClayHandsHeart, ClayCalendar } from '../ClayAssets/ClayIllustrations';

export const CommunityHeroBanner = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Main Hero Banner (2-Cols) */}
      <div className="w-full lg:w-3/4 clay-card p-6 md:p-8 bg-gradient-to-r from-red-50/90 via-orange-50/50 to-white/95 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md relative overflow-hidden border border-red-100/50">
        <div className="flex flex-col gap-3 text-center md:text-left z-10 max-w-md">
          <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-[#d93829] text-[10px] font-black uppercase tracking-wider">
            Community Emergency Dispatch
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-stone-900 leading-tight">
            Be Someone's Second Chance
          </h2>
          <p className="text-xs md:text-sm text-stone-600 font-medium">
            Your willingness to help can give someone a healthier tomorrow.
            Explore active blood requests in your region.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate('/donors')}
              className="clay-btn-crimson px-5 py-2.5 text-xs md:text-sm font-bold flex items-center gap-2 shadow-lg cursor-pointer inline-flex w-fit mx-auto md:mx-0"
            >
              <span>Explore Requests</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3D Clay Hands Illustration */}
        <div className="shrink-0 flex items-center justify-center relative">
          <ClayHandsHeart size={160} />
        </div>
      </div>

      {/* Upcoming Actions Card (1-Col) */}
      <div className="w-full lg:w-1/3 clay-card p-6 bg-white/95 flex flex-col justify-between text-center shadow-sm">
        <div className="flex items-center gap-2 text-stone-800 pb-3 border-b border-stone-100 text-left">
          <Clock className="w-4 h-4 text-stone-500" />
          <span className="text-xs font-black uppercase tracking-wider">
            Upcoming Actions
          </span>
        </div>

        <div className="my-auto py-6 space-y-3">
          <div className="flex justify-center">
            <ClayCalendar size={72} />
          </div>
          <div>
            <h4 className="text-xs font-black text-stone-900">
              No upcoming Actions
            </h4>
            <p className="text-[11px] text-stone-500 font-medium mt-0.5">
              You're all caught up!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityHeroBanner;
