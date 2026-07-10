import React from 'react';
import { Navigation, BellRing } from 'lucide-react';

const Features = () => {
  return (
    <section className="bg-slate-50 py-24 dark:bg-background-dark/50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 max-w-2xl">
          <h2 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            The Life-Saving Engine
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Our modern infrastructure ensures that blood reaches where it's needed most, instantly. We use cutting edge technology to bridge the gap between need and supply.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="group relative overflow-hidden rounded-2xl bg-white p-8 dark:bg-background-dark dark:border dark:border-primary/10 transition-all hover:shadow-2xl hover:shadow-primary/5">
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30">
              <Navigation className="w-8 h-8" />
            </div>
            <h3 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">Real-time Routing</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Dynamic GPS-based routing to bypass traffic and deliver life-saving units faster. Our AI analyzes live traffic patterns to find the quickest path to any hospital or emergency site.
            </p>
            <div className="mt-8 overflow-hidden rounded-lg">
              <img className="h-48 w-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-500" alt="Routing map indicator" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIIwanXe5IBbxTb1jeMHiSYoE5MXKmZysT6XbeU-tff4XBLC07mwKhbBTGuJPVvbnSzPJ_mefP75kSkWzK0ttlHsWfvarqbNDteGvg4ZXNyjXnMIKswvUGJ86obqxlpd9GQycsAkYTBkLqsdFxuoriIeqmXwxHdOqV527rNRmvfOSvA3BXJWNIDz6otyyeE0SWmpzQ5tJNDyZRzXFES1wVQ6YzfYn6OXu9vNnY6o5jVzNhbnVLTXnJGbIgi-p8CUaRXOLW_B6UazE" />
            </div>
          </div>
          
          <div className="group relative overflow-hidden rounded-2xl bg-white p-8 dark:bg-background-dark dark:border dark:border-primary/10 transition-all hover:shadow-2xl hover:shadow-primary/5">
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30">
              <BellRing className="w-8 h-8" />
            </div>
            <h3 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">Instant Alerts</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Immediate push notifications to matching donors the moment an emergency is logged. We match blood types and location proximity to mobilize the community in seconds.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <div className="rounded-lg bg-slate-100 p-4 dark:bg-primary/5 border-l-4 border-primary">
                <p className="text-xs font-bold text-primary uppercase">Urgent Alert</p>
                <p className="text-sm font-medium dark:text-slate-200">B+ Type needed at St. Jude Hospital</p>
              </div>
              <div className="rounded-lg bg-slate-100 p-4 dark:bg-white/5 opacity-50">
                <p className="text-xs font-bold text-slate-400 uppercase">Status: Mobilized</p>
                <p className="text-sm font-medium dark:text-slate-300">4 donors are on their way</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
