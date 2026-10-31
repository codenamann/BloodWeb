import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { Card, Badge } from '../../ui';

export const AboutSection = () => {
  return (
    <section
      id="mission"
      className="relative py-12 sm:py-16 overflow-hidden scroll-mt-20"
    >
      {/* Ambient Floating Clay Spheres */}
      <div
        className="w-8 h-8 sm:w-10 sm:h-10 clay-sphere-crimson absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 pointer-events-none z-10 hidden sm:block animate-float-slow"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}

        {/* 2-Column Split: Narrative on Left, Quote Card on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          {/* Left Column: Heading & Narrative */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="space-y-4"
          >
            <Badge
              variant="inset"
              className="inline-flex items-center gap-2 mb-8"
            >
              <Zap className="w-3.5 h-3.5 text-[#d93829] fill-[#d93829]" />
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#575965]">
                Our Mission
              </span>
            </Badge>
            <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-black text-[#1c1d22] tracking-tight leading-tight">
              Why BloodWeb exists.
            </h2>

            <p className="text-sm sm:text-base text-[#575965] font-medium leading-relaxed max-w-xl">
              Finding blood during an emergency can involve scattered contacts,
              social media posts, and manual coordination. BloodWeb aims to
              bring those processes into one real-time platform where blood
              requests and compatible donors can be connected more efficiently.
            </p>
          </motion.div>

          {/* Right Column: Pull Quote Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className=""
          >
            <Card className="relative px-6 sm:px-12 lg:px-16 py-8 sm:py-10 rounded-[32px] bg-white flex justify-between shadow-sm group hover:-translate-y-0.5 transition-transform duration-200">
              {/* Top Quote Mark */}
              <div
                className="absolute text-7xl left-5 top-5 font-black text-[#d93829]/20 font-serif select-none -mb-1"
                aria-hidden="true"
              >
                “
              </div>

              <div>
                {/* Quote Body */}
                <p className="text-base sm:text-lg lg:text-xl font-extrabold text-[#1c1d22] leading-relaxed mb-4">
                  A stronger, more supportive community can save more lives.
                </p>

                {/* Red Divider Pill */}
                <div className="w-8 h-1 bg-[#d93829] rounded-full mb-3" />

                {/* Author & Closing Mark */}
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-black text-[#747682]">
                    The BloodWeb Team
                  </span>
                </div>
              </div>
              <div
                className="absolute -bottom-2 right-6 text-7xl font-black text-[#d93829]/20 font-serif select-none -mt-4"
                aria-hidden="true"
              >
                ”
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
