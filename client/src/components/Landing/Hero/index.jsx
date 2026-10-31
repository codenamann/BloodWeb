import React from 'react';
import HeroBadge from './HeroBadge';
import HeroHeading from './HeroHeading';
import HeroActions from './HeroActions';
import HeroStatsBar from './HeroStatsBar';
import HeroHubScene from './HeroHubScene';

export const Hero = ({ onRequestBlood, onDonate }) => {
  return (
    <section id="hero" className="relative overflow-hidden pt-8 pb-16">
      {/* Ambient Floating Clay Spheres in Background */}
      <div>
        <div className="absolute top-8 left-8 w-5 h-5 clay-sphere opacity-70 animate-float-slow pointer-events-none hidden sm:block" />
        <div className="absolute top-36 left-[46%] w-3.5 h-3.5 clay-sphere-crimson opacity-80 animate-float-reverse pointer-events-none hidden lg:block" />
        <div className="absolute top-16 right-12 w-7 h-7 clay-sphere opacity-75 animate-float-slow pointer-events-none hidden sm:block" />
        <div className="absolute bottom-20 right-[45%] w-4 h-4 clay-sphere opacity-60 pointer-events-none hidden md:block" />
        <div className="absolute top-[52%] right-6 w-3 h-3 clay-sphere-crimson opacity-85 animate-pulse-subtle pointer-events-none hidden sm:block" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center lg:grid lg:grid-cols-2 gap-10 lg:gap-8 xl:gap-12">
          {/* LEFT COLUMN: Hero Copy, CTAs, Quick Stat Card */}
          <div className="space-y-5 sm:space-y-6 text-left z-10 w-full max-w-xl lg:max-w-none">
            <HeroBadge />
            <HeroHeading />
            <HeroActions onRequestBlood={onRequestBlood} onDonate={onDonate} />
            <HeroStatsBar />
          </div>

          {/* RIGHT COLUMN: 3D Clay Interactive Hub & Network Scene */}
          <HeroHubScene />
        </div>
      </div>
    </section>
  );
};

export default Hero;
