import React from 'react';
import { motion } from 'framer-motion';
import {
  Lock,
  CheckCircle2,
  Droplets,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Badge } from '../../ui';

export const TrustAndSafety = () => {
  const capabilities = [
    {
      icon: Lock,
      title: 'Secure Accounts',
      description: 'Protected access and user authentication.',
    },
    {
      icon: CheckCircle2,
      title: 'Controlled Availability',
      description: 'Donors control when they are available.',
    },
    {
      icon: Droplets,
      title: 'Blood Group Based',
      description: 'Helps find potentially compatible donors.',
    },
    {
      icon: MapPin,
      title: 'Location Aware',
      description: 'Prioritizes nearby donors.',
    },
    {
      icon: MessageSquare,
      title: 'Request-Specific Chat',
      description: 'Communication stays within the platform.',
    },
    {
      icon: ShieldCheck,
      title: 'Privacy Focused',
      description: 'Only relevant information is shared.',
    },
  ];

  return (
    <section
      id="trust-and-safety"
      className="relative py-12 sm:py-16 overflow-hidden scroll-mt-20"
    >
      {/* Decorative Floating Clay Spheres */}
      <div
        className="w-6 h-6 clay-sphere-crimson absolute right-6 top-16 pointer-events-none z-10 hidden sm:block animate-float-slow"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <Badge
            variant="inset"
            className="inline-flex items-center gap-2 mb-8"
          >
            <Zap className="w-3.5 h-3.5 text-[#d93829] fill-[#d93829]" />
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#575965]">
              Trust & Safety
            </span>
          </Badge>

          <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-black text-[#1c1d22] tracking-tight leading-tight">
            A platform designed with care.
          </h2>

          <p className="text-sm sm:text-base text-[#575965] font-medium leading-relaxed max-w-2xl mx-auto">
            Your privacy and safety matter. Here's how BloodWeb keeps things
            responsible and secure.
          </p>
        </div>

        {/* 6 Capabilities Horizontal Row / Responsive Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-6 max-w-6xl mx-auto">
          {capabilities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.07 }}
                className="flex flex-col items-center text-center group"
              >
                {/* Clay Icon Container */}
                <Badge variant="inset" className="mb-3.5 px-3.5 py-3.5">
                  <Icon className="w-6 h-6 text-[#d93829] stroke-[2.5]" />
                </Badge>

                {/* Title */}
                <h3 className="text-xs sm:text-sm font-black text-[#1c1d22] mb-1 leading-snug group-hover:text-[#d93829] transition-colors">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-[11px] sm:text-xs text-[#575965] font-medium leading-relaxed max-w-[170px]">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustAndSafety;
