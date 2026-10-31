import React from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Zap } from 'lucide-react';
import { Badge, Card } from '../../ui';

export const ContactSection = () => {
  return (
    <section
      id="contact"
      className="relative py-12 sm:py-16 overflow-hidden scroll-mt-20"
    >
      {/* Decorative Floating Clay Spheres */}
      <div
        className="w-9 h-9 sm:w-11 sm:h-11 clay-sphere-crimson absolute right-4 lg:right-10 top-1/2 -translate-y-1/2 pointer-events-none z-10 hidden md:block animate-float-slow"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-start mb-8"></div>

        {/* 2-Column Split: Question text on Left, Email Card on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Heading & Body */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-7 space-y-4"
          >
            <Badge
              variant="inset"
              className="inline-flex items-center gap-2 mb-8"
            >
              <Zap className="w-3.5 h-3.5 text-[#d93829] fill-[#d93829]" />
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#575965]">
                Get In Touch
              </span>
            </Badge>

            <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-black text-[#1c1d22] tracking-tight leading-tight">
              Have a question about BloodWeb?
            </h2>

            <p className="text-sm sm:text-base text-[#575965] font-medium leading-relaxed max-w-xl">
              We'd love to hear from you. Whether it's feedback, a suggestion,
              or just a hello — feel free to reach out.
            </p>
          </motion.div>

          {/* Right Column: Contact Email Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="lg:col-span-5"
          >
            <a href="mailto:support@bloodweb.in" className="block group">
              <Card
                variant="flat"
                className="p-5 sm:p-7 rounded-[30px] bg-white/95 flex items-center justify-between gap-4 shadow-sm group-hover:-translate-y-1 transition-transform duration-200"
              >
                <div className="flex items-center gap-4">
                  {/* Mail Icon Pill */}
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ffdcd7] via-[#fbeae8] to-[#f5d5d0] border border-red-200/50 flex items-center justify-center text-[#d93829] shrink-0 group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5 text-[#d93829] stroke-[2.2]" />
                  </div>

                  {/* Text Details */}
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-[#1c1d22]">
                      Email Us
                    </span>
                    <span className="text-xs sm:text-sm text-[#575965] font-semibold group-hover:text-[#d93829] transition-colors">
                      namantiwari.dev@gmail.com
                    </span>
                  </div>
                </div>

                {/* Right Arrow Indicator */}
                <div className="text-stone-400 group-hover:text-[#d93829] group-hover:translate-x-1 transition-all text-base font-bold select-none pr-1">
                  →
                </div>
              </Card>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
