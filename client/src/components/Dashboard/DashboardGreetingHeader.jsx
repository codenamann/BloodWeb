import React from 'react';

export const DashboardGreetingHeader = ({ currentUser }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-4xl font-black text-[#1c1d22] tracking-normal flex items-center gap-2">
          {getGreeting()}, {currentUser?.name?.split(' ')[0]}!{' '}
          <span className="inline-block animate-bounce">👋</span>
        </h1>
        <p className="text-xs md:text-sm text-stone-500 font-semibold mt-1">
          Here's what's happening on BloodWeb today.
        </p>
      </div>

      {/* Inspirational Quote Card */}
      <div className="clay-card-flat px-4 py-3 bg-white/80 max-w-sm flex items-center gap-3 shadow-xs">
        <span className="text-xl">✨</span>
        <div className="text-xs">
          <p className="font-bold text-stone-800 italic">
            "The gift of blood is the gift of life."
          </p>
          <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">
            — Unknown
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardGreetingHeader;
