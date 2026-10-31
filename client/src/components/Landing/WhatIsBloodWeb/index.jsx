import React from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake, ShieldCheck, Users } from 'lucide-react';
import { Badge } from '../../ui';
import ValuePillCard from './ValuePillCard';

export const WhatIsBloodWeb = () => {
  const valuePills = [
    {
      icon: HeartHandshake,
      line1: 'People',
      line2: 'First',
    },
    {
      icon: ShieldCheck,
      line1: 'Community',
      line2: 'Driven',
    },
    {
      icon: Users,
      line1: 'Built for',
      line2: 'Real Impact',
    },
  ];

  return (
    <section id="about" className="relative py-12 sm:py-16 overflow-hidden scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Natural Clay Illustration with Floating Red Spheres */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Ambient Floating Clay Spheres */}
            <div
              className="w-7 h-7 sm:w-8 sm:h-8 clay-sphere-crimson absolute top-2 left-6 sm:left-10 animate-float-slow pointer-events-none z-10"
              aria-hidden="true"
            />
            <div
              className="w-9 h-9 sm:w-11 sm:h-11 clay-sphere-crimson absolute bottom-6 left-2 sm:left-4 animate-float-reverse pointer-events-none z-10"
              aria-hidden="true"
            />
            <div
              className="w-6 h-6 sm:w-7 sm:h-7 clay-sphere-crimson absolute top-4 right-8 sm:right-12 animate-float-slow pointer-events-none z-10"
              aria-hidden="true"
            />
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 clay-sphere-crimson absolute -bottom-2 right-4 sm:right-8 animate-float-reverse pointer-events-none z-10"
              aria-hidden="true"
            />

            {/* Heart-in-Hands Clay Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="relative z-0 w-full flex justify-center"
            >
              <img
                src="/assets/heart-in-hands.png"
                alt="BloodWeb Heart in Hands 3D Clay Illustration"
                className="w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[460px] h-auto object-contain select-none pointer-events-none drop-shadow-md"
                loading="eager"
              />
            </motion.div>
          </div>

          {/* Right Column: Heading, Narrative & 3 Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            {/* Eyebrow Badge */}
            <Badge
              variant="inset"
              className="inline-flex items-center gap-2 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-[#d93829] animate-pulse" />
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#575965]">
                About BloodWeb
              </span>
            </Badge>

            {/* Main Heading */}
            <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-black text-[#1c1d22] tracking-tight leading-[1.18] mb-4">
              A faster way to connect blood donors with people in need.
            </h2>

            {/* Narrative Body */}
            <p className="text-sm sm:text-base text-[#575965] font-medium leading-relaxed mb-8 max-w-2xl">
              BloodWeb is a real-time blood donation platform designed to reduce
              the time it takes to find compatible donors. Whether you need
              blood or want to help, BloodWeb brings the right people together
              through technology and a shared sense of humanity.
            </p>

            {/* 3 Horizontal Pill Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full">
              {valuePills.map((pill) => (
                <ValuePillCard
                  key={`${pill.line1}-${pill.line2}`}
                  icon={pill.icon}
                  line1={pill.line1}
                  line2={pill.line2}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export { ValuePillCard };
export default WhatIsBloodWeb;
