import React from 'react';

const CallToAction = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 rounded-3xl bg-primary px-8 py-16 md:px-20 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl mix-blend-overlay"></div>
          
          <div className="text-white max-w-xl relative z-10">
            <h2 className="text-4xl font-black text-slate-50 mb-4 tracking-tight">Be the heartbeat of your community.</h2>
            <p className="text-lg opacity-90 leading-relaxed">
              Every donation can save up to three lives. Join thousands of active donors today and help us ensure no emergency goes unanswered.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 relative z-10">
            <button className="bg-white text-primary px-10 py-4 rounded-lg font-bold text-lg hover:bg-slate-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 cursor-pointer">
              Register yourself
            </button>
            <button className="bg-primary border border-white/30 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-colors cursor-pointer">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
