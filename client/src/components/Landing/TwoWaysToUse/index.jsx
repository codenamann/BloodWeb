import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowRight } from 'lucide-react';
import { Card, Badge, Button } from '../../ui';

export const TwoWaysToUse = ({ onRequestBlood, onDonate }) => {
  return (
    <section
      id="for-everyone"
      className="relative py-12 sm:py-16 overflow-hidden scroll-mt-20"
    >
      {/* Ambient Floating Clay Spheres */}
      <div
        className="w-8 h-8 sm:w-10 sm:h-10 clay-sphere-crimson absolute left-4 lg:left-8 top-12 pointer-events-none z-10 hidden sm:block animate-float-slow"
        aria-hidden="true"
      />
      <div
        className="w-7 h-7 sm:w-8 sm:h-8 clay-sphere-crimson absolute right-4 lg:right-12 bottom-8 pointer-events-none z-10 hidden sm:block animate-float-reverse"
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
              For Everyone
            </span>
          </Badge>

          <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-black text-[#1c1d22] tracking-tight leading-tight">
            Whether you need blood or want to give it, BloodWeb gives you a
            place to start.
          </h2>
        </div>

        {/* 2 Large Panels Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {/* Panel 1: I Need Blood */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="h-full"
          >
            <Card className="p-6 sm:p-8 rounded-[32px] bg-white flex flex-col sm:flex-row items-center gap-6 sm:gap-8 h-full group hover:-translate-y-1 transition-transform duration-200 justify-between">
              {/* Guy on Chair Illustration */}
              <div className="shrink-0 flex items-center justify-center sm:w-1/2">
                <img
                  src="/assets/guy-on-chair.png"
                  alt="Guy donating blood 3D clay illustration"
                  className="w-44 sm:w-52 lg:w-56 h-auto object-contain select-none pointer-events-none drop-shadow-sm"
                  loading="lazy"
                />
              </div>

              {/* Text & Action */}
              <div className="flex flex-col items-start text-left sm:w-1/2">
                <h3 className="text-2xl sm:text-3xl font-black text-[#1c1d22] tracking-tight mb-2">
                  I Need Blood
                </h3>

                <p className="text-xs sm:text-sm text-[#575965] font-medium leading-relaxed mb-6">
                  Create a request and connect with compatible donors in your
                  area.
                </p>

                <Button
                  variant="crimson"
                  size="default"
                  onClick={onRequestBlood}
                  className="group shadow-md flex items-center gap-2 px-5 py-2.5"
                >
                  <span>Request Blood</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Panel 2: I Want to Donate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="h-full"
          >
            <Card className="p-6 sm:p-8 rounded-[32px] bg-white flex flex-col sm:flex-row items-center gap-6 sm:gap-8 h-full group hover:-translate-y-1 transition-transform duration-200 justify-between">
              {/* Girl Heart Gesture Illustration */}
              <div className="shrink-0 flex items-center justify-center sm:w-1/2">
                <img
                  src="/assets/girl-heart-gesture.png"
                  alt="Girl heart gesture 3D clay illustration"
                  className="w-44 sm:w-52 lg:w-56 h-auto object-contain select-none pointer-events-none drop-shadow-sm"
                  loading="lazy"
                />
              </div>

              {/* Text & Action */}
              <div className="flex flex-col items-start text-left sm:w-1/2">
                <h3 className="text-2xl sm:text-3xl font-black text-[#1c1d22] tracking-tight mb-2">
                  I Want to Donate
                </h3>

                <p className="text-xs sm:text-sm text-[#575965] font-medium leading-relaxed mb-6">
                  Register as a donor, manage your availability, and respond
                  when someone needs blood.
                </p>

                <Button
                  variant="cream"
                  size="default"
                  onClick={onDonate}
                  className="group shadow-xs flex items-center gap-2 px-5 py-2.5 font-extrabold text-[#1c1d22] hover:text-[#d93829]"
                >
                  <span>Become a Donor</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TwoWaysToUse;
