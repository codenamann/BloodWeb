import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const Metrics = () => {
  return (
    <div className="relative z-10 mt-20 grid w-full max-w-6xl grid-cols-1 gap-6 px-4 md:grid-cols-3">
      <div className="group flex flex-col gap-2 rounded-xl border border-primary/10 bg-white/60 p-8 text-left backdrop-blur-md dark:border-primary/20 dark:bg-background-dark/50 transition-all hover:border-primary/50 shadow-sm hover:shadow-md">
        <p className="text-sm font-bold uppercase tracking-widest text-primary">Active Donors</p>
        <div className="flex items-baseline gap-3">
          <p className="text-4xl font-black text-slate-900 dark:text-white">12.5k</p>
          <p className="text-sm font-bold text-emerald-500 flex items-center gap-1">
            <TrendingUp strokeWidth={3} className="w-4 h-4" /> 12%
          </p>
        </div>
      </div>
      <div className="group flex flex-col gap-2 rounded-xl border border-primary/10 bg-white/60 p-8 text-left backdrop-blur-md dark:border-primary/20 dark:bg-background-dark/50 transition-all hover:border-primary/50 shadow-sm hover:shadow-md">
        <p className="text-sm font-bold uppercase tracking-widest text-primary">Lives Saved</p>
        <div className="flex items-baseline gap-3">
          <p className="text-4xl font-black text-slate-900 dark:text-white">8.2k</p>
          <p className="text-sm font-bold text-emerald-500 flex items-center gap-1">
            <TrendingUp strokeWidth={3} className="w-4 h-4" /> 5%
          </p>
        </div>
      </div>
      <div className="group flex flex-col gap-2 rounded-xl border border-primary/10 bg-white/60 p-8 text-left backdrop-blur-md dark:border-primary/20 dark:bg-background-dark/50 transition-all hover:border-primary/50 shadow-sm hover:shadow-md">
        <p className="text-sm font-bold uppercase tracking-widest text-primary">Response Time</p>
        <div className="flex items-baseline gap-3">
          <p className="text-4xl font-black text-slate-900 dark:text-white">&lt; 4m</p>
          <p className="text-sm font-bold text-primary flex items-center gap-1">
            <TrendingDown strokeWidth={3} className="w-4 h-4" /> 18%
          </p>
        </div>
      </div>
    </div>
  );
};

export default Metrics;
