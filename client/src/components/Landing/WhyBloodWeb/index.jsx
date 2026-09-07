import React from 'react';
import { Zap, MapPin, Droplets, User } from 'lucide-react';
import { Badge } from '../../ui';
import FeatureCard from './FeatureCard';

export const WhyBloodWeb = () => {
  const features = [
    {
      icon: Zap,
      title: 'Real-Time Requests',
      description:
        'Entered requests can be created and communicated through a centralized platform.',
    },
    {
      icon: MapPin,
      title: 'Location-Based Discovery',
      description: 'Nearby donors can be prioritized based on location.',
    },
    {
      icon: Droplets,
      title: 'Blood Group Matching',
      description:
        'Donor and request information helps identify potentially compatible donors.',
    },
    {
      icon: User,
      title: 'Donor Availability',
      description:
        'Donors can indicate whether they are currently available to respond to requests.',
    },
  ];

  return (
    <section
      id="why-bloodweb"
      className="relative py-16 overflow-hidden scroll-mt-20"
    >
      {/* Decorative Floating Clay Sphere on right edge */}
      <div
        className="w-9 h-9 sm:w-11 sm:h-11 clay-sphere-crimson absolute right-4 lg:right-10 top-1/2 -translate-y-1/2 pointer-events-none z-10 hidden md:block animate-float-slow"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <Badge
            variant="inset"
            className="inline-flex items-center gap-2 mb-8"
          >
            <Zap className="w-3.5 h-3.5 text-[#d93829] fill-[#d93829]" />
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#575965]">
              Why BloodWeb
            </span>
          </Badge>

          <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-black text-[#1c1d22] tracking-tight">
            Built around the moments that matter.
          </h2>

          <p className="text-sm sm:text-base text-[#575965] font-medium leading-relaxed max-w-2xl mx-auto">
            Practical features designed to make blood donation coordination
            easier and more effective.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={idx * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export { FeatureCard };
export default WhyBloodWeb;
