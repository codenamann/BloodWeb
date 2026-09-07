import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { Button } from '../../ui';

export const FinalCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Decorative Floating Clay Spheres */}
      <div
        className="w-7 h-7 sm:w-8 sm:h-8 clay-sphere-crimson absolute left-4 lg:left-8 bottom-6 pointer-events-none z-10 hidden sm:block animate-float-slow"
        aria-hidden="true"
      />
      <div
        className="w-6 h-6 clay-sphere-crimson absolute right-6 top-8 pointer-events-none z-10 hidden sm:block animate-float-reverse"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl">
        <div className="rounded-[32px] bg-gradient-to-r from-[#e83e2f] via-[#d63426] to-[#b02013] p-7 sm:p-10 lg:p-12 text-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl relative overflow-hidden border border-red-400/30">
          {/* Subtle Ambient Depth */}
          <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute left-1/3 -top-20 w-60 h-60 rounded-full bg-black/10 blur-xl pointer-events-none" />

          {/* Left Side: White Clay Heart Icon & Text */}
          <div className="flex items-center gap-5 sm:gap-6 relative z-10">
            {/* White Clay Heart Badge */}
            <div className="clay-check-badge w-13 h-13 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl flex items-center justify-center text-white shrink-0 shadow-inner backdrop-blur-xs">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-white fill-white" />
            </div>

            {/* Headline & Body */}
            <div className="space-y-1 sm:space-y-1.5 text-left">
              <h2 className="text-xl sm:text-2xl lg:text-[28px] font-black tracking-tight text-white leading-snug">
                Be there when someone needs you.
              </h2>
              <p className="text-xs sm:text-sm lg:text-[15px] text-white/90 font-medium leading-relaxed max-w-xl">
                Join BloodWeb and be part of a more connected, more
                compassionate community.
              </p>
            </div>
          </div>

          {/* Right Side: Log In & Get Started Buttons */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 relative z-10 w-full sm:w-auto justify-start sm:justify-end pt-2 lg:pt-0">
            <Button
              variant="cream"
              onClick={() => navigate('/login')}
              className="px-6 py-2.5 font-black text-[#1c1d22] hover:scale-105 transition-transform"
            >
              Log In
            </Button>

            <Button
              variant="crimson"
              onClick={() => navigate('/register')}
              className="px-6 py-2.5 font-black text-white bg-[#a81c10] hover:bg-[#94150a] border border-white/30 shadow-md hover:scale-105 transition-transform flex items-center gap-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
